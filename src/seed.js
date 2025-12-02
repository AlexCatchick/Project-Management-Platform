import mongoose from 'mongoose';
import { User } from './models/user.model.js';
import { Project } from './models/project.model.js';
import { ProjectMember } from './models/projectMember.model.js';
import { Task } from './models/task.model.js';
import { SubTask } from './models/subTask.model.js';
import { Note } from './models/note.model.js';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        await User.deleteMany({});
        await Project.deleteMany({});
        await ProjectMember.deleteMany({});
        await Task.deleteMany({});
        await SubTask.deleteMany({});
        await Note.deleteMany({});
        console.log('Cleared existing data');

        const adminUser = await User.create({
            username: 'admin',
            email: 'admin@projectcamp.com',
            password: 'Admin@123',
            fullName: 'Admin User',
            isEmailVerified: true
        });

        const projectAdminUser = await User.create({
            username: 'projectadmin',
            email: 'projectadmin@projectcamp.com',
            password: 'Admin@123',
            fullName: 'Project Admin User',
            isEmailVerified: true
        });

        const memberUser = await User.create({
            username: 'member',
            email: 'member@projectcamp.com',
            password: 'Member@123',
            fullName: 'Member User',
            isEmailVerified: true
        });

        console.log('Created users:');
        console.log('1. Admin - admin@projectcamp.com / Admin@123');
        console.log('2. Project Admin - projectadmin@projectcamp.com / Admin@123');
        console.log('3. Member - member@projectcamp.com / Member@123');

        const project1 = await Project.create({
            name: 'E-Commerce Platform',
            description: 'Building a modern e-commerce platform with React and Node.js',
            owner: adminUser._id
        });

        const project2 = await Project.create({
            name: 'Mobile App Development',
            description: 'Native mobile application for iOS and Android',
            owner: adminUser._id
        });

        await ProjectMember.create({
            projectId: project1._id,
            userId: adminUser._id,
            role: 'admin'
        });

        await ProjectMember.create({
            projectId: project1._id,
            userId: projectAdminUser._id,
            role: 'project_admin'
        });

        await ProjectMember.create({
            projectId: project1._id,
            userId: memberUser._id,
            role: 'member'
        });

        await ProjectMember.create({
            projectId: project2._id,
            userId: adminUser._id,
            role: 'admin'
        });

        console.log('Created projects with members');

        const task1 = await Task.create({
            projectId: project1._id,
            title: 'Setup Development Environment',
            description: 'Install Node.js, MongoDB, and configure development tools',
            status: 'done',
            createdBy: adminUser._id,
            assignedTo: projectAdminUser._id
        });

        const task2 = await Task.create({
            projectId: project1._id,
            title: 'Design Database Schema',
            description: 'Create ERD and define all collections and relationships',
            status: 'in_progress',
            createdBy: adminUser._id,
            assignedTo: projectAdminUser._id
        });

        const task3 = await Task.create({
            projectId: project1._id,
            title: 'Implement Authentication',
            description: 'Build JWT-based authentication system with refresh tokens',
            status: 'todo',
            createdBy: projectAdminUser._id,
            assignedTo: memberUser._id
        });

        console.log('Created tasks');

        await SubTask.create({
            taskId: task1._id,
            title: 'Install Node.js v18+',
            isCompleted: true,
            createdBy: adminUser._id
        });

        await SubTask.create({
            taskId: task1._id,
            title: 'Install MongoDB',
            isCompleted: true,
            createdBy: adminUser._id
        });

        await SubTask.create({
            taskId: task2._id,
            title: 'Design User Schema',
            isCompleted: true,
            createdBy: projectAdminUser._id
        });

        await SubTask.create({
            taskId: task2._id,
            title: 'Design Project Schema',
            isCompleted: false,
            createdBy: projectAdminUser._id
        });

        await SubTask.create({
            taskId: task3._id,
            title: 'Create JWT middleware',
            isCompleted: false,
            createdBy: memberUser._id
        });

        console.log('Created subtasks');

        await Note.create({
            projectId: project1._id,
            title: 'Project Kickoff Meeting',
            content: 'Discussed project timeline, tech stack decisions, and team responsibilities. Next meeting scheduled for Monday.',
            createdBy: adminUser._id
        });

        await Note.create({
            projectId: project1._id,
            title: 'Technical Stack',
            content: 'Frontend: React 18, TailwindCSS\nBackend: Node.js, Express, MongoDB\nDeployment: Render, MongoDB Atlas',
            createdBy: adminUser._id
        });

        await Note.create({
            projectId: project2._id,
            title: 'Design Guidelines',
            content: 'Follow Material Design principles for Android and Human Interface Guidelines for iOS',
            createdBy: adminUser._id
        });

        console.log('Created notes');

        console.log('\n✅ Database seeded successfully!');
        console.log('\nTest Accounts:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Role: ADMIN (Project Owner)');
        console.log('Email: admin@projectcamp.com');
        console.log('Password: Admin@123');
        console.log('Access: Full control over projects\n');
        console.log('Role: PROJECT ADMIN');
        console.log('Email: projectadmin@projectcamp.com');
        console.log('Password: Admin@123');
        console.log('Access: Can manage tasks, subtasks\n');
        console.log('Role: MEMBER');
        console.log('Email: member@projectcamp.com');
        console.log('Password: Member@123');
        console.log('Access: Can view and update subtask status\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedDatabase();
