import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
print("OPENAI VERSION RUNNING")

def process_text(text):
    print("USING OPENAI API")
    print(f"DEBUG: {text}")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful teacher who explains concepts clearly and correctly."
                },
                {
                    "role": "user",
                    "content": f"""
What is "{text}"?

Explain clearly for a beginner.

Rules:
- No repetition
- No circular definitions
- Use simple English
- Answer in 2 sentences
"""
                }
            ],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"ERROR in process_text: {e}")
        return f"A {text} is a fundamental concept that is essential to understand for its various applications in everyday life."