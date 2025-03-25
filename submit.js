const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = 'https://wmtrobeaujrftirclypz.supabase.co'; // your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtdHJvYmVhdWpyZnRpcmNseXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MzI3ODQsImV4cCI6MjA1ODUwODc4NH0.P78epfp01dW8HK9kHirBeeLO4y9FC3skFvprYnFZjWE'; // Replace this with your secret API key
const supabase = createClient(supabaseUrl, supabaseKey);

app.post('/submit', async (req, res) => {
  const { suggestion, changeRequest } = req.body;

  if (!suggestion || !changeRequest) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const { data, error } = await supabase
    .from('suggestions')
    .insert([{ suggestion, changeRequest }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Suggestion submitted successfully', data });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
