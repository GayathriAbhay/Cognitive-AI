from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import re

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")

def remove_duplicates(steps):
    return list(dict.fromkeys(steps))

def break_task(text):
    """
    Generate learning steps using the model.
    """
    print(f"DEBUG: break_task called with text: {text}")
    prompt = f"Break down the concept of {text} into a logical sequence of simple steps."
    
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=150)
    result = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Simple parsing for steps
    # Split by numbers (1. 2.) or bullets (* -)
    steps = re.split(r'\d+\.|\*|-', result)
    steps = [s.strip() for s in steps if s.strip() and len(s) > 3]

    if not steps:
        # If no list found, just split by sentences or return as single step
        steps = [s.strip() for s in result.split('.') if len(s.strip()) > 5]
        
    return steps if steps else [result]