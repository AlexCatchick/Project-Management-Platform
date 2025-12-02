import mongoose, { Schema } from 'mongoose';

const SubTaskSchema = new Schema({
    taskId: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

export const SubTask = mongoose.model('SubTask', SubTaskSchema);
