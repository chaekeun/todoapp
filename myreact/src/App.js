import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router-dom";
import Register from "./components/register";
import Tasks from "./components/tasks";
import { React, useEffect, useState } from "react";
import axios from "axios";
import Write from "./components/write";

function App() {
  let [tasks, setTasks] = useState([]);
  let [timer, setTimer] = useState("");

  function Timer() {
    const currentTimer = () => {
      let today = new Date();
      today = today.toLocaleString("ko-kr");
      setTimer(today);
    };

    const startTimer = () => {
      setInterval(currentTimer, 1000);
    };
    startTimer();
  }

  return (
    <div className="App">
      <div>
        <Timer />
        <h4>{timer}</h4>
      </div>

      <Routes>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route
          path="/tasks/:user"
          element={<Tasks tasks={tasks} setTasks={setTasks}></Tasks>}
        ></Route>
        <Route path="/write" element={<Write timer={timer}></Write>}></Route>
      </Routes>
    </div>
  );
}

export default App;

function Timer() {
  const [timer, setTimer] = useState("");

  const currentTimer = () => {
    let today = new Date();
    today = today.toLocaleString("ko-kr");
    setTimer(today);
  };

  const startTimer = () => {
    setInterval(currentTimer, 1000);
  };
  startTimer();

  return (
    <div>
      <h4>{timer}</h4>
    </div>
  );
}
