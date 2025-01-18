import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DetailsTodoPage = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/todos/${id}`);
      if (!res.ok) {
        throw new Error("Task not found");
      }
      const data = await res.json();
      setTask(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching task details:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTaskDetails();
    }
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!task) {
    return <p>Task not found</p>;
  }

  return (
    <div>
      <h1>Details Todo Page</h1>
      <div>
        <h2>Title: {task.title}</h2>
        <h3>Description: {task.description}</h3>
        <h4>Status: {task.status}</h4>
      </div>
      <Link href="/">
        <button style={{ marginTop: "20px" }}>Back to home</button>
      </Link>
    </div>
  );
};

export default DetailsTodoPage;
