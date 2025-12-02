import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ProjectMember } from "../models/projectMember.model.js";

export const verifyProjectAccess = (allowedRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        const projectId = req.params.projectId;
        const userId = req.user._id;

        const member = await ProjectMember.findOne({ projectId, userId });

        if (!member) {
            throw new ApiError(403, "You don't have access to this project");
        }

        if (allowedRoles.length > 0 && !allowedRoles.includes(member.role)) {
            throw new ApiError(403, "You don't have permission to perform this action");
        }

        req.userRole = member.role;
        req.projectMember = member;
        next();
    });
};
