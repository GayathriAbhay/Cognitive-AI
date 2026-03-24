from transformers import pipeline

generator = pipeline("text2text-generation", model="t5-small")

def process_text(text):
    prompt = "simplify: " + text
    result = generator(prompt, max_length=100)
    return result[0]['generated_text']