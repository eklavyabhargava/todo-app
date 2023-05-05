import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTask = (props) => {

    const [task, setTask] = useState({ title: '', description: '', state: 'Active' });
    const [errmsg, setErrMsg] = useState({ title: '', description: '' });

    const navigate = useNavigate();

    // create new task
    const createTask = async () => {
        const error = props.validateForm(task);
        if (error.title || error.description) {
            console.log(error);
            setErrMsg(error);
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/createTask', task, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            });

            if (response.status === 201) {
                toast.success(response.data.success, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: "successId123"
                });
                props.getTasks();
                navigate('/');
            } else {
                console.log(response.data);
                toast.error('Some Error Occurred!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: "errorId123"
                });
            }
        } catch (error) {
            console.log(error.response.data);
            toast.error(error.response.data || 'Internal Error Occurred!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                toastId: "errorId123"
            });
        }
    };

    return (
        <div className="card mt-4 mx-auto" style={{ width: "60%", cursor: "default" }}>
            <div className="card-body">
                <form className="mx-auto">
                    <div className="mb-3">
                        <label className="form-label">Title:</label>
                        <input type="text" value={task?.title} className="form-control" maxLength="50" onChange={(e) => setTask({ ...task, title: e.target.value })} />
                        <div class="form-text">{errmsg.title ? errmsg.title : ''}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description:</label>
                        <textarea value={task?.description} className="form-control" rows="3" maxLength="120" onChange={(e) => setTask({ ...task, description: e.target.value })}></textarea>
                        <div class="form-text">{errmsg.description ? errmsg.description : ''}</div>
                    </div>
                    <select className="form-select" value={task ? task.state : 'Active'} onChange={(e) => setTask({ ...task, state: e.target.value })} aria-label="Default select">
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-primary mt-2" onClick={() => { createTask(); }}>
                            Create Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
};

export default AddTask;