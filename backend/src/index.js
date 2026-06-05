// ============================================
// Tes Kognitif IWARE — Backend Entry Point
// ============================================

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const participantsRouter = require('./routes/participants');
const answersRouter = require('./routes/answers');
const sessionsRouter = require('./routes/sessions');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0';

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    // and any origin for development flexibility
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/participants', participantsRouter);
app.use('/api/answers', answersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tes Kognitif IWARE API is running' });
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`✅ Backend server running on http://${HOST}:${PORT}`);
});
