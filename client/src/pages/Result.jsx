import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function Result() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/submission/${id}`);
      setLoading(false);
      if (!response.ok) {
        setData(null);
        setError("Submission not found.");
        return;
      }
      const submissionData = await response.json();
      setData(submissionData);
    };
    fetchData();
  }, [id]);

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Submission not found.</h1>
        <Link
          to="/"
          className="bg-blue-700 hover:bg-blue-900 text-white font-bold px-6 py-2 rounded-lg transition-colors w-full mt-2"
        >
          Go Home
        </Link>
      </div>
    );
  }

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
            This submission is saved and can be found under History.
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
