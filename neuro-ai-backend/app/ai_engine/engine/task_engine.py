import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def break_task(text):
    print("USING OPENAI FOR TASK BREAKDOWN")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": f"""
Break this concept into 3-5 simple learning steps:

{text}

Rules:
- Keep steps short
- No repetition
- Numbered format (1. 2. 3.)
"""
                }
            ],
            temperature=0.3
        )

        result = response.choices[0].message.content.strip()

        # Convert to list
        steps = [s.strip() for s in result.split("\n") if s.strip()]

        return steps
    except Exception as e:
        print(f"ERROR in break_task: {e}")
        return [f"Understand the basics of {text}.", "Practice with examples.", "Review and apply knowledge."]