const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const reitRoutes = require('./routes/reits');
const portfolioRoutes = require('./routes/portfolio');
const communityRoutes = require('./routes/community');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'REIT Investment Platform API',
    status: 'running',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      reits: '/api/reits',
      portfolio: '/api/portfolio/:userId',
      community: '/api/community'
    },
    frontend: 'http://localhost:3000'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/reits', reitRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/community', communityRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('new_post', (data) => {
    io.emit('post_created', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

setInterval(() => {
  io.emit('price_update', { message: 'REIT prices updated' });
}, 30000);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
