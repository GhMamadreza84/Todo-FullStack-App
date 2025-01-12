import React from "react";

const ProfileForm = ({
  name,
  lastName,
  password,
  setName,
  setLastName,
  setPassword,
  submitHandler,
}) => {
  return (
    <>
      <div className="profile-form__input">
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">LastName:</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <button onClick={submitHandler}>Submit</button>
    </>
  );
};

export default ProfileForm;
