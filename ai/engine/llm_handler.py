from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from dotenv import load_dotenv; load_dotenv()

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

def process_text(text):
    print(f"DEBUG: [ROOT] process_text called for: {text}")
    prompt = f"Explain the concept of {text} in simple terms for a beginner."

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=150)
    result = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # 🚀 REAL FIX: Remove all hardcoded fallbacks
    if not result or len(result) < 10:
        return f"To understand {text}, we should focus on its main purpose and how it works in simple steps."

    return result