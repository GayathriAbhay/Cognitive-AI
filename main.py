from ai.pipeline import ai_pipeline

if __name__ == "__main__":
    input_text = "Explain how binary search works"
    
    user_profile = {
        "type": "ADHD"
    }

    result = ai_pipeline(input_text, user_profile)

    print("\n--- AI OUTPUT ---")
    print(result)