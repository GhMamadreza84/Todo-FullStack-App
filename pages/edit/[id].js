import { GrAddCircle } from "react-icons/gr";
import { useEffect, useState } from "react";
import { BsAlignStart } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdDoneAll } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import { EditIcon } from "../../public/icons";
import { useRouter } from "next/router";
import RadioButton from "../../components/element/RadioButton";
import { ImDiamonds } from "react-icons/im";
const EditTodoPage = () => {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setStatus(todo.status || "");
    }
  }, [todo]);
  useEffect(() => {
    if (!id) return;
    async function fetchTodo() {
      try {
        const res = await fetch(`/api/todos?id=${id}`);
        const data = await res.json();

        if (data.status === "failed") {
          setError("Todo not found");
        } else {
          let foundedTodo = null;
          for (const category in data.data.todos) {
            const found = data.data.todos[category].find(
              (task) => task._id === id
            );
            if (found) {
              foundedTodo = found;
              break;
            }
          }
          if (!foundedTodo) {
            setError("Todo not found");
          } else {
            setTodo(foundedTodo);
          }
        }
      } catch (err) {
        setError("Failed to fetch todo");
      } finally {
        setLoading(false);
      }
    }
    fetchTodo();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const submitHandler = async () => {
    const res = await fetch("/api/todos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        title,
        description,
        status,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      console.log("Todo updated", data);
    } else {
      console.error("Error updatind todo:", data.message);
    }
    router.replace("/");
  };

  return (
    <div className="add-form">
      <h2>
        <EditIcon /> Edit Todo
      </h2>
      <div className="add-form__input">
        <div className="add-form__input--first">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="add-form__input--first">
          <label htmlFor="description">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="add-form__input--second">
          <RadioButton
            title="Todo"
            value="todo"
            status={status}
            setStatus={setStatus}
          >
            <BsAlignStart />
          </RadioButton>
          <RadioButton
            title="In Progress"
            value="inProgress"
            status={status}
            setStatus={setStatus}
          >
            <FiSettings />
          </RadioButton>
          <RadioButton
            title="Review"
            value="review"
            status={status}
            setStatus={setStatus}
          >
            <AiOutlineFileSearch />
          </RadioButton>
          <RadioButton
            title="Done"
            value="done"
            status={status}
            setStatus={setStatus}
          >
            <MdDoneAll />
          </RadioButton>
        </div>
        <button onClick={() => submitHandler()}>Edit</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditTodoPage;
