import { useLocation } from "react-router-dom";

function Result() {
  const location = useLocation();
  const { data } = location.state;
  return (
    <>
      <h1>
        Here's a summary of your submission and arguably constructive feedback -
      </h1>
      <p>{data.summary}</p>
      <p>{data.feedback}</p>
    </>
  );
}

export default Result;
