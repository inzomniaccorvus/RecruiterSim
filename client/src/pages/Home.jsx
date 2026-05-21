import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [resume, setResume] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return alert("Please upload your resume first!");

    let formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", jobTitle);
    formData.append("salaryExpectation", salaryExpectation);

    setLoading(true);
    const response = await fetch("http://localhost:3000/submit", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    setLoading(false);
    if (!response.ok) {
      const err = await response.json();
      setError(err.error || "Something went wrong. Please try again.");
      return;
    }
    const data = await response.json();
    if (data.id) {
      navigate(`/result/${data.id}`);
    } else {
      navigate("/result/anonymous", { state: { data } });
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Recruiter Simulator
        </h1>
        <h2 className="text-lg text-zinc-400 mb-4">
          Get honest and constructive feedback with a touch of humor
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Usage: Upload your resume, drop in the role and salary you're gunning
          for, and let our AI recruiter tell you exactly where you stand.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-surface-light/80 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl shadow-black/20"
      >
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-400 font-medium">
            Resume (PDF only)
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setResume(e.target.files[0])}
          />
          <label
            htmlFor="resume"
            className="flex flex-col items-center justify-center border-2 border-dashed border-surface-light hover:border-gold/60 bg-app-bg/40 rounded-xl p-5 text-center cursor-pointer transition-all duration-200"
          >
            <span className="text-sm text-zinc-300">
              {resume ? `📄 ${resume.name}` : "Click to select resume file"}
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="jobTitle"
            className="text-sm text-zinc-400 font-medium"
          >
            Target Role
          </label>
          <input
            type="text"
            id="jobTitle"
            maxLength={100}
            className="w-full bg-app-bg/80 border border-surface-light rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition-all duration-200"
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="salaryExpectation"
            className="text-sm text-zinc-400 font-medium"
          >
            Expected Salary (USD/year)
          </label>
          <input
            type="number"
            id="salaryExpectation"
            className="w-full bg-app-bg/80 border border-surface-light rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-gold transition-all duration-200"
            onChange={(e) => setSalaryExpectation(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gold hover:bg-gold/90 text-app-bg font-bold py-3 px-6 rounded-xl transition-all duration-200 disabled:bg-surface-light disabled:text-zinc-500 mt-2"
          disabled={loading}
        >
          {loading ? "Roasting..." : "Roast Me"}
        </button>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
}

export default Home;
