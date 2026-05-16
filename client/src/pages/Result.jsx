import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Result() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/submission/${id}`);
      setLoading(false);
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
    <div className="max-w-4xl w-full mx-auto">
      <h1 className="text-3xl font-bold mb-6">Recruiter's Verdict</h1>
      {loading ? (
        <h2>Loading... </h2>
      ) : (
        <div>
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">
              Summary
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {data && data.summary}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">
              Feedback
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {data && data.feedback}
            </p>
          </div>
          <small className="text-gray-500 text-sm mt-6">
            This submission is saved and can be found under History using{" "}
            {data && data.email}.
          </small>
        </div>
      )}

      <small className="text-gray-500 text-sm mt-6">
        Disclaimer - This is AI-generated feedback. Take it with an open mind.
      </small>
    </div>
  );
}

export default Result;
