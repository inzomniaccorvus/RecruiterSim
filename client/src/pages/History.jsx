import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";

function History() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchSubmission = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:3000/history", {
        method: "GET",
        credentials: "include",
      });
      setLoading(false);
      if (!response.ok) {
        setResults(null);
        return;
      }
      const result = await response.json();
      setResults(result);
    };
    fetchSubmission();
  }, []);

  if (!isLoggedIn) {
    return (
      <>
        <h1 className="text-3xl font-bold mb-2">You're not not logged in.</h1>
        <p className="text-gray-400 mt-8 mb-8">
          Log in to see your submissions.
        </p>
        <Link
          to="/auth"
          className="bg-blue-700 hover:bg-blue-900 text-white font-bold px-6 py-2 rounded-lg transition-colors w-full mt-2"
        >
          Login
        </Link>
      </>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
      {loading ? (
        <p className="text-gray-400 mt-8">Fetching your submissions...</p>
      ) : (
        results && (
          <table className="w-full mt-8 border-collapse">
            <thead>
              <tr>
                <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700">
                  Role
                </th>
                <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700">
                  Salary Expectaion
                </th>
                <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700">
                  Date
                </th>
                <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700">
                  {
                    //For symmtery, view button;
                  }
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-700">
                  <td className="py-3 px-2 border-b border-gray-800 text-gray-300">
                    {submission.jobTitle}
                  </td>
                  <td className="py-3 px-2 border-b border-gray-800 text-gray-300">
                    {submission.salaryExpectation}
                  </td>
                  <td className="py-3 px-2 border-b border-gray-800 text-gray-300">
                    {new Date(submission.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 border-b border-gray-800 text-gray-300">
                    <a
                      className="text-blue-400 hover:underline"
                      href={`/result/${submission.id}`}
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </>
  );
}

export default History;
