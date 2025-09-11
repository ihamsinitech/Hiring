import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobList.css';   // ✅ import CSS

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    workModes: [],
    skills: [],
    experience: 0
  });
  const [openFilter, setOpenFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8085/api/auth')
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  // Toggle dropdown filter
  const toggleFilter = (section) => {
    setOpenFilter(openFilter === section ? null : section);
  };

  const handleWorkModeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      workModes: prev.workModes.includes(value)
        ? prev.workModes.filter((f) => f !== value)
        : [...prev.workModes, value]
    }));
  };

  const handleSkillChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(value)
        ? prev.skills.filter((f) => f !== value)
        : [...prev.skills, value]
    }));
  };

  const handleExperienceChange = (e) => {
    setFilters((prev) => ({ ...prev, experience: Number(e.target.value) }));
  };

  // ✅ Apply all filters
  const filteredJobs = jobs.filter((job) => {
    const matchWorkMode =
    filters.workModes.length === 0 ||
    filters.workModes.some(
      (mode) => job.workMode?.toLowerCase().includes(mode.toLowerCase())
    );

    const matchSkillsOrTitle =
      filters.skills.length === 0 ||
      filters.skills.some((skill) =>
        job.skillsRequired?.toLowerCase().includes(skill.toLowerCase()) ||
      job.jobTitle?.toLowerCase().includes(skill.toLowerCase())
      );

      const experienceMap = {
    "Entry Level": 0,
    "Mid Level": 3,
    "Senior Level": 5,
    "Director": 10,
    "Executive": 15
  };


    const jobExperience = experienceMap[job.experienceLevel] ?? 0;
  const matchExperience =
    !filters.experience || jobExperience >= filters.experience;

  return matchWorkMode && matchSkillsOrTitle && matchExperience;
  });

  return (
    <div className="job-list-container">
      {/* Left side filters */}
      <div className="filters-card" >
        <h3>All Filters</h3>

        {/* Work Mode */}
        <div className="filter-section">
          <div
            className="filter-header"
            onClick={() => toggleFilter("workmode")}
          >
            Work Mode <span>{openFilter === "workmode" ? "▲" : "▼"}</span>
          </div>
          <div className={`filter-options ${openFilter === "workmode" ? "show" : ""}`}>
            {["Work from office", "Hybrid", "Remote"].map((mode) => (
              <label key={mode}>
                <input
                  type="checkbox"
                  value={mode}
                  onChange={() => handleWorkModeChange(mode)}
                  checked={filters.workModes.includes(mode)}
                />
                {mode}
              </label>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleFilter("experience")}>
            Experience <span>{openFilter === "experience" ? "▲" : "▼"}</span>
          </div>
          <div className={`filter-options ${openFilter === "experience" ? "show" : ""}`}>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={filters.experience}
              onChange={handleExperienceChange}
            />
            <p>{filters.experience}+ Years</p>
          </div>
        </div>

        {/* Skills */}
        <div className="filter-section">
          <div className="filter-header" onClick={() => toggleFilter("skills")}>
            Skills <span>{openFilter === "skills" ? "▲" : "▼"}</span>
          </div>
          <div className={`filter-options ${openFilter === "skills" ? "show" : ""}`}>
            {["AWS", "DevOps", "Data Analytics", "Data Science", "Cyber Security", "Power BI"].map(
              (skill) => (
                <label key={skill}>
                  <input
                    type="checkbox"
                    value={skill}
                    onChange={() => handleSkillChange(skill)}
                    checked={filters.skills.includes(skill)}
                  />
                  {skill}
                </label>
              )
            )}
          </div>
        </div>
      </div>

      {/* Right Job List */}
      <div className="job-list">
        <h2>Available Job Opportunities</h2>
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
            <h3>{job.jobTitle}</h3>
            <p>{job.companyName} | {job.location}</p>
            <p>{job.experienceLevel} | {job.salary}</p>
            <small>Skills: {job.skillsRequired}</small>
            
            {/* ✅ Apply Button */}
            <button
              className="apply-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                navigate(`/jobs/${job.id}`);
              }}
            >
              Apply
            </button>
          </div>
        ))}
        {filteredJobs.length === 0 && (
          <p className="no-results">No jobs found for selected filters.</p>
        )}
      </div>
    </div>
  );
};
export default JobList;
