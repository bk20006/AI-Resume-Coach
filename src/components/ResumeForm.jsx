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
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
 const analyzeResume = async () => {

  if (!name || !goal || !skills || !resume) {
    setResult("Please fill all fields before analyzing.");
    return;
  }
  setResult("");
  setLoading(true);

  try {
      console.log(import.meta.env.VITE_GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash"
});

    const prompt = `
You are an expert AI Resume Coach.

Candidate Name: ${name}

Career Goal: ${goal}

Skills: ${skills}
Resume Content: ${resume}

Analyze this profile and provide:

1. Resume Score (out of 100)
2. Recommended Career Role
3. Strengths
4. Missing Skills
5. Learning Roadmap
6. Suggested Projects
7. Certifications Recommended
8. Resume Improvement Suggestions
9. Interview Preparation Tips
10. Job Readiness Score (%)

Format the response with clear headings and bullet points.

For Resume Improvement Suggestions:
- Mention missing technologies.
- Mention resume improvements.
- Mention project improvements.

For Interview Preparation Tips:
- Technical subjects to revise.
- Important DSA topics.
- Expected interview questions.

For Job Readiness Score:
- Give a percentage.
- Explain why.
`;
    console.log("Sending request to Gemini...");
    const response = await model.generateContent(prompt);
    console.log("Received response from Gemini");

    const text = response.response.text();

    setResult(text);

  }catch (error) {
  console.error(error);

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
      <input
        type="text"
        placeholder="Career Goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />

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

    

{result && (
  <div className="result-card">
    <h3>📊 AI Resume Analysis Report</h3>

    <pre
      style={{
        whiteSpace: "pre-wrap",
        textAlign: "left",
      }}
    >
      {result}
    </pre>
  </div>
)}

    </div>
  );
}

export default ResumeForm;