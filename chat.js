const { pipeline } = window.transformers;

async function initializeModel() {
    const chatPipeline = await pipeline('text-generation', 'onnx-community/Llama-3.2-1B-Instruct-q4f16', {
        quantized: true,
        device: 'webgpu'
    });
    return chatPipeline;
}

document.getElementById('send-button').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Display user message
    displayMessage('user', userInput);

    // Generate and display model response
    const response = await generateResponse(userInput);
    displayMessage('bot', response);

    // Clear input field
    document.getElementById('user-input').value = '';
});

async function generateResponse(input) {
    const chatPipeline = await initializeModel();
    const output = await chatPipeline(input, { max_new_tokens: 50 });
    return output[0].generated_text;
}

function displayMessage(sender, message) {
    const chatWindow = document.getElementById('chat-window');
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}
