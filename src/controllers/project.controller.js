import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/project.model.js";
import { ProjectMember } from "../models/projectMember.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Project name is required");
    }

    const project = await Project.create({
        name,
        description: description || "",
        owner: req.user._id
    });

    await ProjectMember.create({
        projectId: project._id,
        userId: req.user._id,
        role: 'admin'
    });

    return res.status(201).json(
        new ApiResponse(201, project, "Project created successfully")
    );
});

const getUserProjects = asyncHandler(async (req, res) => {
    const userProjects = await ProjectMember.aggregate([
        {
            $match: {
                userId: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: 'projects',
                localField: 'projectId',
                foreignField: '_id',
                as: 'project'
            }
        },
        {
            $unwind: '$project'
        },
        {
            $lookup: {
                from: 'projectmembers',
                localField: 'projectId',
                foreignField: 'projectId',
                as: 'members'
            }
        },
        {
            $project: {
                _id: '$project._id',
                name: '$project.name',
                description: '$project.description',
                owner: '$project.owner',
                role: '$role',
                memberCount: { $size: '$members' },
                createdAt: '$project.createdAt',
                updatedAt: '$project.updatedAt'
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, userProjects, "Projects fetched successfully")
    );
});

const getProjectDetails = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate('owner', 'username email fullName');

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(200, project, "Project details fetched successfully")
    );
});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            $set: {
                name,
                description
            }
        },
        { new: true }
    );

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res.status(200).json(
        new ApiResponse(200, project, "Project updated successfully")
    );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    await ProjectMember.deleteMany({ projectId });

    return res.status(200).json(
        new ApiResponse(200, {}, "Project deleted successfully")
    );
});

const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const members = await ProjectMember.find({ projectId })
        .populate('userId', 'username email fullName avatar');

    return res.status(200).json(
        new ApiResponse(200, members, "Project members fetched successfully")
    );
});

const addProjectMember = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { email, role } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        throw new ApiError(404, "User not found with this email");
    }

    const existingMember = await ProjectMember.findOne({
        projectId,
        userId: user._id
    });

    if (existingMember) {
        throw new ApiError(409, "User is already a member of this project");
    }

    const member = await ProjectMember.create({
        projectId,
        userId: user._id,
        role: role || 'member'
    });

    const populatedMember = await ProjectMember.findById(member._id)
        .populate('userId', 'username email fullName avatar');

    return res.status(201).json(
        new ApiResponse(201, populatedMember, "Member added successfully")
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;
    const { role } = req.body;

    const member = await ProjectMember.findOneAndUpdate(
        { projectId, userId },
        { $set: { role } },
        { new: true }
    ).populate('userId', 'username email fullName avatar');

    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    return res.status(200).json(
        new ApiResponse(200, member, "Member role updated successfully")
    );
});

const removeMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params;

    const member = await ProjectMember.findOneAndDelete({ projectId, userId });

    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Member removed successfully")
    );
});

export {
    createProject,
    getUserProjects,
    getProjectDetails,
    updateProject,
    deleteProject,
    getProjectMembers,
    addProjectMember,
    updateMemberRole,
    removeMember
};
