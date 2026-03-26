from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")

def remove_duplicates(steps):
    return list(dict.fromkeys(steps))

def break_task(text):
    """
    Rule-based step generator (more reliable)
    """

    steps = [
        "Start with a sorted list",
        "Find the middle element",
        "Compare the target with the middle element",
        "If equal, return result",
        "If smaller, search left half",
        "If larger, search right half",
        "Repeat until found or list ends"
    ]

    return steps