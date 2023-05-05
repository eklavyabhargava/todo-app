import { useNavigate } from "react-router-dom";

const Home = (props) => {

    const navigate = useNavigate();
    const taskDetailPage = (taskId) => {
        navigate(`/taskDetail/${taskId}`);
    }

    return (
        <div className="mt-4">
            {props.tasks.map((task) => (
                <div className="card mt-2 mx-auto" onClick={() => { taskDetailPage(task._id); }} style={{ width: "60%" }} key={task._id}>
                    <div className="card-body fw-semibold fs-5">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                onClick={(e) => { e.stopPropagation(); }}
                                onChange={() => {
                                    props.changeState(task._id);
                                }}
                                checked={task.state === "Active" ? false : true}
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                Tile: {task.title}
                            </label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
};

export default Home;