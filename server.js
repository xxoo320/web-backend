const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = 5000;

// Connect to Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Middleware
app.use(express.json());

// POST API to store messages
app.post('/api/messages', async (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ message: 'User ID and message are required' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ user_id: userId, message: message }]);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Message stored successfully', data });
  } catch (error) {
    res.status(500).json({ message: 'Error storing message', error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
