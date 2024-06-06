const { setupWebSocketServer } = require('./utils/global/websocket.util');

const callAndExecuteRequireStack = (app, server) => {
  const io = setupWebSocketServer(server);

  //system imports
  const adminsUserRoutes = require('./routes/admin/admin.user.routes.js');
  const adminRoutes = require('./routes/admin/admin.routes');
  const adminFileRoutes = require('./routes/admin/admin.files.routes.js');
  const adminRenderRoutes = require('./routes/admin/admin.render.routes');
  const classRoutes = require('./routes/admin/classes.routes');
  const lecturerRenderRoutes = require('./routes/lecturer/lecturer.render.routes');
  const lecturerChaptersRoutes = require('./routes/lecturer/lecturer.chapters.routes');
  const lecturerFilesRoutes = require('./routes/lecturer/lecturer.files.routes');
  const modelUpdatesRoutes = require('./routes/admin/models.updates.routes.js');

  //system config
  app.use(adminRoutes);
  app.use(adminsUserRoutes);
  app.use(adminFileRoutes);
  app.use(adminRenderRoutes);
  app.use(classRoutes);
  app.use(lecturerFilesRoutes);
  app.use(lecturerRenderRoutes);
  app.use(lecturerChaptersRoutes);
  app.use(modelUpdatesRoutes);

  app.use((req, res) => {
    res.render('global/error', { error: "Page not found", status: 404 });
  });
}

module.exports = { callAndExecuteRequireStack };