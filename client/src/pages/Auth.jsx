import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCurrentEmail, setIsLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const toggleHandler = () => setIsLogin(!isLogin);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? "login" : "register";
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      },
    );
    setLoading(false);
    if (!response.ok) {
      const err = await response.json();
      setAuthError(err.error || "Something went wrong.");
      return;
    }

    setIsLoggedIn(true);
    setCurrentEmail(email);
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-surface border border-surface-light/80 rounded-2xl p-8 shadow-xl shadow-black/20">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          {isLogin ? "Login" : "Register"}
        </h1>

        <form onSubmit={submitHandler} className="space-y-4">
          <div className="flex flex-col gap-1">
            <label
              className="text-sm text-zinc-400 font-medium"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              className="w-full bg-app-bg/80 border border-surface-light rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition-all duration-200"
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="text-sm text-zinc-400 font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              className="w-full bg-app-bg/80 border border-surface-light rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition-all duration-200"
              onChange={handlePasswordChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gold hover:bg-gold/90 text-app-bg font-bold py-2.5 px-4 rounded-xl transition-all duration-200 disabled:bg-surface-light disabled:text-zinc-500 mt-2"
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
        {authError && (
          <p className="text-red-400 text-base mt-4">{authError}</p>
        )}
        <button
          onClick={toggleHandler}
          className="w-full text-center text-sm text-zinc-400 hover:text-gold transition-colors mt-6 pt-4 border-t border-surface-light/50"
        >
          {isLogin ? "Switch to Register" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
