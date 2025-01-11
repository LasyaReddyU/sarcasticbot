import os
import random
import PyPDF2
import docx
import textwrap
import pyttsx3
from gtts import gTTS
import tempfile
import platform
import subprocess
import time
from typing import List, Dict, Optional
import json

class SarcasticQuizBot:
    def __init__(self, tts_engine='pyttsx3'):
        # Initialize text-to-speech
        self.tts_engine = tts_engine
        if tts_engine == 'pyttsx3':
            self.speaker = pyttsx3.init()
            self.speaker.setProperty('rate', 150)
            self.speaker.setProperty('volume', 0.9)
            print("pyttsx3 initialized successfully.")
        
        # Create a temporary directory for Google TTS audio files
        self.temp_dir = tempfile.mkdtemp()
        self.temp_counter = 0

        # Token limits
        self.MAX_INPUT_TOKENS = 4000
        self.COMPLETION_TOKENS = 2000
        self.CHARS_PER_TOKEN = 4
        
        self.roasts = [
            "Wow, that's impressively wrong! Did you even read the document?",
            "Oh honey... The answer was right there in the text. Like, literally right there.",
            "That's about as correct as saying the Earth is flat.",
            "Amazing! You managed to ignore everything in the document!",
            "Did you actually read the text, or just use it as a pillow?",
            "I'm not saying you're wrong, but... actually, yes, I am saying that.",
            "Congratulations! You've mastered the art of not absorbing information!",
            "Even a goldfish would remember more from the text!"
        ]
        
        self.summary_intros = [
            "Alright, buckle up buttercup! Here's what this masterpiece is about:",
            "Oh boy, let me break down this literary gem for you:",
            "Prepare yourself for this absolutely riveting summary:",
            "Here's what you apparently couldn't figure out yourself:",
            "Let me dumb this down to its essence:",
            "Warning: The following summary contains actual information:",
            "Behold, the contents of your document, simplified for your convenience:"
        ]
        
        self.score_comments = {
            0: "Wow, a perfect zero! You've truly mastered the art of not learning!",
            1: "One right answer... Did you actually read the document or just guess?",
            2: "Two correct! Your reading comprehension is as deep as a parking lot puddle.",
            3: "Three right! Moving up from 'totally clueless' to just 'mostly clueless'.",
            4: "Four correct. Are you even trying to understand the material?",
            5: "Half right! Perfectly balanced between knowledge and ignorance.",
            6: "Six correct! Starting to show signs of actually reading the document.",
            7: "Seven! Not bad... for someone who probably skimmed the text.",
            8: "Eight right! Almost impressive, if I had lower standards.",
            9: "Nine correct! Who knew you could actually read?",
            10: "Perfect score! What, did you write this document yourself or something?"
        }

    def read_file(self, file_path: str) -> str:
        """Read and extract text from various file formats."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        file_ext = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_ext == '.txt':
                with open(file_path, 'r', encoding='utf-8') as file:
                    return file.read()
            
            elif file_ext == '.pdf':
                text = []
                with open(file_path, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        text.append(page.extract_text())
                return ' '.join(text)
            
            elif file_ext in ['.docx', '.doc']:
                doc = docx.Document(file_path)
                return ' '.join([paragraph.text for paragraph in doc.paragraphs])
            
            else:
                raise ValueError(f"Unsupported file format: {file_ext}")
                
        except Exception as e:
            raise Exception(f"Error reading file: {str(e)}")

    def generate_questions(self, text: str) -> List[Dict]:
        """Generate questions from the document text."""
        sentences = text.split('.')
        questions = []
        
        for i in range(min(10, len(sentences))):
            sentence = sentences[i].strip()
            if len(sentence) < 20:  # Skip short sentences
                continue
                
            words = sentence.split()
            if len(words) < 5:  # Skip very short sentences
                continue
                
            # Create a fill-in-the-blank question
            blank_word_idx = random.randint(2, len(words) - 1)
            correct_answer = words[blank_word_idx]
            words[blank_word_idx] = "_____"
            
            question = {
                'question': ' '.join(words) + "?",
                'correct_answer': correct_answer,
                'wrong_answers': self._generate_wrong_answers(correct_answer, text)
            }
            questions.append(question)
            
            if len(questions) == 10:  # Limit to 10 questions
                break
                
        return questions

    def _generate_wrong_answers(self, correct_answer: str, text: str) -> List[str]:
        """Generate plausible wrong answers."""
        words = [word for word in text.split() if len(word) > 3]
        wrong_answers = []
        
        while len(wrong_answers) < 3:
            word = random.choice(words)
            if word != correct_answer and word not in wrong_answers:
                wrong_answers.append(word)
                
        return wrong_answers

    def summarize_text(self, text: str) -> str:
        """Generate a sarcastic summary of the text."""
        sentences = text.split('.')
        summary_length = min(5, len(sentences))
        summary = '. '.join(sentences[:summary_length]) + '.'
        
        return f"{random.choice(self.summary_intros)}\n{summary}"

    def play_audio(self, audio_file: str):
        """Cross-platform audio playback."""
        system = platform.system().lower()
        
        try:
            if system == 'darwin':  # macOS
                subprocess.run(['afplay', audio_file], check=True)
            elif system == 'linux':
                subprocess.run(['paplay', audio_file], check=True)
            elif system == 'windows':
                from win32com.client import Dispatch
                wmp = Dispatch("WMPlayer.OCX")
                wmp.URL = audio_file
                wmp.controls.play()
                while wmp.playState != 1:  # 1 = Stopped
                    time.sleep(0.1)
            else:
                print(f"Unsupported platform: {system}")
        except Exception as e:
            print(f"Error playing audio: {str(e)}")
            print("Continuing without audio playback...")

    def speak_text(self, text: str):
        """Convert text to speech using the selected engine."""
        try:
            if self.tts_engine == 'pyttsx3':
                print(f"Speaking with pyttsx3: {text}")
                self.speaker.say(text)
                self.speaker.runAndWait()
            else:  # Use Google TTS
                self.temp_counter += 1
                temp_file = os.path.join(self.temp_dir, f'speech_{self.temp_counter}.mp3')
                print(f"Saving Google TTS audio to {temp_file}")
                
                tts = gTTS(text=text, lang='en')
                tts.save(temp_file)
                
                self.play_audio(temp_file)
                
                try:
                    os.remove(temp_file)
                except:
                    pass
        except Exception as e:
            print(f"Speech error: {str(e)}")
            print("Continuing without speech...")

    def run_quiz(self, document_text: str):
        """Run the interactive quiz."""
        # Generate summary and speak it
        summary = self.summarize_text(document_text)
        print("\n" + summary + "\n")
        self.speak_text(summary)
        
        # Generate questions
        questions = self.generate_questions(document_text)
        score = 0
        
        print("\nLet's see if you were paying attention...\n")
        self.speak_text("Let's see if you were paying attention...")
        
        for i, q in enumerate(questions, 1):
            print(f"\nQuestion {i}: {q['question']}")
            self.speak_text(f"Question {i}: {q['question']}")
            
            # Display options
            options = [q['correct_answer']] + q['wrong_answers']
            random.shuffle(options)
            
            for j, option in enumerate(['A', 'B', 'C', 'D']):
                print(f"{option}. {options[j]}")
            
            # Get answer
            while True:
                answer = input("\nYour answer (A/B/C/D): ").upper()
                if answer in ['A', 'B', 'C', 'D']:
                    break
                print("That's not a valid option. Try again!")
            
            # Check answer
            correct = options[ord(answer) - ord('A')] == q['correct_answer']
            if correct:
                score += 1
                response = "Correct! Don't let it go to your head."
            else:
                response = f"{random.choice(self.roasts)} The correct answer was: {q['correct_answer']}"
            
            print(response)
            self.speak_text(response)
        
        # Final score
        final_comment = f"\nFinal Score: {score}/10\n{self.score_comments[score]}"
        print(final_comment)
        self.speak_text(final_comment)

    def cleanup(self):
        """Clean up resources."""
        if self.tts_engine == 'pyttsx3':
            self.speaker.stop()
        if os.path.exists(self.temp_dir):
            try:
                for file in os.listdir(self.temp_dir):
                    try:
                        os.remove(os.path.join(self.temp_dir, file))
                    except:
                        pass
                os.rmdir(self.temp_dir)
            except:
                pass

def main():
    print("Welcome to the Sarcastic Document Quiz Bot!")
    print("Choose your text-to-speech engine:")
    print("1. pyttsx3 (offline, faster)")
    print("2. Google TTS (online, more natural)")
    
    while True:
        choice = input("Enter 1 or 2: ")
        if choice in ['1', '2']:
            break
        print("That's not a valid choice. Try again!")
    
    tts_engine = 'pyttsx3' if choice == '1' else 'gtts'
    quiz_bot = SarcasticQuizBot(tts_engine=tts_engine)
    
    print("\nI'll read your document, summarize it with attitude, then test how well you actually read it.")
    
    try:
        while True:
            file_path = input("\nEnter the path to your document (or 'quit' to exit): ")
            if file_path.lower() == 'quit':
                break
                
            try:
                document_text = quiz_bot.read_file(file_path)
                quiz_bot.run_quiz(document_text)
                
                play_again = input("\nWant to test your reading comprehension on another document? (yes/no): ").lower()
                if play_again != 'yes':
                    print("\nProbably for the best. Your ego couldn't take much more anyway.")
                    break
                    
            except Exception as e:
                print(f"\nOops! Something went wrong: {str(e)}")
                print("Maybe try a file that actually exists next time?")
    
    finally:
        quiz_bot.cleanup()

if __name__ == "__main__":
    main()
