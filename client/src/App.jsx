import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Result from "./pages/Result";
import History from "./pages/History";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Submit</Link>
        {" | "}
        <Link to="/history">Search</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
