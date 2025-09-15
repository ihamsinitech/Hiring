import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";


export default function Home() {
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleFormSubmit = (e, formType) => {
    e.preventDefault();
    alert(`${formType} submission successful!`);
  };

  return (
    <div className={styles.careerPortal}>
      {/* Header */}
      <header className={styles.glassHeader}>
        <div className={styles.logoSection}>
          <a href="https://www.hamsinitechsolutions.com" target="_blank" rel="noreferrer">
            <img src="logo-website.png" alt="Company Logo" style={{height: '100px'}} />
          </a>
          <h1>HAMSINI TECH SOLUTIONS</h1>
        </div>

        <div className={styles.btns}>
          <button className={styles.glassBtn} onClick={() => navigate('/signin')}>
            Sign In
          </button>
          <button className={styles.glassBtn} onClick={() => openModal('signUp')}>
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`${styles.hero} ${styles.glassContainer}`}>
        <div className={styles.heroText}>
          <h2>Your Future Starts Here – Hamsini Tech Solutions 🚀</h2>
          <p>
            Step into a workplace where innovation, creativity, and passion come together.  
            We’re hiring individuals who are eager to learn, grow, and build a successful career in technology.  
          </p>

        </div>
        <div className={styles.heroImg}>
          <img src="hiring.jpg" alt="Career" />
        </div>
      </section>

      {/* Glassmorphism SignUp Choice Modal */}
      {activeModal === 'signUp' && (
        <div className={`${styles.modalOverlay} ${styles.active}`} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeIcon} onClick={closeModal}>
              <i className="fas fa-times"></i>
            </span>
            
            <h2 className={styles.modalTitle}>Choose Account Type</h2>
            
            <div className={styles.optionsContainer}>
              <div className={styles.optionCard} onClick={() => navigate('/signup')}>
                <div className={`${styles.optionIcon} ${styles.student}`}>
                  <i className="fas fa-user-graduate"></i>
                </div>
               
                <img 
                   src="student.png" 
                   alt="Student" 
                   style={{ width: "40px", height: "50px", marginRight: "10px"}} 
  />
                <h3 className={`${styles.optionTitle} ${styles.student}`}>Student</h3>
                <p className={styles.optionDescription}>Looking for opportunities? Join as a student.</p>
              </div>
              
              <div className={styles.optionCard} onClick={() => navigate('/companyRegistration')}>
                <div className={`${styles.optionIcon} ${styles.company}`}>
                  <i className="fas fa-building"></i>
                </div>
                 <img 
                  src="company.png" 
                  alt="Student" 
                  style={{ width: "40px", height: "40px", marginRight: "10px" }} 
                 />
                <h3 className={`${styles.optionTitle} ${styles.company}`}>Company</h3>
                <p className={styles.optionDescription}>Hiring talent? Register as a company.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2025 CareerPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}