import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyDashBoard.css';

const CompanyDashBoard = () => {
  const [companyProfile, setCompanyProfile] = useState(null);
  const [postedJobsCount, setPostedJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    workModes: [],
    skills: [],
    experience: 0
  });
  const [openFilter, setOpenFilter] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ✅ Load user from localStorage & fetch company profile
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));

    if (storedUser) {
      setUser(storedUser);
      console.log("Company ID:", storedUser.userId);

      // Fetch company profile & stats
      fetch(`http://15.206.41.13:8085/api/auth/company/${storedUser.userId}/profile`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Profile not found');
          }
          return res.json();
        })
        .then(data => {
          console.log("Fetched Company Profile:", data);
          setCompanyProfile(data);
          setPostedJobsCount(data.postedJobsCount || 0);
          setApplicationsCount(data.applicationsCount || 0);
          setMessagesCount(data.messagesCount || 0);
          setError('');
        })
        .catch(err => {
          console.error("Error fetching company profile:", err);
          setError('Failed to load company profile');
          // Create a default profile if API fails
          setCompanyProfile({
            companyName: storedUser.email || 'Company',
            postedJobsCount: 0,
            applicationsCount: 0,
            messagesCount: 0
          });
        });
    }
  }, []);

  // ✅ Fetch company's posted jobs
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      fetch(`http://15.206.41.13:8085/api/auth/company/${storedUser.userId}/jobs`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Jobs not found');
          }
          return res.json();
        })
        .then(data => {
          console.log("Fetched Jobs Data:", data); // ✅ Debug log
          console.log("First job applications:", data[0]?.applicationsCount); 
          setJobs(Array.isArray(data) ? data : []);
          setError('');
        })
        .catch(err => {
          console.error("Error fetching company jobs:", err);
          setError('Failed to load jobs');
          setJobs([]);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // ✅ Fetch company's posted jobs with application counts
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("userData"));
  if (storedUser) {
    fetch(`http://15.206.41.13:8085/api/auth/company/${storedUser.userId}/jobs-with-applications`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Jobs not found');
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched Jobs with Applications:", data);
        setJobs(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(err => {
        console.error("Error fetching company jobs:", err);
        setError('Failed to load jobs');
        setJobs([]);
      })
      .finally(() => setLoading(false));
  }
}, []);


  // ✅ Header actions
  const goToApplications = () => navigate('/companyApplications');
  const goToProfile = () => navigate('/companyProfile');
  
  
  // ✅ Create new job
  const createNewJob = () => {
    navigate('/postingForm');
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
  const filteredJobs = Array.isArray(jobs) ? jobs.filter((job) => {
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
  }) : [];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="job-list-container">
      {/* ✅ Header */}
      <header className="job-header">
        <div className="header-top">
          <div className="container">
            {/* Logo */}
            <div className="header-left">
              <div className="logo">
                <a href='/company'>
                  <img src="/logo-website.png" alt="CareerConnect" className="logo-img" />
                </a>
                <h1>Career Hire</h1>
              </div>
            </div>

            {/* ✅ Profile Section */}
            <div className="header-right">
              <div className="profile-section">
                <div className="profile-info">
                  <div className="avatar-container" onClick={goToProfile}>
                    <div className="profile-avatar">
                      {(companyProfile?.companyName || user?.email || 'C').charAt(0).toUpperCase()}
                    </div>
                    {messagesCount > 0 && <span className="notification-dot"></span>}
                  </div>

                  <div className="profile-details">
                    <div className="user-name">
                      {companyProfile?.companyName || user?.email || 'Company'}
                    </div>
                    <div className="profile-stats">
                      <div className="stat" onClick={goToApplications}>
                        <span className="stat-number">{applicationsCount}</span>
                        <span className="stat-label">Applications</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* ✅ Main Content */}
      <div className="main-content">
        {/* Left Filters */}
        <div className="left-sidebar">
          <div className="filters-card">
            <h3>Filter Jobs</h3>

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
          <div className="job-list-header">
            <h2>Your Posted Jobs</h2>
            <button className="create-job-btn" onClick={createNewJob}>
              + Create New Post
            </button>
          </div>
          
          <div className="job-list">
            {filteredJobs.map((job) => (
              <div key={job.id} className="job-card" onClick={() => navigate(`/company/job/${job.id}`)}>
                <h3>{job.jobTitle}</h3>
                <p>{job.companyName} | {job.location}</p>
                <p>{job.experienceLevel} | {job.salary}</p>
                <small>Skills: {job.skillsRequired}</small>
                <div className="job-stats">
                  <span className="applicants-count">{job.applicationsCount || 0} Applicants</span>
                </div>
                <button
                  className="view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/company/job/${job.id}`);
                  }}
                >
                  View Details
                </button>
              </div>
            ))}
            {filteredJobs.length === 0 && <p className="no-results">No jobs posted yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashBoard;