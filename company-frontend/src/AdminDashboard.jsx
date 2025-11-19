import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        allStudents: [],
        allCompanies: [],
        allJobs: [],
        allApplications: [],
        totalStudents: 0,
        totalCompanies: 0,
        totalJobs: 0,
        totalApplications: 0
    });
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
        fetchDashboardData();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('adminToken');
        const email = localStorage.getItem('adminEmail');
        if (!token || !email) {
            navigate('/adminlogin');
        }
    };

    const fetchDashboardData = async () => {
        try {
            setError('');
            setLoading(true);
            
            const response = await axios.get('https://www.careerspott.com/api/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            
            if (response.data) {
                const data = response.data;
                setDashboardData({
                    allStudents: data.allStudents || [],
                    allCompanies: data.allCompanies || [],
                    allJobs: data.allJobs || [],
                    allApplications: data.allApplications || [],
                    totalStudents: data.totalStudents || 0,
                    totalCompanies: data.totalCompanies || 0,
                    totalJobs: data.totalJobs || 0,
                    totalApplications: data.totalApplications || 0
                });
            } else {
                throw new Error('No data received from server');
            }
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminId');
        navigate('/adminlogin');
    };

    if (loading) {
        return (
            <div className="admin-dashboard-page">
                <div className="loading">
                    <div>Loading Dashboard...</div>
                    <div className="loading-subtitle">Fetching data from backend...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard-page">
                <div className="error-container">
                    <h2>Error Loading Dashboard</h2>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={fetchDashboardData}>Retry</button>
                        <button onClick={handleLogout} className="secondary-btn">Back to Login</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-page">
            <header className="admin-header">
                <div className="header-content">
                    <h1>Admin Dashboard</h1>
                    <div className="admin-info">
                        <span className="welcome-text">Welcome, {localStorage.getItem('adminEmail')}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </header>

            <div className="dashboard-content">
                {activeTab === 'overview' && (
                    <OverviewTab dashboardData={dashboardData} />
                )}

                {activeTab === 'students' && <StudentsTab />}
                {activeTab === 'companies' && <CompaniesTab />}
                {activeTab === 'jobs' && <JobsTab />}
                {activeTab === 'applications' && <ApplicationsTab />}
            </div>

            <nav className="admin-nav">
                <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                    📊 Overview
                </button>
                <button className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
                    👥 Students
                </button>
                <button className={activeTab === 'companies' ? 'active' : ''} onClick={() => setActiveTab('companies')}>
                    🏢 Companies
                </button>
                <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>
                    💼 Jobs
                </button>
                <button className={activeTab === 'applications' ? 'active' : ''} onClick={() => setActiveTab('applications')}>
                    📝 Applications
                </button>
            </nav>
        </div>
    );
};

// Overview Tab Component
const OverviewTab = ({ dashboardData }) => (
    <div className="overview">
        <div className="stats-grid">
            <div className="stat-card glass-card">
                <h3>Total Students</h3>
                <p>{dashboardData.totalStudents}</p>
                <small>{dashboardData.allStudents.length} records</small>
            </div>
            <div className="stat-card glass-card">
                <h3>Total Companies</h3>
                <p>{dashboardData.totalCompanies}</p>
                <small>{dashboardData.allCompanies.length} records</small>
            </div>
            <div className="stat-card glass-card">
                <h3>Total Jobs</h3>
                <p>{dashboardData.totalJobs}</p>
                <small>{dashboardData.allJobs.length} records</small>
            </div>
            <div className="stat-card glass-card">
                <h3>Total Applications</h3>
                <p>{dashboardData.totalApplications}</p>
                <small>{dashboardData.allApplications.length} records</small>
            </div>
        </div>

        <div className="data-sections">
            <div className="data-section glass-card">
                <h3>All Students ({dashboardData.allStudents.length})</h3>
                <div className="activity-list">
                    {dashboardData.allStudents.length > 0 ? (
                        dashboardData.allStudents.map((student) => (
                            <div key={student.id} className="activity-item">
                                <p><strong>ID: {student.id} - {student.fullName || 'No Name'}</strong></p>
                                <p>📧 Email: {student.email || 'No Email'}</p>
                                <p>📱 Mobile: {student.mobile || 'No Mobile'}</p>
                                <p>🎓 Education: {student.education || 'No Education'}</p>
                                <p>📅 Year of Passing: {student.yearOfPassing || 'No Year'}</p>
                                <p>📍 Place: {student.place || 'No Place'}</p>
                                <p>📊 Status: {student.status || 'No Status'}</p>
                                <p>🏢 Company: {student.companyName || 'No Company'}</p>
                                <p>💼 Experience: {student.yearsOfExp || 'No Experience'}</p>
                                <p>👨‍💼 Role: {student.role || 'No Role'}</p>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No students found</div>
                    )}
                </div>
            </div>

            <div className="data-section glass-card">
                <h3>All Companies ({dashboardData.allCompanies.length})</h3>
                <div className="activity-list">
                    {dashboardData.allCompanies.length > 0 ? (
                        dashboardData.allCompanies.map((company) => (
                            <div key={company.id} className="activity-item">
                                <p><strong>ID: {company.id} - {company.companyName || 'No Name'}</strong></p>
                                <p>📧 Email: {company.email || 'No Email'}</p>
                                <p>📱 Mobile: {company.mobile || 'No Mobile'}</p>
                                <p>🏢 Address: {company.address || 'No Address'}</p>
                                <p>💰 Payment Status: {company.paymentStatus || 'No Status'}</p>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No companies found</div>
                    )}
                </div>
            </div>

            <div className="data-section glass-card">
                <h3>All Jobs ({dashboardData.allJobs.length})</h3>
                <div className="activity-list">
                    {dashboardData.allJobs.length > 0 ? (
                        dashboardData.allJobs.map((job) => (
                            <div key={job.id} className="activity-item">
                                <p><strong>ID: {job.id} - {job.jobTitle || 'No Title'}</strong></p>
                                <p>🏢 Company: {job.companyName || 'No Company'}</p>
                                <p>📍 Location: {job.location || 'No Location'}</p>
                                <p>💰 Salary: {job.salary || 'No Salary'}</p>
                                <p>🎯 Experience Level: {job.experienceLevel || 'No Experience'}</p>
                                <p>📚 Education Required: {job.educationRequired || 'No Education'}</p>
                                <p>🔄 Job Type: {job.jobType || 'No Type'}</p>
                                <p>💻 Work Mode: {job.workMode || 'No Mode'}</p>
                                <p>🛠️ Skills: {job.skillsRequired || 'No Skills'}</p>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No jobs found</div>
                    )}
                </div>
            </div>

            <div className="data-section glass-card">
                <h3>All Applications ({dashboardData.allApplications.length})</h3>
                <div className="activity-list">
                    {dashboardData.allApplications.length > 0 ? (
                        dashboardData.allApplications.map((app) => (
                            <div key={app.id} className="activity-item">
                                <p><strong>ID: {app.id} - {app.fullName || 'No Name'}</strong></p>
                                <p>📧 Email: {app.email || 'No Email'}</p>
                                <p>📱 Mobile: {app.mobile || 'No Mobile'}</p>
                                <p>💼 Job ID: {app.jobId || 'No Job ID'}</p>
                                <p>🛠️ Skills: {app.skills || 'No Skills'}</p>
                                <p>👨‍💼 Experience: {app.fresherOrExp || 'No Experience'}</p>
                                <p>🏢 Company: {app.companyName || 'No Company'}</p>
                                <p>👨‍💼 Role: {app.role || 'No Role'}</p>
                                <p>📅 Years of Experience: {app.yearsOfExperience || 'No Experience'}</p>
                                <p>💰 Expected Package: {app.expectedPackage || 'No Package'}</p>
                                <p>📊 Status: {app.status || 'No Status'}</p>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No applications found</div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// Tab Components - ALL FIELDS INCLUDED
const StudentsTab = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setError('');
            const response = await axios.get('https://www.careerspott.com/api/admin/students');
            setStudents(response.data);
        } catch (error) {
            setError('Failed to load students: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading All Students...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>All Students ({students.length})</h2>
            </div>
            {students.length === 0 ? (
                <div className="no-data">No students found in database</div>
            ) : (
                <div className="data-table glass-card">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Education</th>
                                <th>Year of Passing</th>
                                <th>Place</th>
                                <th>Status</th>
                                <th>Company</th>
                                <th>Experience</th>
                                <th>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.fullName || 'N/A'}</td>
                                    <td>{student.email || 'N/A'}</td>
                                    <td>{student.mobile || 'N/A'}</td>
                                    <td>{student.education || 'N/A'}</td>
                                    <td>{student.yearOfPassing || 'N/A'}</td>
                                    <td>{student.place || 'N/A'}</td>
                                    <td>{student.status || 'N/A'}</td>
                                    <td>{student.companyName || 'N/A'}</td>
                                    <td>{student.yearsOfExp || 'N/A'}</td>
                                    <td>{student.role || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const CompaniesTab = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            setError('');
            const response = await axios.get('https://www.careerspott.com/api/admin/companies');
            setCompanies(response.data);
        } catch (error) {
            setError('Failed to load companies: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading All Companies...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>All Companies ({companies.length})</h2>
            </div>
            {companies.length === 0 ? (
                <div className="no-data">No companies found in database</div>
            ) : (
                <div className="data-table glass-card">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Company Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Address</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.map(company => (
                                <tr key={company.id}>
                                    <td>{company.id}</td>
                                    <td>{company.companyName || 'N/A'}</td>
                                    <td>{company.email || 'N/A'}</td>
                                    <td>{company.mobile || 'N/A'}</td>
                                    <td>{company.address || 'N/A'}</td>
                                    <td>{company.paymentStatus || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const JobsTab = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setError('');
            const response = await axios.get('https://www.careerspott.com/api/admin/jobs');
            setJobs(response.data);
        } catch (error) {
            setError('Failed to load jobs: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading All Jobs...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>All Jobs ({jobs.length})</h2>
            </div>
            {jobs.length === 0 ? (
                <div className="no-data">No jobs found in database</div>
            ) : (
                <div className="data-table glass-card">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Job Type</th>
                                <th>Work Mode</th>
                                <th>Location</th>
                                <th>Salary</th>
                                <th>Experience Level</th>
                                <th>Education Required</th>
                                <th>Skills Required</th>
                                <th>Contact Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(job => (
                                <tr key={job.id}>
                                    <td>{job.id}</td>
                                    <td>{job.jobTitle || 'N/A'}</td>
                                    <td>{job.companyName || 'N/A'}</td>
                                    <td>{job.jobType || 'N/A'}</td>
                                    <td>{job.workMode || 'N/A'}</td>
                                    <td>{job.location || 'N/A'}</td>
                                    <td>{job.salary || 'N/A'}</td>
                                    <td>{job.experienceLevel || 'N/A'}</td>
                                    <td>{job.educationRequired || 'N/A'}</td>
                                    <td>{job.skillsRequired || 'N/A'}</td>
                                    <td>{job.contactEmail || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const ApplicationsTab = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setError('');
            const response = await axios.get('https://www.careerspott.com/api/admin/applications');
            setApplications(response.data);
        } catch (error) {
            setError('Failed to load applications: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading All Applications...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>All Applications ({applications.length})</h2>
            </div>
            {applications.length === 0 ? (
                <div className="no-data">No applications found in database</div>
            ) : (
                <div className="data-table glass-card">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Applicant Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Job ID</th>
                                <th>Skills</th>
                                <th>Experience</th>
                                <th>Company</th>
                                <th>Role</th>
                                <th>Years Exp</th>
                                <th>Expected Package</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map(app => (
                                <tr key={app.id}>
                                    <td>{app.id}</td>
                                    <td>{app.fullName || 'N/A'}</td>
                                    <td>{app.email || 'N/A'}</td>
                                    <td>{app.mobile || 'N/A'}</td>
                                    <td>{app.jobId || 'N/A'}</td>
                                    <td>{app.skills || 'N/A'}</td>
                                    <td>{app.fresherOrExp || 'N/A'}</td>
                                    <td>{app.companyName || 'N/A'}</td>
                                    <td>{app.role || 'N/A'}</td>
                                    <td>{app.yearsOfExperience || 'N/A'}</td>
                                    <td>{app.expectedPackage || 'N/A'}</td>
                                    <td>{app.status || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;