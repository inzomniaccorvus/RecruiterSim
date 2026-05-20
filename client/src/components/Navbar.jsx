import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn, currentEmail, setCurrentEmail } =
    useAuth();
  const logOutHandler = async () => {
    const response = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      setIsLoggedIn(false);
      setCurrentEmail("");
    }
  };
  return (
    <nav className="bg-gray-800 flex justify-between px-2 py-4">
      <span className="font-bold text-xl px-2">Recruiter Sim</span>
      <div className="flex gap-2">
        <span className="text-gray-400 text-base mr-8">{currentEmail}</span>
        <Link
          to="/"
          className="bg-slate-900 hover:bg-indigo-950 rounded-lg px-2 py-2"
        >
          Home
        </Link>
        <Link
          to="/history"
          className="bg-slate-900 hover:bg-indigo-950 rounded-lg px-2 py-2"
        >
          History
        </Link>
        {isLoggedIn ? (
          <button
            className="bg-slate-900 hover:bg-indigo-950 rounded-lg px-2 py-2"
            onClick={logOutHandler}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/auth"
            className="bg-slate-900 hover:bg-indigo-950 rounded-lg px-2 py-2"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
