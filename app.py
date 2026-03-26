import streamlit as st
from ai.pipeline import ai_pipeline

# Page config
st.set_page_config(
    page_title="Cognitive AI Assistant",
    page_icon="🧠",
    layout="centered"
)

# Title
st.title("🧠 Cognitive AI Assistant")
st.markdown("### 🎯 Personalized Learning for Neurodivergent Students")

# Input box
text = st.text_area(
    "📥 Enter your question:",
    placeholder="e.g., Explain binary search"
)

# User type selection
user_type = st.selectbox(
    "🧑 Select User Type:",
    ["ADHD", "ASD", "Dyslexia"]
)

# Button
if st.button("🚀 Process"):

    if text.strip() == "":
        st.warning("⚠️ Please enter a question")
    else:
        # Call AI pipeline
        result = ai_pipeline(text, {"type": user_type})

        # Output sections
        st.subheader("📘 Simplified Explanation")
        st.write(result["simplified"])

        st.subheader("🪜 Step-by-Step Solution")
        for step in result["personalized"]:
            st.write(f"• {step}")