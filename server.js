const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const FOLDER_PATH = path.join(__dirname, 'files');

app.use(express.json());

// Create the folder if it doesn't exist
if (!fs.existsSync(FOLDER_PATH)) {
    fs.mkdirSync(FOLDER_PATH);
}

// Endpoint to create a text file
app.post('/create-file', (req, res) => {
    const now = new Date();
    const timestamp = now.toISOString();
    const filename = `${now.toISOString().replace(/[:.]/g, '-')}.txt`; // Format the filename

    fs.writeFile(path.join(FOLDER_PATH, filename), timestamp, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Could not create file' });
        }
        res.status(201).json({ message: 'File created', filename });
    });
});

// Endpoint to retrieve all text files
app.get('/files', (req, res) => {
    fs.readdir(FOLDER_PATH, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Could not read directory' });
        }
        const textFiles = files.filter(file => file.endsWith('.txt'));
        res.status(200).json({ files: textFiles });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
