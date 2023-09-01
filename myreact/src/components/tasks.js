import { React, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useParams } from "react-router-dom";
import DeleteModal from "./deleteModal";
import MyModal from "./deleteModal";
import { Nav } from "react-bootstrap";
import EditModal from "./editModal";

function Tasks({ tasks, setTasks }) {
  let [num, setNum] = useState(0);
  let [deleteModal, setDeleteModal] = useState(false);
  let [editModal, setEditModal] = useState(false);

  let { user } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get(`http://localhost:8080/api/tasks/${user}`)
      .then((res) => {
        let copy = [...res.data];
        setTasks(copy);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const completeTask = async (taskId, status) => {
    try {
      const stringStatus = String(status);
      await axios.post(
        `http://localhost:8080/api/complete/${taskId}/${stringStatus}`
      );
      fetchData();
      console.log("Task completed successfully");
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/delete/${taskId}`);
      fetchData();
      console.log("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task: ", err);
    }
  };

  const deleteCancle = () => {
    setDeleteModal(false);
  };

  const deleteConfirm = (taskId) => {
    deleteTask(taskId);
    setDeleteModal(false);
  };

  const editCancle = () => {
    setEditModal(false);
  };

  const editConfirm = (taskId) => {
    setEditModal(false);
  };

  return (
    <div>
      <Link to="/write">Add the task</Link>

      {tasks.map((a, i) => {
        return (
          <div className="Tasklist" key={i}>
            <div className="left-items">
              <div className={a.completed ? "strikeThrough" : ""}>
                <h4>{a.title}</h4>
                <p> {a.content}</p>
                <div style={{ fontSize: "12px" }}> {a.created_at}</div>
              </div>
            </div>
            <div className="right-items">
              <button
                variant="dark"
                onClick={() => {
                  setNum(i);
                  setEditModal(true);
                  console.log(editModal + " edit button");
                  console.log(num);
                }}
              >
                edit
              </button>
              <button
                variant="success"
                onClick={() => {
                  completeTask(tasks[i]._id, tasks[i].completed);
                }}
              >
                complete
              </button>
              <button
                variant="danger"
                onClick={() => {
                  setNum(i);
                  setDeleteModal(true);
                  console.log(deleteModal + " delete button");
                }}
              >
                delete
              </button>
            </div>{" "}
          </div>
        );
      })}

      {editModal && (
        <EditModal
          taskId={tasks[num]._id}
          title={tasks[num].title}
          content={tasks[num].content}
          onClickCancle={editCancle}
        ></EditModal>
      )}

      {deleteModal && (
        <DeleteModal
          msg={tasks[num].title}
          onClickCancle={deleteCancle}
          onClickConfirm={() => {
            deleteConfirm(tasks[num]._id);
          }}
        ></DeleteModal>
      )}
    </div>
  );
}

export default Tasks;
