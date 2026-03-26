import re

def remove_duplicates(steps):
    return list(dict.fromkeys(steps))

def break_task(text):
    """
    Generate learning steps using the SHARED model from the app.
    """
    try:
        from app import shared_model as model, shared_tokenizer as tokenizer
        
        if model is None or tokenizer is None:
            return [f"Step 1: Understand what {text} means.", "Step 2: Learn the key concepts."]

        prompt = f"Break down the concept of {text} into a logical sequence of simple steps."
        inputs = tokenizer(prompt, return_tensors="pt")
        outputs = model.generate(**inputs, max_new_tokens=150)
        result = tokenizer.decode(outputs[0], skip_special_tokens=True)

        steps = re.split(r'\d+\.|\*|-', result)
        steps = [s.strip() for s in steps if s.strip() and len(s) > 3]

        if not steps:
            steps = [s.strip() for s in result.split('.') if len(s.strip()) > 5]
            
        return steps if steps else [result]
    except Exception as e:
        print(f"ERROR in break_task: {e}")
        return [f"Understand the basics of {text}.", "Practice with examples.", "Review and apply knowledge."]