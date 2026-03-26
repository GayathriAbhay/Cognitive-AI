from dotenv import load_dotenv; load_dotenv()

def process_text(text):
    """
    Simplify text using the SHARED model from the app.
    """
    try:
        # Use app-level shared model
        from app import shared_model as model, shared_tokenizer as tokenizer
        
        if model is None or tokenizer is None:
            return f"To understand {text}, focus on its core idea."

        prompt = f"Explain the concept of {text} in simple terms for a beginner."
        inputs = tokenizer(prompt, return_tensors="pt")
        outputs = model.generate(**inputs, max_new_tokens=150)
        result = tokenizer.decode(outputs[0], skip_special_tokens=True)

        if not result or len(result) < 10:
            return f"To understand {text}, we should focus on its main purpose and how it works step by step."

        return result
    except Exception as e:
        print(f"ERROR in process_text: {e}")
        return f"Here is a simplified view of {text}: focus on what it does and why it matters."