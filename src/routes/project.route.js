import { Router } from 'express';
import {
    createProject,
    getUserProjects,
    getProjectDetails,
    updateProject,
    deleteProject,
    getProjectMembers,
    addProjectMember,
    updateMemberRole,
    removeMember
} from '../controllers/project.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyProjectAccess } from '../middlewares/rbac.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/').get(getUserProjects).post(createProject);
router.route('/:projectId')
    .get(verifyProjectAccess(), getProjectDetails)
    .put(verifyProjectAccess(['admin']), updateProject)
    .delete(verifyProjectAccess(['admin']), deleteProject);

router.route('/:projectId/members')
    .get(verifyProjectAccess(), getProjectMembers)
    .post(verifyProjectAccess(['admin']), addProjectMember);

router.route('/:projectId/members/:userId')
    .put(verifyProjectAccess(['admin']), updateMemberRole)
    .delete(verifyProjectAccess(['admin']), removeMember);

export default router;
