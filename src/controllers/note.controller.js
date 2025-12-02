import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { Note } from "../models/note.model.js";

const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, content } = req.body;

    if (!title?.trim()) {
        throw new ApiError(400, "Note title is required");
    }

    const note = await Note.create({
        projectId,
        title,
        content: content || "",
        createdBy: req.user._id
    });

    const populatedNote = await Note.findById(note._id)
        .populate('createdBy', 'username email fullName');

    return res.status(201).json(
        new ApiResponse(201, populatedNote, "Note created successfully")
    );
});

const getProjectNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    const notes = await Note.find({ projectId })
        .populate('createdBy', 'username email fullName')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, notes, "Notes fetched successfully")
    );
});

const getNoteDetails = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findById(noteId)
        .populate('createdBy', 'username email fullName');

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(200, note, "Note details fetched successfully")
    );
});

const updateNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { title, content } = req.body;

    const note = await Note.findByIdAndUpdate(
        noteId,
        {
            $set: {
                title,
                content
            }
        },
        { new: true }
    ).populate('createdBy', 'username email fullName');

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(200, note, "Note updated successfully")
    );
});

const deleteNote = asyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Note deleted successfully")
    );
});

export {
    createNote,
    getProjectNotes,
    getNoteDetails,
    updateNote,
    deleteNote
};
