const mongoose = require('mongoose');

// define the task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    state: {
        type: String,
        enum: ['Active', 'Completed'],
        required: true,
    },
});

// define the todo list schema
const todoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    tasks: [taskSchema],
});

mongoose.model('Task', taskSchema);
mongoose.model('TodoList', todoSchema);