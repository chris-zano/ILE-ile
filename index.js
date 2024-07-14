//node.js imports
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import callAndExecuteRequireStack, { callSetupWebSocket } from './requireStack.js';

import { createServer } from 'http'; // creating http server
import { ExpressPeerServer } from 'peer'; // WebRTC API for real-time media communication

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app); // creating http server

const peerServer = ExpressPeerServer(server, {
  debug: true
});

const STATIC_FILES_PATH = path.join(__dirname, 'public');
const VIEW_ENGINE_PATH = path.join(__dirname, 'views');

//express.js config
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
    await mongoose.connect("mongodb://localhost:27017/ileSchool")
    console.log("Connected to local");

    callAndExecuteRequireStack(app);
    callSetupWebSocket(server);

    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`App is live at http://localhost:${PORT}`);
    });

  } catch (error) {
    
    console.error('Error connecting to Database: ', error);
  }
})();