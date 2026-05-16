import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [resume, setResume] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [salaryExpectation, setSalaryExpectation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobTitle", jobTitle);
    formData.append("salaryExpectation", salaryExpectation);

    setLoading(true);
    const respone = await fetch("http://localhost:3000/submit", {
      method: "POST",
      body: formData,
    });
    setLoading(false);
    const data = await respone.json();
    navigate(`/result/${data.id}`);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Recruiter Simulator</h1>
      <h2 className="text-lg text-gray-400 mb-4">
        Get honest and constructive feedback with a touch of humor
      </h2>
      <p className="text-gray-400 text-sm mb-6 ">
        Usage: Upload your resume, drop in the role and salary you're gunning
        for, and let our AI recruiter tell you exactly where you stand.
      </p>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="resume" className="text-sm text-gray-400 font-medium">
            Resume — PDF only{" "}
          </label>
          <input
            type="file"
            id="resume"
            className="hidden"
            onChange={(e) => setResume(e.target.files[0])}
          />
          <label
            htmlFor="resume"
            className="cursor-pointer bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-400 w-full block hover:border-blue-500"
          >
            {resume ? resume.name : "Click to upload resume (PDF)"}
          </label>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="jobTitle"
            className="text-sm text-gray-400 font-medium"
          >
            Target Role
          </label>
          <input
            type="text"
            name="jobTittle"
            id="1"
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-blue-500"
            onChange={(e) => {
              setJobTitle(e.target.value);
            }}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="salaryExpectation"
            className="text-sm text-gray-400 font-medium"
          >
            Expected Salary (USD/year)
          </label>
          <input
            type="text"
            name="salaryExpectation"
            id="2"
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white w-full focus:outline-none focus:border-blue-500"
            onChange={(e) => setSalaryExpectation(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-900 text-white font-bold px-6 py-2 rounded-lg transition-colors w-full mt-2"
          disabled={loading}
        >
          {loading ? "Roasting..." : "Roast Me"}
        </button>
      </form>
      <p>
        <small>
          Your submissions are saved - look them up anytime under History
        </small>
      </p>
    </>
  );
}

export default Home;
