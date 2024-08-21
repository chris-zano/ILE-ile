//node.js imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import callAndExecuteRequireStack, { callSetupWebSocket } from './requireStack.js';

import { createServer } from 'http';
import { ExpressPeerServer } from 'peer';

import cluster from 'cluster';
import os from 'os';

const cpuCount = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`The primary process of pid ${process.pid} ha started.`);
  console.log(`The total amount of cpus is ${cpuCount}`);

  for (let i = 0; i < 1/*cpuCount*/; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with a code of ${code} and signal of ${signal}`);
    console.log('starting a new worker...');
    cluster.fork();
  });
}
else {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const app = express();
  const server = createServer(app);

  const peerServer = ExpressPeerServer(server, {
    debug: true
  });

  const STATIC_FILES_PATH = path.join(__dirname, 'public');
  const VIEW_ENGINE_PATH = path.join(__dirname, 'views');

  dotenv.config();

  app.use(bodyParser.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/public', express.static(STATIC_FILES_PATH));
  app.set('views', VIEW_ENGINE_PATH);
  app.set('view engine', 'ejs');

  const username = encodeURIComponent(process.env.MONGO_DB_USERNAME);
  const password = encodeURIComponent(process.env.MONGO_DB_PASSWORD);
  const clusterName = encodeURIComponent(process.env.CLUSTER_NAME);
  const appName = encodeURIComponent(process.env.APP_NAME);
  const databasename = encodeURIComponent(process.env.DATABASE_NAME); 

  const uri = `mongodb+srv://${username}:${password}@${clusterName}.jwscxvu.mongodb.net/${databasename}?retryWrites=true&w=majority&appName=${appName}`;

  //Connect to Database and start server
  (async () => {
    try {
      // await mongoose.connect("mongodb://localhost:27017/ileSchool")
      await mongoose.connect(uri);
      console.log("Connected to local");

      callAndExecuteRequireStack(app);
      callSetupWebSocket(server);

      const PORT = process.env.PORT || 8080;
      server.listen(PORT, () => {
        console.log(`App is live at http://localhost:${PORT}`);
      });

      process.on('SIGTERM', () => {
        server.close(() => {
          console.log(`Process terminated`);
          mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
          });
        });
      });

      //rate limit
      const limiter = rateLimit({
        windowMs:15 * 60 * 1000, // 15 minutes
        max: 120, //maximum 120 requests in the 15 minute window
        keyGenerator: (req) => {
          // Custom key generator for identifying users, e.g., using user ID
          return req.params.id ? req.params.id : req.ip;
        },
        message: 'Too many requests, please try again later',
        handler: (req, res, next, options) => {
          // Custom handler function for rate limit exceeded
          res.status(options.statusCode).json({
            message: options.message,
            retryAfter: options.retryAfter
          });
        }
      });

      app.use(limiter)

    } catch (error) {

      console.error('Error connecting to Database: ', error);
    }
  })();
}