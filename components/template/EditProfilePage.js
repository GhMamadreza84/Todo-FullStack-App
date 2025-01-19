import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const EditProfilePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
  });
  const router = useRouter();

  async function fetchUserProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setFormData(data?.data);
    } catch (err) {
      console.log("error in fetching profile data :", err);
    }
  }

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.status === "success") {
      toast.success("Todo created!");
      setTimeout(() => {
        router.push("/profile");
      }, 7000);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [1]);

  return (
    <div className="details__container">
      <h1 className="details__header">Edit Profile</h1>
      <form onSubmit={formSubmitHandler} className="edit__form">
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <input
          type="text"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />

        <button style={{ justifyContent: "center", width: "fit-content" }}>
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditProfilePage;
