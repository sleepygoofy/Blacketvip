const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

// Set up Supabase client
const supabaseUrl = 'https://wmtrobeaujrftirclypz.supabase.co'; // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdHJvYmVhdWpyZnRpcmNseXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzI3ODQsImV4cCI6MjA1ODUwODc4NH0.P78epfp01dW8HK9kHirBeeLO4y9FC3skFvprYnFZjWE'; // Replace with your actual Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);

// Serve the form page directly at root ('/')
app.get('/', (req, res) => {
  res.send(`
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suggestion Form</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            margin: 0;
          }
          form {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
          }
          input, textarea {
            width: 100%;
            padding: 10px;
            margin-bottom: 12px;
            border: 1px solid #ccc;
            border-radius: 4px;
          }
          button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px 20px;
            cursor: pointer;
            border-radius: 4px;
          }
          button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <form id="suggestion-form">
          <label for="suggestion">What should we add?</label>
          <textarea id="suggestion" name="suggestion" rows="4" required></textarea>

          <label for="changeRequest">What should we change?</label>
          <textarea id="changeRequest" name="changeRequest" rows="4" required></textarea>

          <button type="submit">Submit Suggestion</button>
        </form>
        
        <script>
          const form = document.getElementById('suggestion-form');
          form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const suggestion = document.getElementById('suggestion').value;
            const changeRequest = document.getElementById('changeRequest').value;

            const response = await fetch('/submit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ suggestion, changeRequest }),
            });

            const result = await response.json();
            alert(result.message);
          });
        </script>
      </body>
    </html>
  `);
});

// API route to handle form submission at '/submit'
app.post('/submit', async (req, res) => {
  const { suggestion, changeRequest } = req.body;

  if (!suggestion || !changeRequest) {
    return res.status(400).json({ error: 'Both fields are required.' });
  }

  const { data, error } = await supabase
    .from('suggestions')
    .insert([{ suggestion, changeRequest }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Suggestion submitted successfully', data });
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
