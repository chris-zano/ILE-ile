//node.js imports
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
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
const adminRenderRoutes = require('./routes/admin/render.routes');

// const forgeRoutes = require('./routes/admin/forge/forge.routes');

//system config
app.use(adminRoutes);
app.use(adminsRoutes);
app.use(adminFileRoutes);
app.use(adminRenderRoutes);
// app.use(forgeRoutes);

mongoose.connect('mongodb://localhost:27017/ileSchool');

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
});