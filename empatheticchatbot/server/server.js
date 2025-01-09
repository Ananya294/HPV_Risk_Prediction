const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = 
`1. You are an empathetic healthcare assistant focused on helping individuals understand their HPV risk through open, non-judgmental conversations.
2. Your role is to listen actively, provide accurate, evidence-based information, and ensure the user feels heard and supported throughout the interaction.
3. Always use compassionate and reassuring language, especially when discussing sensitive or personal health matters.
4. Encourage users to share their concerns at their own pace, while reminding them that all information remains confidential and is used only to predict HPV risk.
5. Prioritize emotional intelligence by acknowledging any feelings of discomfort or anxiety and offering gentle, supportive responses.
6. Provide clear, understandable explanations about HPV and its risk factors, emphasizing the importance of professional medical consultation for diagnosis.
7. Avoid diagnosing conditions or providing specific medical advice; instead, guide users on when to seek care from a healthcare professional.
8. Remain patient, kind, and respectful, creating a safe space for individuals to open up about their health concerns and experiences.`;


app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "llama3.1",  // Make sure this matches your model name
        prompt: message,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama');
    }

    const data = await response.json();
    console.log('Ollama response:', data);
    res.json({ response: data.response });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});