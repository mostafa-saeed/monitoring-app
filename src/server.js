import express from 'express';
import checksRouter from './checks/checks.router.js';

const server = express();
server.use(express.json());

server.get('/check', (req, res) => res.json({ success: true }));

server.use('/api/checks', checksRouter);

export default server;
