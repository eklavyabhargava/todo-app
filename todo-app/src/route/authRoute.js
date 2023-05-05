import { Routes, Route, NavLink } from 'react-router-dom';
import Home from '../pages/Home';
import AddTask from '../pages/addTask';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import TaskDetail from '../pages/taskDetail';
import '../pages/home.css';

export default function AuthRoute() {

    const [searchQuery, setSearchQuery] = useState("");
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);

    const successId = "SuccessId123";
    const errorId = "ErrorId123";

    const userData = JSON.parse(localStorage.getItem('userData'));

    // if !userData, redirect to login page
    if (!userData) {
        window.location = '/login';
    }
    const token = userData.token;

    // validate task detail before submit
    const validateForm = (taskDetail) => {
        const { title, description } = taskDetail;
        let errors = {};

        if (!title) {
            errors.title = "Title is required";
        } else if (title.length > 50) {
            errors.title = "Title should not be more than 50 characters long";
        }

        if (!description) {
            errors.description = "Description is required";
        } else if (description.length > 120) {
            errors.description = "Description should not be more than 120 characters long";
        }

        return errors;
    }

    // change task state
    const changeState = async (taskId) => {
        const task = tasks.find(task => task._id === taskId);

        if (!task) {
            console.log(`Could not find task with id ${taskId}`);
            return;
        }
        const state = task.state === 'Active' ? 'Completed' : 'Active';

        try {
            const response = await axios.put(`http://localhost:4000/updateState/${taskId}`, { state }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success(response.data.success, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: successId
                });
            } else {
                toast.error(response.data || "Some error occurred", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: errorId
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error || "Internal Server Error", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                toastId: errorId
            });
        }
        getTasks();
    }

    // get user's tasks
    const getTasks = async () => {

        try {
            const response = await axios.get(`http://localhost:4000/allTasks`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setTasks(response.data);
                setFilteredTasks(response.data);
            } else {
                toast.error(response.data || "Some Error Occurred!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: errorId
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error || "Internal Server Error", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                toastId: errorId
            });
        }
    }

    // filter task by searched data
    function filterTasks(e) {
        e.preventDefault();

        // reload if searchQuery is empty to get all task
        if (!searchQuery) {
            window.location.reload(true);
        }
        // filter tasks
        const searchResult = tasks.filter((task) => {
            const searchRegex = new RegExp(searchQuery, "i");
            return searchRegex.test(task.title) || searchRegex.test(task.description);
        });

        if (searchResult) {
            // set filteredTask
            setFilteredTasks(searchResult);
        } else {
            setFilteredTasks(tasks);
        }
    }

    // filter by state
    const filterByState = (filter) => {
        if (filter === 'All') {
            setFilteredTasks(tasks);
        } else if (filter === 'Active') {
            const activeTask = tasks.filter((task) => {
                return task.state.includes(filter);
            });
            setFilteredTasks(activeTask);
        } else if (filter === 'Completed') {
            const completedTask = tasks.filter((task) => {
                return task.state.includes(filter);
            });
            setFilteredTasks(completedTask);
        }
    }

    // delete completed tasks
    const deleteTasks = async () => {
        // get completed tasks
        const tasksToDelete = tasks.filter((task) => {
            return task.state.includes("Completed");
        });

        // get tasks id, convert to string and store in completedTask list
        const completedTask = tasksToDelete.map((task) => {
            return String(task._id);
        });

        // if no any completed tasks display message
        if (!completedTask) {
            toast.warn("No completed task found", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                toastId: errorId
            });
            return;
        }

        try {
            // delete completedTasks
            const response = await axios.delete('http://localhost:4000/deleteTasks', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { taskIds: completedTask }
            });

            if (response.status === 200) {
                toast.success(response.data.success, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: successId
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error(error.response.data.Error || "Internal Server Error", {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                toastId: errorId
            });
        }
        getTasks();
    }

    // remove user's data from local storage and redirect to /login
    const logout = () => {
        localStorage.removeItem('userData');
        window.location = '/login';
    }

    useEffect(() => {
        getTasks();
        // eslint-disable-next-line
    }, [searchQuery]);

    return (
        <>
            <ToastContainer />
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">Todo App</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink to="/" className="nav-link" aria-current="page">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/addTask" className="nav-link" aria-current="page">Add Task</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Filter
                                </NavLink>
                                <ul className="dropdown-menu">
                                    <li><NavLink className="dropdown-item" onClick={() => { filterByState('All') }} to="/">All</NavLink></li>
                                    <li><NavLink className="dropdown-item" onClick={() => { filterByState('Active') }} to="/">Active</NavLink></li>
                                    <li><NavLink className="dropdown-item" onClick={() => { filterByState('Completed') }} to="/">Completed</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/" onClick={() => { deleteTasks(); }} className="nav-link" aria-current="page">Delete Tasks</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" onClick={() => { logout() }}>Logout</NavLink>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
                            <button onClick={(e) => { filterTasks(e); }} className="btn btn-success" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path='/' element={filteredTasks && <Home tasks={filteredTasks} changeState={changeState} />} />
                <Route path='/addTask' element={tasks && <AddTask getTasks={getTasks} validateForm={validateForm} tasks={tasks} changeState={changeState} token={token} />} />
                <Route path='/taskDetail/:id' element={tasks && <TaskDetail validateForm={validateForm} getTasks={getTasks} token={token} tasks={tasks} changeState={changeState} />} />
            </Routes>
        </>
    )
}