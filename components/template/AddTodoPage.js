import { GrAddCircle } from "react-icons/gr";
import { useEffect, useState } from "react";
import { BsAlignStart } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdDoneAll } from "react-icons/md";
import RadioButton from "../element/RadioButton";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
const AddTodoPage = () => {
  const [title, setTitle] = useState("");
  const [todoStatus, setTodoStatus] = useState("todo");
  const { status } = useSession();
  const router = useRouter();
  console.log(todoStatus, title);
  const addHandler = async () => {
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title, todoStatus }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (data.todoStatus === "success") {
      setTitle("");
      setTodoStatus("todo");
      toast.success("Todo created!");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
  }, [status]);
  return (
    <div className="add-form">
      <h2>
        <GrAddCircle /> Add New Todo
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
        <div className="add-form__input--second">
          <RadioButton
            title="Todo"
            value="todo"
            status={todoStatus}
            setStatus={setTodoStatus}
          >
            <BsAlignStart />
          </RadioButton>
          <RadioButton
            title="In Progress"
            value="inProgress"
            status={todoStatus}
            setStatus={setTodoStatus}
          >
            <FiSettings />
          </RadioButton>
          <RadioButton
            title="Review"
            value="review"
            status={todoStatus}
            setStatus={setTodoStatus}
          >
            <AiOutlineFileSearch />
          </RadioButton>
          <RadioButton
            title="Done"
            value="done"
            status={todoStatus}
            setStatus={setTodoStatus}
          >
            <MdDoneAll />
          </RadioButton>
        </div>
        <button onClick={() => addHandler()}>Add</button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddTodoPage;
