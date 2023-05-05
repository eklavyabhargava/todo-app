const express = require('express');
const mongoose = require('mongoose');
const authUser = require('../Middleware/authUser');

const router = express.Router();
const Task = mongoose.model('Task');
const TodoList = mongoose.model('TodoList');

// POST /createTask
// Create a new task and add it to the user's to-do list
router.post('/createTask', authUser, async (req, res) => {
    const { title, description, state } = req.body;

    if (!title || !description) {
        return res.status(400).json("All fields are mandatory!");
    }

    try {
        // Get the user ID from the request
        const userId = req.user._id;

        // Create a new task object from the request body
        const task = new Task({
            title: title,
            description: description,
            state: state || 'Active',
        });

        // Find the user's to-do list
        let todoList = await TodoList.findOne({ user: userId });

        // If the user doesn't have a to-do list yet, create a new one
        if (!todoList) {
            todoList = new TodoList({ user: userId });
        }

        // Add the task to the to-do list
        todoList.tasks.push(task);

        // Save the to-do list to the database
        await todoList.save();

        // Return the new task object
        res.status(201).json({ success: "Task Created Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// PUT /updateState/:taskId
// Update task status to active or completed
router.put('/updateState/:taskId', authUser, async (req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user._id;
    const { state } = req.body;

    if (!taskId || !userId || !state) {
        return res.status(400).json("Missing data!");
    }

    try {
        // find the user's todo-list
        const todoList = await TodoList.findOne({ user: userId });

        // find task by id
        const task = todoList.tasks.id(taskId);
        if (!task) {
            return res.status(404).json("Task doesn't exist!");
        }

        // update task state
        task.state = state;

        // save todoList
        await todoList.save();

        res.status(200).json({ success: "Task status updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Server Error" });
    }
});

// PUT /updateTask/:taskId
// update task details
router.put('/updateTask/:taskId', authUser, async (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, state } = req.body;
    const userId = req.user._id;

    if (!title || !description || !state) {
        return res.status(400).json("Missing data");
    }

    try {
        // find the user's todoList
        const todoList = await TodoList.findOne({ user: userId });

        // find task in todoList
        const task = todoList.tasks.id(taskId);
        if (!task) {
            return res.status(404).json("Task doesn't exist");
        }

        // update task details
        task.title = title;
        task.description = description;
        task.state = state;

        // save todoList
        await todoList.save();

        res.status(200).json("Task Updated Successfully!");
    } catch (error) {
        console.log(error);
        res.status(500).json({ Error: "Server Error" });
    }
});

// DELETE /deleteTask/:taskId
// delete task
router.delete('/deleteTask/:taskId', authUser, async(req, res) => {
    const taskId = req.params.taskId;
    const userId = req.user._id;

    if (!taskId) {
        return res.status(400).json("Task Id not given");
    }

    try {
        // find the user's todo list
        const todoList = await TodoList.findOne({ user: userId });

        // remove task from todo list
        todoList.tasks.pull(taskId);

        // save todoList
        await todoList.save();

        res.status(200).json({success: "Task deleted"});
    } catch (error) {
        console.log(error);
        res.status(500).json({Error: "Server Error"});
    }
});

// DELETE /deleteTasks
// delete many tasks
router.delete('/deleteTasks', authUser, async(req, res) => {
    const { taskIds } = req.body;

    if (!taskIds) {
        return res.status(400).json("Task id is null");
    }

    try {
        // get userId
        const userId = req.user._id;

        // get user's todo list
        const todoList = await TodoList.findOne({ user: userId });

        // remove the tasks from todo lists
        todoList.tasks = todoList.tasks.filter(task => !taskIds.includes(task.id));

        // save todo list
        await todoList.save();

        res.status(200).json({success: "Tasks Deleted Successfully!"});
    } catch (error) {
        console.log(error);
        res.status(500).json({Error: "Server Error"});
    }
});

// GET /allTasks
// retieve all tasks of user
router.get('/allTasks', authUser, async(req, res) => {
    const userId = req.user._id;
    
    try {
        // get user's todo list
        const todoList = await TodoList.findOne({ user: userId });

        if (!todoList) {
            return res.status(404).json("To-do list not found");
        }

        // send task
        res.status(200).json(todoList.tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({Error: "Server Error"});
    }
});

module.exports = router;
