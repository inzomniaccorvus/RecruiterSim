import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleHandler = () => {
    setIsLogin(!isLogin);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = isLogin
      ? await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        })
      : await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });
    setLoading(false);
    if (!response.ok) {
      return;
    }
    setIsLoggedIn(true);
    navigate("/");
  };

  return (
    <>
      <button onClick={toggleHandler}>
        {isLogin ? "Switch to Register" : "Switch to Login"}
      </button>
      <form onSubmit={submitHandler}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="0"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="1"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit" disabled={loading}>
          {isLogin
            ? loading
              ? "Logging in..."
              : "Login"
            : loading
              ? "Registering..."
              : "Register"}
        </button>
      </form>
    </>
  );
}

export default Auth;
