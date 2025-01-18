import { RiMastodonLine } from "react-icons/ri";
import { BiRightArrow, BiLeftArrow } from "react-icons/bi";
import Link from "next/link";
import { EditIcon, IconOpen } from "../../public/icons";
const Tasks = ({ data, next, back, fetchTodos }) => {
  const changeStatus = async ({ id, status }) => {
    const res = await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.status === "success") {
      await fetchTodos();
    }
  };

  return (
    <div className="tasks">
      {data?.map((i) => (
        <div key={i._id} className="tasks__card">
          <span className={i.status}></span>
          <RiMastodonLine />
          <div className="edit__btn">
            <Link href={`/edit/${i._id}`}>
              <EditIcon />
            </Link>
          </div>
          <div className="details__btn">
            <Link href={`/details/${i._id}`}>
              <IconOpen />
            </Link>
          </div>
          <h4>{i.title}</h4>
          <span>{i.description}</span>
          <div>
            {back ? (
              <button
                className="button-back"
                onClick={() => changeStatus({ id: i._id, status: back })}
              >
                <BiLeftArrow />
                Back
              </button>
            ) : null}
            {next ? (
              <button
                className="button-next"
                onClick={() => changeStatus({ id: i._id, status: next })}
              >
                Next
                <BiRightArrow />
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
