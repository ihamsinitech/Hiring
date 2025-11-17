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
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  // ✅ Load user from localStorage & fetch student profile
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));

    if (storedUser) {
      console.log("User ID:", storedUser.userId);
      console.log("User Type:", storedUser.userType);
      setUser(storedUser);

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

      fetchAppliedJobs(storedUser.userId);
    }
  }, []);

  const fetchAppliedJobs = (studentId) => {
  fetch(`http://localhost:8085/api/auth/student/${studentId}/applied-jobs`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch applied jobs');
      }
      return res.json();
    })
    .then(data => {
      console.log('Fetched applied jobs:', data); // Debug log
      // Extract job IDs from applied jobs - handle both formats
      const appliedJobIds = data.map(job => {
        // Handle different possible ID fields
        return job.id || job.jobId || job.applicationId;
      }).filter(id => id != null); // Filter out null/undefined
      
      setAppliedJobs(appliedJobIds);
    })
    .catch(err => {
      console.error("Error fetching applied jobs:", err);
      setAppliedJobs([]);
    });
};


  // ✅ Fetch jobs
  useEffect(() => {
    fetch('http://localhost:8085/api/auth')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error("Error fetching jobs:", err));
  }, []);

  // Check if job is applied
  const isJobApplied = (jobId) => {
    return appliedJobs.includes(jobId);
  };

  // Handle job application - FIXED
  const handleApplyJob = async (job, e) => {
    e.stopPropagation();

    if (!user || !studentProfile) {
      alert('Please login to apply for jobs');
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all required fields
      formData.append('studentId', user.userId);
      formData.append('jobId', job.id);
      formData.append('fullName', studentProfile.fullName || '');
      formData.append('email', studentProfile.email || user.email || '');
      formData.append('mobile', studentProfile.mobile || '');
      formData.append('skills', studentProfile.skills || '');
      formData.append('fresherOrExp', studentProfile.status || 'Fresher');
      formData.append('companyName', job.companyName || '');
      formData.append('companyEmail', job.contactEmail || '');
      
      // Add experience details if available
      if (studentProfile.status === 'Experience') {
        formData.append('role', studentProfile.role || '');
        formData.append('yearsOfExperience', studentProfile.yearsOfExp || '');
        formData.append('previousPackage', studentProfile.previousPackage || '');
        formData.append('expectedPackage', studentProfile.expectedPackage || '');
      }
      
      formData.append('description', `Application for ${job.jobTitle} at ${job.companyName}`);
      
      // You need to handle resume file upload - for now using a placeholder
      // formData.append('resume', resumeFile);

      const response = await fetch('http://localhost:8085/api/auth/apply', {
        method: 'POST',
        body: formData
        // Don't set Content-Type header for FormData - browser will set it automatically
      });

      // Get the response text to see what the actual error is
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { message: responseText };
      }
      
      if (response.ok) {
        // Add to applied jobs and update count
        setAppliedJobs(prev => [...prev, job.id]);
        setAppliedCount(prev => prev + 1);

        // Show success message
        alert('Successfully applied for the job!');
      } else {
        console.error('Server response:', responseData);
        alert(`Failed to apply for the job: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Error applying for job: ' + error.message);
    }
  };
  
  // ✅ Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // ✅ Clear search
  const clearSearch = () => {
    setSearchQuery('');
  };



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

    // Search filter
    const matchesSearch = searchQuery === '' || 
      (job.jobTitle && job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.companyName && job.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.skillsRequired && job.skillsRequired.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.jobDescription && job.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()));


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

    return matchesSearch && matchWorkMode && matchSkillsOrTitle && matchExperience;
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

            {/* ✅ Search Bar */}
            <div className="header-center">
              <div className="search-container">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search jobs by title, company, skills, or location..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button className="clear-search" onClick={clearSearch}>
                      ✕
                    </button>
                  )}
                  <span className="search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
                </div>
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
                        <span className="stat-label">Replies</span>
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
            {filteredJobs.map((job) => {
              const hasApplied = isJobApplied(job.id);

              return (
                <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/${job.id}`)}>
                  <h3>{job.jobTitle}</h3>
                  <p>{job.companyName} | {job.location}</p>
                  <p>{job.experienceLevel} | {job.salary}</p>
                  <small>Skills: {job.skillsRequired}</small>
                  <button
            className={`apply-btn ${hasApplied ? 'applied' : ''}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              if (!hasApplied) {
                // Navigate to job details page instead of applying directly
                navigate(`/jobs/${job.id}`);
              }
                    }}
                    disabled={hasApplied}
                  >
                    {hasApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              );
            })}
            {filteredJobs.length === 0 && <p className="no-results">No jobs found for selected filters.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
