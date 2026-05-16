import { useState } from "react";

function History() {
  const [email, setEmail] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

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
  };

  return (
    <>
      <h1>Search with email</h1>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <label htmlFor="input">Email : </label>
        <input
          type="text"
          name="email"
          id="0"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {results &&
        results.map((submission) => (
          <div key={submission.id}>
            <p>Email : {submittedEmail}</p>
            <p>Job Title : {submission.jobTitle}</p>
            <p>Salary Expectation : {submission.salaryExpectation}</p>
            <p>Summary: {submission.summary}</p>
            <p>Feedback: {submission.feedback}</p>
          </div>
        ))}

      {searched && !loading && results === null && (
        <>
          <p>Email : {submittedEmail}</p>
          <h1>No submissions found.</h1>
        </>
      )}
    </>
  );
}

export default History;
