const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static('public')); // Serve static files

// JSON file paths
const contactsFile = path.join(__dirname, 'contacts.json');
const artworksFile = path.join(__dirname, 'artworks.json');

// Helper function to read JSON file
const readJSON = (file) => {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        return [];
    }
};

// Serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the contact page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// API: Get all artworks
app.get('/api/artworks', (req, res) => {
    const artworks = readJSON(artworksFile);
    res.json(artworks);
});

// API: Get all contacts
app.get('/api/contacts', (req, res) => {
    const contacts = readJSON(contactsFile);
    res.json(contacts);
});

// API: Add a new contact (Form Submission)
app.post('/api/contacts', (req, res) => {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    let contacts = readJSON(contactsFile);
    contacts.push({ name, email, phone, message });

    fs.writeFileSync(contactsFile, JSON.stringify(contacts, null, 2));
    res.status(201).json({ message: 'Contact added successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
