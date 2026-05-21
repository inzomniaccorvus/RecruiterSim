import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";

function History() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, isAuthLoading } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchSubmission = async () => {
      try {
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
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [isLoggedIn]);

  if (isAuthLoading)
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-gold/60 text-lg">Loading...</p>
      </div>
    );

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <div className="bg-surface border border-surface-light/80 rounded-2xl p-8 shadow-xl shadow-black/20">
          <h1 className="text-2xl font-bold text-white mb-2">
            You are not logged in.
          </h1>
          <p className="text-zinc-400 text-sm mb-6">
            Log in to see your submissions.
          </p>
          <Link
            to="/auth"
            className="inline-block w-full bg-gold hover:bg-gold/90 text-app-bg font-bold py-2.5 px-4 rounded-xl transition-all duration-200"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-6">My Submissions</h1>

      {loading ? (
        <h2 className="text-zinc-500 text-lg">Loading...</h2>
      ) : results && results.length > 0 ? (
        <div className="overflow-x-auto border border-surface-light/80 rounded-xl bg-surface/40 shadow-xl">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-surface-light bg-surface/80">
                <th className="py-3 px-4 font-semibold text-zinc-400">
                  Job Title
                </th>
                <th className="py-3 px-4 font-semibold text-zinc-400">
                  Salary Expectation
                </th>
                <th className="py-3 px-4 font-semibold text-zinc-400">Date</th>
                <th className="py-3 px-4 font-semibold text-zinc-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-light/50">
              {results.map((submission) => (
                <tr
                  key={submission.id}
                  className="hover:bg-surface-light/30 transition-colors"
                >
                  <td className="py-3 px-4 text-zinc-200">
                    {submission.jobTitle}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {submission.salaryExpectation}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {new Date(submission.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      className="text-gold hover:underline font-medium"
                      to={`/result/${submission.id}`}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-zinc-500">No submissions found.</p>
      )}
    </div>
  );
}

export default History;
