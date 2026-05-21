import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

function Navbar() {
  const { isLoggedIn, setIsLoggedIn, currentEmail, setCurrentEmail } =
    useAuth();
  const location = useLocation();

  const logOutHandler = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      setIsLoggedIn(false);
      setCurrentEmail("");
    }
  };

  const linkClass = (path) => `
    px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200
    ${
      location.pathname === path
        ? "bg-surface-light text-gold shadow-sm shadow-black/20"
        : "text-zinc-400 hover:text-white hover:bg-surface-light/40"
    }
  `;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-surface/90 border-b border-surface-light/60 px-6 py-4 flex justify-between items-center shadow-lg shadow-black/10">
      <div className="flex items-center">
        <span className="font-bold text-xl text-white">Recruiter Sim</span>
      </div>

      <div className="flex items-center gap-2">
        {currentEmail && (
          <span className="hidden sm:inline text-zinc-500 text-sm mr-4">
            {currentEmail}
          </span>
        )}
        <Link to="/" className={linkClass("/")}>
          Home
        </Link>
        <Link to="/history" className={linkClass("/history")}>
          History
        </Link>

        {isLoggedIn ? (
          <button
            className="ml-2 px-3 py-2 rounded-xl text-sm font-medium text-zinc-300 bg-app-bg/60 border border-surface-light hover:bg-surface-light hover:text-white transition-all duration-200"
            onClick={logOutHandler}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/auth"
            className="ml-2 px-3 py-2 rounded-xl text-sm font-bold bg-gold text-app-bg hover:bg-gold/90 transition-all duration-200"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
