from .engine.llm_handler import process_text
from .engine.task_engine import break_task
from .personalization.user_profile import personalize

def ai_pipeline(input_text, user_profile):
    """
    Main AI processing pipeline
    """

    # Step 1: Simplify text
    simplified = process_text(input_text)

    # Step 2: Break into steps
    steps = break_task(simplified)

    # Step 3: Personalize output
    final_output = personalize(user_profile, steps)

    return {
        "input": input_text,
        "simplified": simplified,
        "steps": steps,
        "personalized": final_output
    }