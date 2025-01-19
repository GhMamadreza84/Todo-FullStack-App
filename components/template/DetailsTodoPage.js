import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailsTodoPage = ({ id }) => {
  const [todos, setTodos] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  async function fetchTodoDetail() {
    const res = await fetch("/api/todos", {
      method: "GET",
    });
    const data = await res.json();
    setTodos(data.data);
  }

  useEffect(() => {
    fetchTodoDetail();
  }, []);

  useEffect(() => {
    if (todos && id) {
      const task = Object.values(todos.todos)
        .flat()
        .find((task) => task._id === id);
      setSelectedTask(task || null);
    }
  }, [todos, id]);

  if (!selectedTask) return <p>Loading ...</p>;

  return (
    <div className="details__container">
      <h1 className="details__header">Details Todo Page</h1>
      <div>
        <h2>Status: {selectedTask.status}</h2>
        <h2>Title: {selectedTask.title}</h2>
        <h3>Description: {selectedTask.description}</h3>
      </div>
      <Link href="/">
        <button style={{ marginTop: "20px" }}>Back to home</button>
      </Link>
    </div>
  );
};

export default DetailsTodoPage;
