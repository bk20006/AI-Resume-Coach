import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { jsPDF } from "jspdf";
import * as pdfjsLib from "pdfjs-dist";
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);
pdfjsLib.GlobalWorkerOptions.workerSrc =
  new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
function ResumeForm() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [skills, setSkills] = useState("");
  const [result, setResult] = useState(null);
  const [atsScore, setAtsScore] = useState(0);
  const [jobDescription, setJobDescription] = useState("");
  const [jobMatchScore, setJobMatchScore] = useState(0);
  const [missingSkills, setMissingSkills] = useState([]);
  const [resumeChecks, setResumeChecks] = useState([]);
  const [skillGap, setSkillGap] = useState([]);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const calculateATSScore = (resumeText, goal) => {
  let score = 0;

  const text = resumeText.toLowerCase();

 let expectedSkills = [];

if (goal.toLowerCase().includes("ai")) {
  expectedSkills = [
    "python",
    "machine learning",
    "tensorflow",
    "pytorch",
    "docker",
    "aws",
    "git",
  ];
}

else if (goal.toLowerCase().includes("data")) {
  expectedSkills = [
    "python",
    "sql",
    "pandas",
    "numpy",
    "statistics",
    "power bi",
  ];
}

else if (goal.toLowerCase().includes("full stack")) {
  expectedSkills = [
    "html",
    "css",
    "javascript",
    "react",
    "node.js",
    "mongodb",
    "git",
  ];
}

  let skillCount = 0;

expectedSkills.forEach((skill) => {
  if (text.includes(skill)) {
    skillCount++;
  }
});

if (expectedSkills.length > 0) {
  score += Math.round(
    (skillCount / expectedSkills.length) * 50
  );
}
  if (text.includes("project")) score += 20;
  if (text.includes("achievement")) score += 15;
  if (text.includes("education")) score += 15;
  if (text.includes("certification")) score += 10;
  if (text.includes("experience")) score += 10;

  return score;
};
const calculateJobMatch = () => {
  if (!jobDescription || !resume) return;

  const resumeText =
  (resume + " " + skills).toLowerCase();
  const jdText = jobDescription.toLowerCase();

  const skillList = [
  "python",
  "java",
  "sql",
  "machine learning",
  "git",
  "react",
  "javascript",
  "html",
  "css",
  "typescript",
  "docker",
  "aws",
  "azure",
  "tensorflow",
  "pytorch",
  "node.js",
  "mongodb",
  "spring boot",
  "hibernate",
  "microservices",
  "rest api",
  "kubernetes",
  "linux",
  "terraform",
  "jenkins",
  "networking",
  "wireshark",
  "burp suite",
  "metasploit",
  "pandas",
  "numpy",
  "statistics",
  "power bi",
];
  const requiredSkills = skillList.filter((skill) =>
  jdText.includes(skill)
);

  let matched = 0;
  const missing = [];

  requiredSkills.forEach((skill) => {
    if (resumeText.includes(skill)) {
      matched++;
    } else {
      missing.push(skill);
    }
  });

  const score =
    requiredSkills.length > 0
      ? Math.round((matched / requiredSkills.length) * 100)
      : 0;
  console.log("Required Skills:", requiredSkills);
  console.log("Match Score:", score);
  console.log("Missing Skills:", missing);
  setJobMatchScore(score);
  setMissingSkills(missing);
};
 const analyzeResume = async () => {

  if (!name || !goal || !skills || !resume) {
    setResult("Please fill all fields before analyzing.");
    return;
  }
  setResult("");
  setLoading(true);
  const score = calculateATSScore(
  resume + " " + skills,
  goal
);
  setAtsScore(score);
  calculateJobMatch();
  const checks = [];

if (resume.toLowerCase().includes("project"))
  checks.push("✅ Projects");
else
  checks.push("❌ Projects");

if (resume.toLowerCase().includes("achievement"))
  checks.push("✅ Achievements");
else
  checks.push("❌ Achievements");

if (resume.toLowerCase().includes("education"))
  checks.push("✅ Education");
else
  checks.push("❌ Education");

if (resume.toLowerCase().includes("experience"))
  checks.push("✅ Experience");
else
  checks.push("❌ Experience");

if (resume.toLowerCase().includes("certification"))
  checks.push("✅ Certifications");
else
  checks.push("❌ Certifications");

setResumeChecks(checks);
const roleSkills = {
  "ai engineer": [
    "python",
    "machine learning",
    "tensorflow",
    "pytorch",
    "docker",
    "aws",
    "git",
  ],

  "data scientist": [
    "python",
    "sql",
    "pandas",
    "numpy",
    "statistics",
    "power bi",
  ],

  "full stack developer": [
    "html",
    "css",
    "javascript",
    "react",
    "node.js",
    "mongodb",
    "git",
  ],
  "machine learning engineer": [
  "python",
  "machine learning",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "docker",
  "git",
],

"frontend developer": [
  "html",
  "css",
  "javascript",
  "react",
  "typescript",
  "git",
],

"backend developer": [
  "java",
  "spring boot",
  "sql",
  "rest api",
  "mongodb",
  "git",
],

"java developer": [
  "java",
  "spring boot",
  "hibernate",
  "sql",
  "microservices",
  "git",
],

"cloud engineer": [
  "aws",
  "azure",
  "docker",
  "kubernetes",
  "linux",
  "terraform",
],
"devops engineer": [
  "docker",
  "kubernetes",
  "jenkins",
  "linux",
  "aws",
  "git",
],

"cybersecurity analyst": [
  "linux",
  "networking",
  "wireshark",
  "python",
  "burp suite",
  "metasploit",
],
};

const expectedSkills =
  roleSkills[goal.toLowerCase()] || [];

const userSkills =
  (skills + " " + resume).toLowerCase();

const matched = expectedSkills.filter(
  (skill) => userSkills.includes(skill)
);

const missingSkillGap = expectedSkills.filter(
  (skill) => !userSkills.includes(skill)
);

setMatchedSkills(matched);
setSkillGap(missingSkillGap);

  try {
      console.log(import.meta.env.VITE_GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

    const prompt = `
You are an expert AI Resume Coach.

Candidate Name: ${name}

Career Goal: ${goal}

Job Description:
${jobDescription}

Skills:
${skills}

Resume Content:
${resume}
Analyze the resume against BOTH:
1. The candidate's career goal.
2. The provided job description.

Give recommendations considering both.

Provide:

1. Recommended Career Role
2. Strengths
3. Missing Skills
4. Learning Roadmap
5. Suggested Projects
6. Certifications Recommended
7. Resume Improvement Suggestions
8. Interview Preparation Tips

Format the response with clear headings and bullet points.

For Resume Improvement Suggestions:
- Mention missing technologies.
- Mention resume improvements.
- Mention project improvements.

For Interview Preparation Tips:
- Technical subjects to revise.
- Important DSA topics.
- Expected interview questions.


For Missing Skills:
- Separate skills missing for the Job Description.
- Separate skills missing for the Career Goal.
Do not repeat ATS scores, Job Match Scores, or Missing Skills already displayed by the application.

Focus on providing:
- Strengths
- Career Guidance
- Learning Roadmap
- Suggested Projects
- Certifications
- Resume Improvements
- Interview Preparation
`
;
    console.log("Sending request to Gemini...");
    const response = await model.generateContent(prompt);
    console.log("Received response from Gemini");

    const text = response.response.text();

    setResult(text);

  }catch (error) {
  console.error("Gemini Error:", error);

  console.log("Error Message:", error.message);
  console.log("Error Status:", error.status);

  if (error.message.includes("503")) {
    setResult(
      "AI service is currently busy. Please try again after a few moments."
    );
  } else {
    setResult(error.message);
  }
}
  setLoading(false);

};
const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AI Resume Analysis Report", 10, 20);

  const report =
    typeof result === "string"
      ? result
      : "No report generated yet.";

  const lines = doc.splitTextToSize(
    report,
    180
  );

  doc.setFontSize(12);
  doc.text(lines, 10, 35);

  doc.save("AI_Resume_Report.pdf");
};
const handleFileUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) return;

  setUploadedFile(file);

  if (file.type === "text/plain") {
    const text = await file.text();
    setResume(text);
    return;
  }

  if (file.type === "application/pdf") {
    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        const content = await page.getTextContent();

        extractedText +=
          content.items.map((item) => item.str).join(" ") +
          "\n";
      }

      setResume(extractedText);
    } catch (error) {
      console.error(error);
      alert("Failed to read PDF.");
    }
  }
};
  return (
  <div className="form-card">

      <h2>Resume Form</h2>
      <label>Name</label>

      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />
      <label>Career Goal</label>
      <select
  value={goal}
  onChange={(e) => setGoal(e.target.value)}
>
  <option value="">Select Career Goal</option>

  <option value="AI Engineer">AI Engineer</option>

  <option value="Data Scientist">
    Data Scientist
  </option>

  <option value="Machine Learning Engineer">
    Machine Learning Engineer
  </option>

  <option value="Full Stack Developer">
    Full Stack Developer
  </option>

  <option value="Frontend Developer">
    Frontend Developer
  </option>

  <option value="Backend Developer">
    Backend Developer
  </option>

  <option value="Java Developer">
    Java Developer
  </option>

  <option value="Cloud Engineer">
    Cloud Engineer
  </option>

  <option value="DevOps Engineer">
    DevOps Engineer
  </option>

  <option value="Cybersecurity Analyst">
    Cybersecurity Analyst
  </option>
</select>

      <br /><br />
      <label>Skills</label>
      <textarea
        placeholder="Skills"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
      />
      <br /><br />
      <label>Upload Resume (PDF or TXT)</label>

      <input
      type="file"
      accept=".pdf,.txt"
      onChange={handleFileUpload}
      />

<br /><br />
      <label>Job Description</label>

      <textarea
        placeholder="Paste Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows="5"
      />

<br /><br />
      <label>Resume Content</label>
      <textarea
      placeholder="Paste Resume Content"
      value={resume}
      onChange={(e) => setResume(e.target.value)}
      rows="8"
      cols="50"
      />

      <br /><br />

      <button
  onClick={analyzeResume}
  disabled={loading}
>
  {loading ? "Analyzing..." : "Analyze Resume"}
</button>

<button
  onClick={() => {
    setName("Bharath Kalyan");
    setGoal("AI Engineer");
    setSkills(
      "Python, Java, SQL, Machine Learning, Data Structures and Algorithms, Git"
    );
    setResume(`
Computer Science Engineering student with strong interest in Artificial Intelligence and Software Development.

Projects:
1. AI Resume Coach using Gemini API.
2. Career Recommendation System using ChromaDB and Streamlit.
3. Student Management System using Java.

Achievements:
Solved 100+ coding problems.
`);
  }}
>
  Load Sample Resume
</button>

{loading && <p>Analyzing Resume... Please wait.</p>}

<br />

<button
  onClick={downloadPDF}
  disabled={!result}
>
  Download Report PDF
</button>

<br /><br />

    
{atsScore > 0 && (
  <div className="result-card">
    <h3>📄 ATS Score</h3>

    <p
      style={{
        fontSize: "28px",
        fontWeight: "bold",
        color:
          atsScore >= 80
            ? "green"
            : atsScore >= 50
            ? "orange"
            : "red",
      }}
    >
      {atsScore}/100
    </p>

    <div
      style={{
        width: "100%",
        height: "12px",
        backgroundColor: "#444",
        borderRadius: "10px",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          width: `${atsScore}%`,
          height: "100%",
          backgroundColor:
            atsScore >= 80
              ? "green"
              : atsScore >= 50
              ? "orange"
              : "red",
          borderRadius: "10px",
        }}
      />
    </div>

    <p
      style={{
        marginTop: "12px",
        color:
  atsScore >= 80
    ? "green"
    : atsScore >= 50
    ? "orange"
    : "red",
        fontWeight: "bold",
      }}
    >
      {atsScore >= 80
        ? "Excellent ATS Match"
        : atsScore >= 50
        ? "Moderate ATS Match"
        : "Needs Improvement"}
    </p>

  </div>
)}
{(skillGap.length > 0 || matchedSkills.length > 0) && (
  <div className="result-card">
    <h3>📈 Skill Gap Analysis</h3>

    <h4>✅ Matched Skills</h4>

    <ul>
      {matchedSkills.map((skill, index) => (
        <li key={index}>✅ {skill}</li>
      ))}
    </ul>

    <h4>❌ Missing Skills for {goal}</h4>

    <ul>
      {skillGap.map((skill, index) => (
        <li key={index}>❌ {skill}</li>
      ))}
    </ul>
  </div>
)}
{resumeChecks.length > 0 && (
  <div className="result-card">
    <h3>📋 Resume Checklist</h3>

    <ul>
      {resumeChecks.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
)}
{jobDescription && (
    <div className="result-card">
    <h3>🎯 Job Match Score</h3>

    <p
  style={{
    fontSize: "28px",
    fontWeight: "bold",
    color:
      jobMatchScore >= 80
        ? "green"
        : jobMatchScore >= 50
        ? "orange"
        : "red",
  }}
>
  {jobMatchScore}%
</p>

<div
  style={{
    width: "100%",
    height: "12px",
    backgroundColor: "#444",
    borderRadius: "10px",
    marginTop: "10px",
  }}
>
  <div
    style={{
      width: `${jobMatchScore}%`,
      height: "100%",
      backgroundColor:
        jobMatchScore >= 80
          ? "green"
          : jobMatchScore >= 50
          ? "orange"
          : "red",
      borderRadius: "10px",
    }}
  />
</div>

<p
  style={{
    marginTop: "12px",
    fontWeight: "bold",
    color:
      jobMatchScore >= 80
        ? "green"
        : jobMatchScore >= 50
        ? "orange"
        : "red",
  }}
>
  {jobMatchScore >= 80
    ? "Strong Match"
    : jobMatchScore >= 50
    ? "Partial Match"
    : "Weak Match"}
</p>

    <h4>Missing Skills</h4>

    <ul>
      {missingSkills.map((skill, index) => (
  <li key={index}>{skill}</li>
))}
    </ul>
  </div>
)}
{result && (
  <div className="result-card">
    <h3>🤖 AI Career Guidance Report</h3>

    <div
  style={{
    whiteSpace: "pre-wrap",
    textAlign: "left",
    lineHeight: "1.8",
    fontSize: "16px",
  }}
>
  {result}
</div>
  </div>
)}

    </div>
  );
}

export default ResumeForm;