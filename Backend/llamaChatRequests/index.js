import LlamaAI from 'llamaai';
import express from 'express';
import cors from 'cors';

const apiToken = 'LLAMA_API_TOKEN';
const llamaAPI = new LlamaAI(apiToken);

const app = express();
app.use(cors({
    origin: '*',
}));

app.get('/ask-ai', async (req, res) => {
    const prompt = req.query.prompt;
    try {
        const apiRequestJson = {
            "messages": [{
                "role": "assistant",
                "content": prompt,
            }],
            "functions": [],
            "stream": false,
        };

        llamaAPI.run(apiRequestJson)
            .then(response => {
                // console.log("Response:", response.choices);
                res.json(response.choices);
            })
            .catch(error => {
                console.error("Error getting AI response", error);
                res.status(500).json({
                    error: 'Internal server error'
                });
            });
    } catch (error) {
        console.error("Error fetching response from AI", error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});
