import { useState } from "react";

function History() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [results, setResults] = useState(() => {
    const saved = sessionStorage.getItem("historyResults");
    return saved ? JSON.parse(saved) : null;
  });

  const [submittedEmail, setSubmittedEmail] = useState(() => {
    return sessionStorage.getItem("historyEmail") || "";
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmittedEmail(email);
    setSearched(true);
    setLoading(true);
    const response = await fetch(
      `http://localhost:3000/history?email=${email}`,
      { method: "GET" },
    );
    setLoading(false);
    if (!response.ok) {
      setResults(null);
      return;
    }
    const data = await response.json();
    setResults(data);
    sessionStorage.setItem("historyResults", JSON.stringify(data));
    sessionStorage.setItem("historyEmail", email);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Search for submissions</h1>
      <p className="text-gray-400 text-sm mb-6 ">
        Use full email adress to search
      </p>
      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="input" className="text-sm text-gray-400 font-medium">
            Email :{" "}
          </label>
          <input
            type="text"
            name="email"
            id="0"
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-900 text-white font-bold px-6 py-2 rounded-lg transition-colors w-full mt-2"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {results && (
        <table className="w-full mt-8 border-collapse">
          <thead>
            <tr>
              <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700">
                Email
              </th>
              <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700">
                Job Title
              </th>
              <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700">
                Salary
              </th>
              <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700">
                Date
              </th>
              <th className="text-left text-gray-400 text-sm pb-3 px-2 border-b border-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {results.map((submission) => (
              <tr key={submission.id} className="hover:bg-gray-700">
                <td className="py-3 px-2 border-b border-gray-800 text-gray-300">
                  {submittedEmail}
                </td>
                <td className="py-3 px-2 border-b border-gray-800 text-gray-300">
                  {submission.jobTitle}
                </td>
                <td className="py-3 px-2 border-b border-gray-800 text-gray-300">
                  {submission.salaryExpectation}
                </td>
                <td className="py-3 px-2 border-b border-gray-800 text-gray-300">
                  {new Date(submission.date).toLocaleDateString()}
                </td>
                <td className=" py-3 px-2 border-b border-gray-800">
                  <a
                    href={`/result/${submission.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {searched && !loading && results === null && (
        <>
          <p className="text-gray-400 mt-8">
            No submissions found for{" "}
            <span className="text-white">{submittedEmail}</span>.
          </p>
        </>
      )}
    </>
  );
}

export default History;
