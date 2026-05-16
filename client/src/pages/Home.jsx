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
      <h1>Recruiter Simulator</h1>
      <h2>Get honest and constructive feedback with a touch of humor</h2>
      <p>
        Usage: Upload your resume, drop in the role and salary you're gunning
        for, and let our AI recruiter tell you exactly where you stand
      </p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="resume">Resume(PDF) : </label>
        <input
          type="file"
          name="resume"
          id="0"
          onChange={(e) => {
            setResume(e.target.files[0]);
          }}
        />
        <label htmlFor="jobTitle">Target Role : </label>
        <input
          type="text"
          name="jobTittle"
          id="1"
          onChange={(e) => {
            setJobTitle(e.target.value);
          }}
        />
        <label htmlFor="salaryExpectation">Expected Salary (USD/year) : </label>
        <input
          type="text"
          name="salaryExpectation"
          id="2"
          onChange={(e) => setSalaryExpectation(e.target.value)}
        />
        <button type="submit" disabled={loading}>
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
