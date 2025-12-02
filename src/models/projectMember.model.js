import mongoose, { Schema } from 'mongoose';

const ProjectMemberSchema = new Schema({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'project_admin', 'member'],
        default: 'member'
    }
}, {
    timestamps: true
});

ProjectMemberSchema.index({ projectId: 1, userId: 1 }, { unique: true });

export const ProjectMember = mongoose.model('ProjectMember', ProjectMemberSchema);
