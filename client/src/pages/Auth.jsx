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
      <button
        className="bg-indigo-700 hover:bg-indigo-900 text-white font-bold px-6 py-2 rounded-lg transition-colors my-8"
        onClick={toggleHandler}
      >
        {isLogin ? "Switch to Register" : "Switch to Login"}
      </button>
      <form onSubmit={submitHandler}>
        <label className="text-base text-gray-400 font-medium" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="0"
          value={email}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 mt-2 mb-4 text-white w-full focus:outline-none focus:border-blue-500"
          onChange={handleEmailChange}
        />
        <label
          className="text-base text-gray-400 font-medium"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="1"
          value={password}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 mt-2 mb-4 text-white w-full focus:outline-none focus:border-blue-500"
          onChange={handlePasswordChange}
        />
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-900 text-white font-bold px-6 py-2 rounded-lg transition-colors w-full mt-2"
          disabled={loading}
        >
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
