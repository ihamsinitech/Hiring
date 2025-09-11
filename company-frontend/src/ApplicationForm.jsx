import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ApplicationForm.css";

const ApplicationForm = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    skills: "",
    fresherOrExp: "Fresher",
    companyName: "",
    role: "",
    yearsOfExperience: "",
    previousPackage: "",
    expectedPackage: "",
    description: ""
  });

  useEffect(() => {
    fetch(`http://localhost:8085/api/auth/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch((err) => console.error("Error fetching job:", err));
  }, [id]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]); // ✅ store selected file
  };


  const handleSubmit = async (e) => {
     e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
       const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key] ? String(form[key]) : "");
      });
      formData.append("jobId" ,id);
      formData.append("companyEmail", job.contactEmail || "");
      if (resumeFile) {
        formData.append("resume", resumeFile); // ✅ add resume file
      }



      const response = await fetch("http://localhost:8085/api/auth/apply", {
        method: "POST",
        body: formData, // ✅ send multipart/form-data
      });


      if (response.ok) {
        setMessage("Application submitted successfully!");
        setForm({
          fullName: "",
          email: "",
          mobile: "",
          skills: "",
          fresherOrExp: "Fresher",
          companyName: "",
          role: "",
          yearsOfExperience: "",
          previousPackage: "",
          expectedPackage: "",
          description: ""
        });

        setResumeFile(null);
      } else {
        const errorText = await response.text();
        setMessage("❌ Error submitting application: " + errorText);
      }
    } catch (err) {
      setMessage("❌ Failed to submit application: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <p>Loading...</p>;

  return (
    <div className="apply-container">
      <div className="apply-box">
        <h2>Apply for {job.jobTitle}</h2>
        <p><b>Company:</b> {job.companyName}</p>

        <form onSubmit={handleSubmit}>
          <label>Full Name *</label>
          <input type="text" id="fullName" value={form.fullName} onChange={handleChange} required />

          <label>Email *</label>
          <input type="email" id="email" value={form.email} onChange={handleChange} required />

          <label>Mobile *</label>
          <input type="text" id="mobile" value={form.mobile} onChange={handleChange} required />

          <label>Skills *</label>
          <input type="text" id="skills" value={form.skills} onChange={handleChange} required />

          <label required>Fresher / Experienced *</label>
          <select id="fresherOrExp" value={form.fresherOrExp} onChange={handleChange}>
            <option>Fresher</option>
            <option>Experienced</option>
          </select>

          {form.fresherOrExp === "Experienced" && (
            <>
              <label required>Company Name</label>
              <input type="text" id="companyName" value={form.companyName} onChange={handleChange} />

              <label required>Role</label>
              <input type="text" id="role" value={form.role} onChange={handleChange} />

              <label required> Years of Experience</label>
              <input type="number" id="yearsOfExperience" value={form.yearsOfExperience} onChange={handleChange} />

              <label required>Previous Package</label>
              <input type="text" id="previousPackage" value={form.previousPackage} onChange={handleChange} />

              <label required>Expected Package</label>
              <input type="text" id="expectedPackage" value={form.expectedPackage} onChange={handleChange} />
            </>
          )}

          <label>Additional Description</label>
          <textarea id="description" value={form.description} onChange={handleChange}></textarea>

          {/* ✅ Resume Upload */}
          <label>Upload Resume (PDF/DOC)</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
        {loading && <p style={{ color: "blue" }}>Submitting...</p>}
        {message && <p>{message}</p>}
       
      </div>
    </div>
  );
};

export default ApplicationForm;
