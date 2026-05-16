import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Result() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3000/submission/${id}`);
      if (!response.ok) {
        setData(null);
        return;
      }
      const submissionData = await response.json();
      setData(submissionData);
    };
    fetchData();
  }, [id]);
  return (
    <>
      <h1>
        Here's a summary of your submission and arguably constructive feedback -
      </h1>
      <p>{data && data.summary}</p>
      <p>{data && data.feedback}</p>
    </>
  );
}

export default Result;
