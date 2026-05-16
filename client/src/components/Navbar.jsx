import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav className="bg-gray-800 flex justify-between px-2 py-4">
      <span className="font-bold text-xl px-2">Recruiter Sim</span>
      <div className="flex gap-2">
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
      </div>
    </nav>
  );
}
export default Navbar;
