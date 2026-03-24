from transformers import pipeline

generator = pipeline("text2text-generation", model="t5-small")

def break_task(text):
    prompt = "break this into step-by-step instructions: " + text
    result = generator(prompt, max_length=150)
    return result[0]['generated_text'].split('.')