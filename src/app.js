import Mongoose from 'mongoose';
import { log, error } from 'console';
import server from './server.js';
import start from './scheduler/index.js';

const { connect } = Mongoose;
const { PORT, DB_CONNECTION_STRING } = process.env;

(async () => {
  try {
    await connect(DB_CONNECTION_STRING);
    start();
    server.listen(PORT, () => log(`SERVER STARTED ON PORT ${PORT}`));
  } catch (err) {
    error(err);
  }
})();
