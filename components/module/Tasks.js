import React from "react";
import { RiMastodonLine } from "react-icons/ri";
const Tasks = ({ data }) => {
  return (
    <div className="tasks">
      {data?.map((i) => (
        <div key={i._id} className="tasks__card">
          <span className={i.status}></span>
          <RiMastodonLine />
          <h4>{i.title}</h4>
        </div>
      ))}
    </div>
  );
};

export default Tasks;
