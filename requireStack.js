import adminsUserRoutes from './routes/admin/admin.user.routes.js';
import adminRoutes from './routes/admin/admin.routes.js';
import adminFileRoutes from './routes/admin/admin.files.routes.js';
import adminRenderRoutes from './routes/admin/admin.render.routes.js';
import classRoutes from './routes/admin/classes.routes.js';
import lecturerRenderRoutes from './routes/lecturer/lecturer.render.routes.js';
import lecturerChaptersRoutes from './routes/lecturer/lecturer.chapters.routes.js';
import lecturerFilesRoutes from './routes/lecturer/lecturer.files.routes.js';
import modelUpdatesRoutes from './routes/admin/models.updates.routes.js';
import studentRenderRoutes from './routes/student/student.render.routes.js';
import studentCoursesRoutes from './routes/student/student.courses.routes.js';
import setupWebSocketServer from './utils/global/websocket.util.js';
import masterRtcRoutes from './routes/rtc/master.rtc.routes.js';
import initialiseFirebaseAndExport from './firebase.config.js';
import lecturerRtcRoutes from './routes/lecturer/lecturer.rtc.routes.js';
import StudentRtcRoutes from './routes/student/student.rtc.routes.js';

export const callInitFirebase = () => initialiseFirebaseAndExport();

export const callSetupWebSocket = (server) => setupWebSocketServer(server);

  const callAndExecuteRequireStack = (app) => {

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
    app.use(studentCoursesRoutes);
    app.use(masterRtcRoutes);
    app.use(lecturerRtcRoutes);
    app.use(StudentRtcRoutes);

    app.use((req, res) => {
      res.render('global/error', { error: "Page not found", status: 404 });
    });
  }

  export default callAndExecuteRequireStack;