import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './JobList.css';

const JobList = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [appliedCount, setAppliedCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({ shortlisted: 0 });
  const [companyReplies, setCompanyReplies] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    workModes: [],
    skills: [],
    experience: 0
  });
  const [openFilter, setOpenFilter] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ Load user from localStorage & fetch student profile
  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("userData"));

  if (storedUser) {
    console.log("User ID:", storedUser.userId);
    console.log("User Type:", storedUser.userType);

    // Fetch student profile & stats
    fetch(`http://localhost:8085/api/auth/student/${storedUser.userId}/profile`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched Profile:", data);
        setStudentProfile(data);
        setAppliedCount(data.appliedCount || 0);
        setStatusCounts({ shortlisted: data.shortlisted || 0 });
        setCompanyReplies(data.messages || 0);
      })
      .catch(err => console.error("Error fetching student profile:", err));
  }
}, []);


  // ✅ Fetch jobs
  useEffect(() => {
    fetch('http://localhost:8085/api/auth')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  // ✅ Header actions
  const goToAppliedJobs = () => navigate('/applied-jobs');
  const goToShortlistedJobs = () => navigate('/shortlisted');
  const goToMessages = () => navigate('/messages');
  const goToProfile = () => navigate('/profile');
  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate('/login');
  };

  // ✅ Toggle dropdown filter
  const toggleFilter = (section) => {
    setOpenFilter(openFilter === section ? null : section);
  };

  // ✅ Filters
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

  // ✅ Apply filters to jobs
  const filteredJobs = jobs.filter((job) => {
    const matchWorkMode =
      filters.workModes.length === 0 ||
      filters.workModes.some((mode) =>
        job.workMode?.toLowerCase().includes(mode.toLowerCase())
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
      {/* ✅ Header */}
      <header className="job-header">
        <div className="header-top">
          <div className="container">
            {/* Logo */}
            <div className="header-left">
              <div className="logo">
              <a href='/'>
                <img src="/logo-website.png" alt="CareerConnect" className="logo-img" />
              </a>
                <h1>Career Spott</h1>
              </div>
            </div>

            {/* ✅ Profile Section */}
            <div className="header-right">
              <div className="profile-section">
                <div className="profile-info">
                  <div className="avatar-container" onClick={goToProfile}>
                    <div className="profile-avatar">
                      {(studentProfile?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    {companyReplies > 0 && <span className="notification-dot"></span>}
                  </div>

                  <div className="profile-details">
                    <div className="user-name">
                      {studentProfile?.fullName || user?.email || 'User'}
                    </div>
                    <div className="profile-stats">
                      <div className="stat" onClick={goToAppliedJobs}>
                        <span className="stat-number">{appliedCount}</span>
                        <span className="stat-label">Applied</span>
                      </div>
                      <div className="stat" onClick={goToShortlistedJobs}>
                        <span className="stat-number">{statusCounts.shortlisted}</span>
                        <span className="stat-label">Shortlisted</span>
                      </div>
                      <div className="stat" onClick={goToMessages}>
                        <span className="stat-number">{companyReplies}</span>
                        <span className="stat-label">Messages</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ✅ Main Content */}
      <div className="main-content">
        {/* Left Filters */}
        <div className="left-sidebar">
          <div className="filters-card">
            <h3>All Filters</h3>

            {/* Work Mode */}
            <div className="filter-section">
              <div className="filter-header" onClick={() => toggleFilter("workmode")}>
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
        </div>

        {/* Right Job List */}
        <div className="right-content">
          <div className="job-list">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
                <h3>{job.jobTitle}</h3>
                <p>{job.companyName} | {job.location}</p>
                <p>{job.experienceLevel} | {job.salary}</p>
                <small>Skills: {job.skillsRequired}</small>
                <button
                  className="apply-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/jobs/${job.id}`);
                  }}
                >
                  Apply
                </button>
              </div>
            ))}
            {filteredJobs.length === 0 && <p className="no-results">No jobs found for selected filters.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
