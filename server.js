const express = require('express');
const emailjs = require('@emailjs/nodejs');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies (from fetch)
app.use(express.urlencoded({ extended: true })); // Parse form data (optional, for HTML form)

// Initialize EmailJS
emailjs.init({
    publicKey: process.env.EMAILJS_PUBLIC_KEY,
    privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

// API endpoint to handle form submission
app.post('/send-email', async (req, res) => {
    const { name, from_email, message, time } = req.body;

    // Validate request data
    if (!name || !from_email || !message || !time) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Prepare EmailJS parameters
        const templateParams = {
            name,
            from_email,
            time,
            message,
        };

        // Send email
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams
        );

        if (response.status === 200) {
            res.status(200).json({ message: 'Email sent successfully' });
        } else {
            res.status(500).json({ message: 'Failed to send email' });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email', error: error.text || error.message });
    }
});

// Serve static files
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});