import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { authFetch } from "../utils/authFetch";

function Result() {
  const { id } = useParams();
  const location = useLocation();
  const [data, setData] = useState(location.state?.data || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isLoggedIn, isAuthLoading } = useAuth();

  useEffect(() => {
    if (data) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await authFetch(
          `${import.meta.env.VITE_API_URL}/submission/${id}`,
          {},
        );
        setLoading(false);
        if (!response.ok) {
          setError("Submission not found.");
          return;
        }
        const submissionData = await response.json();
        setData(submissionData);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, data]);

  if (isAuthLoading) return null;

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold text-white mb-8">{error}</h1>
        <Link
          to="/"
          className="inline-block bg-gold hover:bg-gold/90 text-app-bg font-bold px-6 py-2 rounded-xl transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl w-full mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-white mb-6">
        Recruiter's Verdict
      </h1>

      {loading ? (
        <h2 className="text-zinc-500 text-lg">Loading...</h2>
      ) : (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl p-6 border border-surface-light/80 shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-gold">Summary</h2>
            <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {data && data.summary}
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-surface-light/80 shadow-md">
            <h2 className="text-xl font-semibold mb-3 text-gold">Feedback</h2>
            <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {data && data.feedback}
            </p>
          </div>
          <button
            onClick={() => window.print()}
            className="no-print cursor-pointer mt-6 px-6 py-2.5 rounded-xl text-sm font-bold bg-gold hover:bg-gold/90 text-app-bg transition-all duration-200"
          >
            Print / Save as PDF
          </button>
          <small className="block text-zinc-500 text-sm mt-6">
            {isLoggedIn
              ? "This submission is saved and can be found in your History tab."
              : "Login or Register to save future feedbacks."}
          </small>
        </div>
      )}
    </div>
  );
}

export default Result;
