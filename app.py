import gradio as gr
import torch
from datetime import datetime
from transformers import AutoTokenizer, AutoModelForCausalLM
import sympy

memory = {}  # simple memory store

tokenizer = AutoTokenizer.from_pretrained("gpt2")
model = AutoModelForCausalLM.from_pretrained("gpt2")
model.eval()

def chat(query, history):
    if "what day" in query.lower() or "what time" in query.lower():
        now = datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")
        response = f"Today is {now}."

    elif any(op in query for op in ["+", "-", "*", "/", "^", "sqrt"]):
        try:
            result = sympy.sympify(query).evalf()
            response = f"The answer is {result}"
        except:
            response = "Sorry, I couldn't evaluate that math expression."

    elif "my name is" in query.lower():
        name = query.split("is")[-1].strip().capitalize()
        memory["name"] = name
        response = f"Nice to meet you, {name}!"

    elif "what's my name" in query.lower():
        response = f"Your name is {memory.get('name', 'not yet stored')}."

    else:
        prompt = ""
        for user_input, ai_reply in history:
            prompt += f"User: {user_input}\nAI: {ai_reply}\n"
        prompt += f"User: {query}\nAI:"

        inputs = tokenizer(prompt, return_tensors="pt")
        with torch.no_grad():
            outputs = model.generate(
                inputs.input_ids,
                max_new_tokens=100,
                do_sample=True,
                temperature=0.7,
                pad_token_id=tokenizer.eos_token_id
            )
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.split("AI:")[-1].strip()

    history.append((query, response))
    return "", history

with gr.Blocks(css="style.css") as demo:
    gr.Markdown("<h1 style='text-align:center;'>🧠 Smart GPT-2 Assistant</h1>")
    chatbot = gr.Chatbot(height=500, full_width=True)
    msg = gr.Textbox(placeholder="Ask anything...", show_label=False, full_width=True)
    send_btn = gr.Button("Send", variant="primary")
    clear_btn = gr.Button("🧹 Clear", elem_classes="secondary")

    def disable_inputs():
        return gr.update(interactive=False), gr.update(interactive=False)

    def enable_inputs():
        return gr.update(interactive=True), gr.update(interactive=True)

    msg.submit(disable_inputs, None, [msg, send_btn], queue=False).then(
        chat, [msg, chatbot], [msg, chatbot]
    ).then(
        enable_inputs, None, [msg, send_btn], queue=False
    )

    send_btn.click(disable_inputs, None, [msg, send_btn], queue=False).then(
        chat, [msg, chatbot], [msg, chatbot]
    ).then(
        enable_inputs, None, [msg, send_btn], queue=False
    )

    clear_btn.click(lambda: ("", []), None, [msg, chatbot], queue=False)

demo.launch()