const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const WebSocket = require('ws');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/tasks', taskRoutes);

mongoose.connect('mongodb://localhost:27017/projectdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const server = app.listen(PORT, () => console.log(Server running on port ${PORT}));

// WebSocket setup
const wss = new WebSocket.Server({ server });
wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('message', msg => console.log(Received: ${msg}));
});
