import Link from "next/link";
import { useState } from "react";

const SigninPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {};
  return (
    <div className="signin-form">
      <h3>Login Form</h3>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => loginHandler()}>Login</button>
      <div>
        <p>Create an account?</p>
        <Link href="/signup">Sign Up</Link>
      </div>
    </div>
  );
};

export default SigninPage;
