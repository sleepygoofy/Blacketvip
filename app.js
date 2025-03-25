const express = require('express');
const path = require('path');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up Supabase client
const supabaseUrl = 'https://wmtrobeaujrftirclypz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdHJvYmVhdWpyZnRpcmNseXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzI3ODQsImV4cCI6MjA1ODUwODc4NH0.P78epfp01dW8HK9kHirBeeLO4y9FC3skFvprYnFZjWE';
const supabase = createClient(supabaseUrl, supabaseKey);

// Serve form.html at /forms.html
app.get('/forms.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'forms.html'));
});

// API route to handle form submission
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
