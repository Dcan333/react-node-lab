import express from 'express';
import Task from './taskModel';
import asyncHandler from 'express-async-handler';
import authenticate from '../../authenticate/index.js';

const router = express.Router(); // eslint-disable-line

// Get all tasks
router.get('/', authenticate, async (req, res) => {
    const tasks = await Task.find({ userId: req.user._id }).populate('userId', 'username');
    res.status(200).json(tasks);
});

// Get a user's tasks
router.get('/user/:uid', authenticate, async (req, res) => {
    const tasks = await Task.find({ userId: `${req.params.uid}`});
    res.status(200).json(tasks);
});

// create a task
router.post('/', authenticate, asyncHandler(async (req, res) => {
    // Add userId from authenticated user
    const taskData = {
        ...req.body,
        userId: req.user._id,
        created_at: new Date(),
        updated_at: new Date(),
        done: false
    };
    
    // Capitalize priority to match schema enum
    if (taskData.priority) {
        taskData.priority = taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1).toLowerCase();
    }
    
    console.log('Creating task with data:', taskData); // Debug log
    
    const task = await Task(taskData).save();
    res.status(201).json(task);
}));

// Update Task
router.put('/:id', authenticate, async (req, res) => {
    if (req.body._id) delete req.body._id;
    
    // Update the updated_at timestamp
    req.body.updated_at = new Date();
    
    // Capitalize priority if it exists
    if (req.body.priority) {
        req.body.priority = req.body.priority.charAt(0).toUpperCase() + req.body.priority.slice(1).toLowerCase();
    }
    
    const result = await Task.updateOne({
        _id: req.params.id,
        userId: req.user._id // Only allow users to update their own tasks
    }, req.body);
    
    if (result.matchedCount) {
        res.status(200).json({ code:200, msg: 'Task Updated Successfully' });
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find Task' });
    }
});

// delete Task
router.delete('/:id', authenticate, async (req, res) => {
    const result = await Task.deleteOne({
        _id: req.params.id,
        userId: req.user._id // Only allow users to delete their own tasks
    });
    
    if (result.deletedCount) {
        res.status(204).json();
    } else {
        res.status(404).json({ code: 404, msg: 'Unable to find Task' });
    }
});

export default router;