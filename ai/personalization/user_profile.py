def personalize(user, steps):
    """
    Personalizes output based on user type
    """
    user_type = user.get("type", "default")

    if user_type == "ADHD":
        return steps[:3]  # shorter list

    elif user_type == "ASD":
        return [f"{i+1}. {step}" for i, step in enumerate(steps)]

    elif user_type == "Dyslexia":
        return [step.upper() for step in steps]

    return steps