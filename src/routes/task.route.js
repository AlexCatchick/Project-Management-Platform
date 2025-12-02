import { Router } from 'express';
import {
    createTask,
    getProjectTasks,
    getTaskDetails,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
} from '../controllers/task.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyProjectAccess } from '../middlewares/rbac.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/:projectId')
    .get(verifyProjectAccess(), getProjectTasks)
    .post(verifyProjectAccess(['admin', 'project_admin']), upload.array('attachments', 5), createTask);

router.route('/:projectId/t/:taskId')
    .get(verifyProjectAccess(), getTaskDetails)
    .put(verifyProjectAccess(['admin', 'project_admin']), upload.array('attachments', 5), updateTask)
    .delete(verifyProjectAccess(['admin', 'project_admin']), deleteTask);

router.route('/:projectId/t/:taskId/subtasks')
    .post(verifyProjectAccess(['admin', 'project_admin']), createSubTask);

router.route('/:projectId/st/:subTaskId')
    .put(verifyProjectAccess(), updateSubTask)
    .delete(verifyProjectAccess(['admin', 'project_admin']), deleteSubTask);

export default router;
