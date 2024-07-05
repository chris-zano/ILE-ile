//node.js imports
import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import callAndExecuteRequireStack from './requireStack.js';


const app = express();
const server = http.createServer(app);

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
    //   await mongoose.connect(uri);
    //   console.log('Connected to MongoDB Atlas');

    //   // Call and execute require stack
    //   callAndExecuteRequireStack(app, server);  

    //   const PORT = process.env.PORT || 8080;
    //   server.listen(PORT, () => {
    //       console.log(`App is live at http://localhost:${PORT}`);
    //   });
    mongoose.connect("mongodb://localhost:27017/ileSchool").then(() => {
      console.log("Connected to local");

      callAndExecuteRequireStack(app, server);

      const PORT = process.env.PORT || 8080;
      server.listen(PORT, () => {
        console.log(`App is live at http://localhost:${PORT}`);
      });
    }).catch(console.error);

  } catch (error) {
    console.error('Error connecting to Database: ');
  }
})();