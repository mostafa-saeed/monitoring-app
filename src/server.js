import express from 'express';
import checksRouter from './checks/checks.router.js';
import usersRouter from './users/users.router.js';

const server = express();
server.use(express.json());

let status = true;

server.get('/check', (req, res) => {
  status = !status;
  return status ? res.json({ success: true }) : res.status(404).send();
});

server.post('/webhook', (req, res) => {
  console.log('WEBHOOK_REQUEST', req.body);

  return res.json({ success: true });
});

server.use('/api/checks', checksRouter);
server.use('/api/users', usersRouter);

server.use((err, req, res, next) => {
  console.log(err);
  if (err.error?.isJoi) {
    return res.status(400).json({
      type: err.type,
      message: err.error.toString(),
    });
  }

  if (err.name === 'UnauthorizedError') {
    return next(
      res.status(401).json({ reason: 'INVALID_TOKEN' }),
    );
  }
  return next(
    res.status(err.output.statusCode).json(err.output.payload),
  );
});

export default server;
