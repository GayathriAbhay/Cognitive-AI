def personalize(user, steps):
    user_type = user.get("type", "default")

    if user_type == "ADHD":
        return ["* Quick Steps *"] + steps[:3]

    elif user_type == "ASD":
        return ["- Structured Steps -"] + [f"{i+1}. {step}" for i, step in enumerate(steps)]

    elif user_type == "Dyslexia":
        return ["( Easy Read )"] + [step.lower() for step in steps]

    return steps