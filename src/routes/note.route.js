import { Router } from 'express';
import {
    createNote,
    getProjectNotes,
    getNoteDetails,
    updateNote,
    deleteNote
} from '../controllers/note.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { verifyProjectAccess } from '../middlewares/rbac.middleware.js';

const router = Router();

router.use(verifyJWT);

router.route('/:projectId')
    .get(verifyProjectAccess(), getProjectNotes)
    .post(verifyProjectAccess(['admin']), createNote);

router.route('/:projectId/n/:noteId')
    .get(verifyProjectAccess(), getNoteDetails)
    .put(verifyProjectAccess(['admin']), updateNote)
    .delete(verifyProjectAccess(['admin']), deleteNote);

export default router;
