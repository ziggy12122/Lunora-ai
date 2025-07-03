import gradio as gr
from llama_cpp import Llama
from gradio.themes.base import Base

# Load GPT4ALL model
llm = Llama(model_path="./ggjt-model.bin", n_ctx=512)

# Custom theme (fixed)
class SeafoamCustom(Base):
    def __init__(self):
        super().set(
            primary_hue="teal",
            neutral_hue="gray"
        )

# Response function
def respond(message, history):
    prompt = f"User: {message}\nAI:"
    output = llm(prompt, max_tokens=100, stop=["User:", "AI:"])
    return output["choices"][0]["text"].strip()

# Gradio UI
with gr.Blocks(theme=SeafoamCustom()) as demo:
    gr.Markdown("## 🌙 Lumora – Your Cosmic Companion")

    with gr.Row():
        chatbot = gr.Chatbot(height=500)

    with gr.Row():
        msg = gr.Textbox(placeholder="Ask Lumora anything...", label="Your Message")
        send_btn = gr.Button("Send")

    history = gr.State([])

    def handle_input(user_input, chat_history):
        reply = respond(user_input, chat_history)
        chat_history.append((user_input, reply))
        return chat_history, chat_history

    send_btn.click(handle_input, inputs=[msg, history], outputs=[chatbot, history])

demo.launch()