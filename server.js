
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use(express.static(__dirname));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Gracefully handle server errors
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`STARCOPE REAL NEWS running on port ${PORT}`);
    console.log(`Access the website at http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use, trying ${PORT + 1}`);
        server.listen(PORT + 1, '0.0.0.0');
    }
});
