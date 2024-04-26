//node.js imports
const express = require('express');
const http = require('http');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const setupWebSocketServer = require('./utils/global/websocket.util');

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

//system imports
const adminsRoutes = require('./routes/admin/admins.routes');
const adminRoutes = require('./routes/admin/admin.routes');
const adminFileRoutes = require('./routes/admin/admin.files');
const adminRenderRoutes = require('./routes/admin/admin.render.routes');
const lecturerRenderRoutes = require('./routes/lecturer/lecturer.render.routes');

// const forgeRoutes = require('./routes/admin/forge/forge.routes');

//system config
app.use(adminRoutes);
app.use(adminsRoutes);
app.use(adminFileRoutes);
app.use(adminRenderRoutes);
app.use(lecturerRenderRoutes);
// app.use(forgeRoutes);

mongoose.connect(process.env.DATABASE_URL);

const io = setupWebSocketServer(server);
const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log('Listening on port:', PORT);
});