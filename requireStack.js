import adminsUserRoutes from './routes/admin/admin.user.routes.js';
import adminRoutes from './routes/admin/admin.routes';
import adminFileRoutes from './routes/admin/admin.files.routes.js';
import adminRenderRoutes from './routes/admin/admin.render.routes';
import classRoutes from './routes/admin/classes.routes';
import lecturerRenderRoutes from './routes/lecturer/lecturer.render.routes';
import lecturerChaptersRoutes from './routes/lecturer/lecturer.chapters.routes';
import lecturerFilesRoutes from './routes/lecturer/lecturer.files.routes';
import modelUpdatesRoutes from './routes/admin/models.updates.routes.js';
import studentRenderRoutes from './routes/student/student.render.routes.js';

import { setupWebSocketServer } from './utils/global/websocket.util';

const callAndExecuteRequireStack = (app, server) => {
  const io = setupWebSocketServer(server);

  app.use(adminRoutes);
  app.use(adminsUserRoutes);
  app.use(adminFileRoutes);
  app.use(adminRenderRoutes);
  app.use(classRoutes);
  app.use(lecturerFilesRoutes);
  app.use(lecturerRenderRoutes);
  app.use(lecturerChaptersRoutes);
  app.use(modelUpdatesRoutes);
  app.use(studentRenderRoutes);

  app.use((req, res) => {
    res.render('global/error', { error: "Page not found", status: 404 });
  });
}

export default callAndExecuteRequireStack;