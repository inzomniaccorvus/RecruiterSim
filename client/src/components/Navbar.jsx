import { Link } from "react-router-dom";
function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      {" | "}
      <Link to="/history">Search</Link>
    </nav>
  );
}
export default Navbar;
