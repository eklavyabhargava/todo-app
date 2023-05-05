import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";


const TaskDetail = (props) => {
    const { id } = useParams();

    const [task, setTask] = useState({ title: '', description: '', state: 'Active' });
    const [errmsg, setErrMsg] = useState({ title: '', description: '' });
    const [isEditable, setIsEditable] = useState(false);

    const getTaskDetail = () => {
        const taskDetail = props.tasks.find(task => task._id === id);
        console.log(taskDetail);
        setTask(taskDetail);
    }

    // handle 'edit' and 'save changes' button
    const handleEditClick = async () => {
        // if isEditable is true and handleEditClick is called then update task
        if (isEditable) {
            const error = props.validateForm(task);
            if (error.title || error.description) {
                console.log(error);
                setErrMsg(error);
                return;
            }

            try {
                const response = await axios.put(`http://localhost:4000/updateTask/${id}`, task, {
                    headers: {
                        Authorization: `Bearer ${props.token}`
                    }
                });

                if (response.status === 200) {
                    toast.success(response.data, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 1000,
                        toastId: "successId123"
                    });
                    await props.getTasks();
                    getTaskDetail();
                } else {
                    toast.error('Some Error Occurred!', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 1000,
                        toastId: "errorId123"
                    });
                }
            } catch (error) {
                console.log(error.response.data.Error);
                toast.error('Internal Error Occurred!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: "errorId123"
                });
            }
        }
        setIsEditable(!isEditable);
    };

    const navigate = useNavigate();

    // handle delete task
    const deleteTask = async () => {
        try {
            const response = await axios.delete(`http://localhost:4000/deleteTask/${id}`, {
                headers: {
                    Authorization: `Bearer ${props.token}`
                }
            });

            if (response.status === 200) {
                props.getTasks();
                navigate('/');
            } else {
                toast.error('Some Error Occurred!', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000,
                    toastId: "errorId123"
                });
            }
        } catch (error) {
            console.log(error.response.data.Error);
            toast.error('Internal Error Occurred!', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 1000,
                toastId: "errorId123"
            });
        }
    }

    useEffect(() => {
        getTaskDetail();
        // eslint-disable-next-line
    }, [props.tasks, id])

    return (
        <div className="card mt-4 mx-auto" style={{ width: "60%" }}>
            <div className="card-body">
                <form className="mx-auto">
                    <div className="mb-3">
                        <label className="form-label">Title:</label>
                        <input type="text" value={task?.title} className="form-control" maxLength="50" onChange={(e) => setTask({ ...task, title: e.target.value })} readOnly={!isEditable} />
                        <div class="form-text">{errmsg.title ? errmsg.title : ''}</div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Description:</label>
                        <textarea value={task?.description} className="form-control" rows="3" maxLength="120" onChange={(e) => setTask({ ...task, description: e.target.value })} readOnly={!isEditable}></textarea>
                        <div class="form-text">{errmsg.description ? errmsg.description : ''}</div>
                    </div>
                    <select className="form-select" value={task ? task.state: 'Active'} onChange={(e) => setTask({ ...task, state: e.target.value })} aria-label="Default select" disabled={!isEditable}>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-primary mt-2" onClick={() => { handleEditClick(); }}>
                            {isEditable ? "Save Changes" : "Edit"}
                        </button>
                        <button type="button" onClick={() => { deleteTask(); }} className="btn btn-danger mt-2">
                            Delete Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default TaskDetail;