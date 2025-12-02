import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { Task } from "../models/task.model.js";
import { SubTask } from "../models/subtask.model.js";
import fs from "fs";

const createTask = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description, assignedTo, status } = req.body;

    if (!title?.trim()) {
        throw new ApiError(400, "Task title is required");
    }

    const attachments = [];
    if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
            attachments.push({
                url: `/images/${file.filename}`,
                localPath: file.path,
                mimeType: file.mimetype,
                size: file.size
            });
        });
    }

    const task = await Task.create({
        projectId,
        title,
        description: description || "",
        assignedTo: assignedTo || null,
        status: status || 'todo',
        attachments,
        createdBy: req.user._id
    });

    const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'username email fullName')
        .populate('createdBy', 'username email fullName');

    return res.status(201).json(
        new ApiResponse(201, populatedTask, "Task created successfully")
    );
});

const getProjectTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const tasks = await Task.find({ projectId })
        .populate('assignedTo', 'username email fullName')
        .populate('createdBy', 'username email fullName')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, tasks, "Tasks fetched successfully")
    );
});

const getTaskDetails = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
        .populate('assignedTo', 'username email fullName')
        .populate('createdBy', 'username email fullName');

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const subtasks = await SubTask.find({ taskId })
        .populate('createdBy', 'username email fullName')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, { task, subtasks }, "Task details fetched successfully")
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title, description, assignedTo, status } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (status) updateData.status = status;

    if (req.files && req.files.length > 0) {
        const newAttachments = [];
        req.files.forEach(file => {
            newAttachments.push({
                url: `/images/${file.filename}`,
                localPath: file.path,
                mimeType: file.mimetype,
                size: file.size
            });
        });
        updateData.$push = { attachments: { $each: newAttachments } };
    }

    const task = await Task.findByIdAndUpdate(
        taskId,
        updateData,
        { new: true }
    )
        .populate('assignedTo', 'username email fullName')
        .populate('createdBy', 'username email fullName');

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    );
});

const deleteTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (task.attachments && task.attachments.length > 0) {
        task.attachments.forEach(attachment => {
            if (fs.existsSync(attachment.localPath)) {
                fs.unlinkSync(attachment.localPath);
            }
        });
    }

    await Task.findByIdAndDelete(taskId);
    await SubTask.deleteMany({ taskId });

    return res.status(200).json(
        new ApiResponse(200, {}, "Task deleted successfully")
    );
});

const createSubTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title?.trim()) {
        throw new ApiError(400, "Subtask title is required");
    }

    const task = await Task.findById(taskId);
    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const subtask = await SubTask.create({
        taskId,
        title,
        createdBy: req.user._id
    });

    const populatedSubtask = await SubTask.findById(subtask._id)
        .populate('createdBy', 'username email fullName');

    return res.status(201).json(
        new ApiResponse(201, populatedSubtask, "Subtask created successfully")
    );
});

const updateSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;
    const { title, isCompleted } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    const subtask = await SubTask.findByIdAndUpdate(
        subTaskId,
        { $set: updateData },
        { new: true }
    ).populate('createdBy', 'username email fullName');

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    return res.status(200).json(
        new ApiResponse(200, subtask, "Subtask updated successfully")
    );
});

const deleteSubTask = asyncHandler(async (req, res) => {
    const { subTaskId } = req.params;

    const subtask = await SubTask.findByIdAndDelete(subTaskId);

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Subtask deleted successfully")
    );
});

export {
    createTask,
    getProjectTasks,
    getTaskDetails,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
};
