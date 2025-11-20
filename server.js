const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 5000;

const API_KEY = process.env.GOOGLE_AI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

app.use(express.json());
app.use(express.static(__dirname));

async function pollOperation(operationName, maxAttempts = 60, delayMs = 10000) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await axios.get(`${BASE_URL}/${operationName}`, {
                headers: {
                    'x-goog-api-key': API_KEY
                }
            });

            const operation = response.data;

            if (operation.done) {
                if (operation.error) {
                    throw new Error(`Operation failed: ${JSON.stringify(operation.error)}`);
                }
                return operation.response;
            }

            await new Promise(resolve => setTimeout(resolve, delayMs));
        } catch (error) {
            if (error.response) {
                throw new Error(`Poll error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }

    throw new Error('Operation timed out');
}

app.post('/api/generate-video', async (req, res) => {
    const { prompt, duration, aspectRatio, resolution } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required!' });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured!' });
    }

    try {
        console.log('Starting video generation with prompt:', prompt);

        const requestBody = {
            instances: [{
                prompt: prompt
            }],
            parameters: {
                aspectRatio: aspectRatio || '16:9',
                personGeneration: 'allow_adult'
            }
        };

        const response = await axios.post(
            `${BASE_URL}/models/veo-2.0-generate-001:predictLongRunning`,
            requestBody,
            {
                headers: {
                    'x-goog-api-key': API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        const operationName = response.data.name;
        console.log('Operation started:', operationName);

        res.json({
            message: 'Video generation started. This will take a few minutes...',
            operationName: operationName
        });

        (async () => {
            try {
                const result = await pollOperation(operationName);
                console.log('Video generation completed:', result);
            } catch (error) {
                console.error('Background polling error:', error.message);
            }
        })();

    } catch (error) {
        console.error('Error generating video:', error);

        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;

            if (status === 401 || status === 403) {
                return res.status(401).json({
                    error: 'Invalid or expired API key. Please check your Google AI API key.',
                    details: errorData
                });
            }

            if (status === 429) {
                return res.status(429).json({
                    error: 'API rate limit exceeded. Please try again later.',
                    details: errorData
                });
            }

            return res.status(status).json({
                error: `API error: ${status}`,
                details: errorData
            });
        }

        res.status(500).json({
            error: 'Failed to generate video',
            message: error.message
        });
    }
});

app.get('/api/check-operation/:operationId', async (req, res) => {
    const operationId = req.params.operationId;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured!' });
    }

    try {
        const response = await axios.get(`${BASE_URL}/operations/${operationId}`, {
            headers: {
                'x-goog-api-key': API_KEY
            }
        });

        const operation = response.data;

        if (operation.done) {
            if (operation.error) {
                return res.status(500).json({
                    done: true,
                    error: operation.error
                });
            }

            const videoUri = operation.response?.generatedSamples?.[0]?.video?.uri;

            return res.json({
                done: true,
                videoUrl: videoUri,
                response: operation.response
            });
        }

        res.json({
            done: false,
            metadata: operation.metadata
        });
    } catch (error) {
        console.error('Error checking operation:', error);

        if (error.response) {
            return res.status(error.response.status).json({
                error: `API error: ${error.response.status}`,
                details: error.response.data
            });
        }

        res.status(500).json({
            error: 'Failed to check operation status',
            message: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Video Generator server running on port ${PORT}`);
    console.log(`Using Google Veo 2.0 model`);
    console.log(`API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
});
