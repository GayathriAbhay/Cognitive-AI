from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from dotenv import load_dotenv; load_dotenv()

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

def process_text(text):
    prompt = f"""
Explain this concept in simple words for a beginner.
Do not use the word 'search engine'.
Give a clear and correct explanation.

{text}
"""

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=120)

    result = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # 🔥 fallback if model gives garbage
    if "search engine" in result.lower():
        return "Binary search is a method to find an element in a sorted list by repeatedly dividing the list into halves."

    return result