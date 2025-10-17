package com.company.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.model.Application;
import com.company.model.Company;
import com.company.model.PostingForm;
import com.company.model.Student;
import com.company.repository.ApplicationRepository;
import com.company.repository.CompanyRepository;
import com.company.repository.JobRepository;
import com.company.repository.StudentRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://15.206.41.13", "http://15.206.41.13:8085"}, allowedHeaders = "*")
public class AdminController {

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    private final String ADMIN_EMAIL = "admin@company.com";
    private String adminPassword = "admin123";

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }
            
            if (ADMIN_EMAIL.equals(email) && adminPassword.equals(password)) { // Use variable instead of final
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Admin login successful");
                response.put("userType", "admin");
                response.put("adminId", 1);
                response.put("email", email);
                response.put("redirect", "/admin-dashboard");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred during admin login: " + e.getMessage());
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getAdminDashboard() {
        try {
            System.out.println("=== ADMIN DASHBOARD REQUESTED ===");
            
            Map<String, Object> dashboardData = new HashMap<>();
            
            // Get counts
            long totalStudents = studentRepository.count();
            long totalCompanies = companyRepository.count();
            long totalJobs = jobRepository.count();
            long totalApplications = applicationRepository.count();
            
            System.out.println("📊 Counts - Students: " + totalStudents + ", Companies: " + totalCompanies + 
                              ", Jobs: " + totalJobs + ", Applications: " + totalApplications);
            
            // Get ALL data
            List<Student> allStudents = studentRepository.findAll();
            List<Company> allCompanies = companyRepository.findAll();
            List<PostingForm> allJobs = jobRepository.findAll();
            List<Application> allApplications = applicationRepository.findAll();
            
            // EXTENSIVE DEBUGGING
            System.out.println("=== ACTUAL RECORDS FOUND ===");
            System.out.println("Students: " + allStudents.size());
            System.out.println("Companies: " + allCompanies.size());
            System.out.println("Jobs: " + allJobs.size());
            System.out.println("Applications: " + allApplications.size());
            
            if (!allStudents.isEmpty()) {
                System.out.println("👥 Sample Student: ID=" + allStudents.get(0).getId() + 
                                 ", Name=" + allStudents.get(0).getFullName() + 
                                 ", Email=" + allStudents.get(0).getEmail());
            }
            
            if (!allCompanies.isEmpty()) {
                System.out.println("🏢 Sample Company: ID=" + allCompanies.get(0).getId() + 
                                 ", Name=" + allCompanies.get(0).getCompanyName() + 
                                 ", Email=" + allCompanies.get(0).getEmail());
            }
            
            dashboardData.put("totalStudents", totalStudents);
            dashboardData.put("totalCompanies", totalCompanies);
            dashboardData.put("totalJobs", totalJobs);
            dashboardData.put("totalApplications", totalApplications);
            dashboardData.put("allStudents", allStudents);
            dashboardData.put("allCompanies", allCompanies);
            dashboardData.put("allJobs", allJobs);
            dashboardData.put("allApplications", allApplications);
            
            System.out.println("✅ Dashboard data prepared successfully");
            return ResponseEntity.ok(dashboardData);
            
        } catch (Exception e) {
            System.out.println("❌ ERROR in dashboard: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error fetching dashboard data: " + e.getMessage());
        }
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        try {
            List<Student> students = studentRepository.findAll();
            System.out.println("👥 GET /students - Returning: " + students.size() + " students");
            
            // Debug first student
            if (!students.isEmpty()) {
                Student first = students.get(0);
                System.out.println("📝 First student - ID: " + first.getId() + 
                                 ", Name: " + first.getFullName() + 
                                 ", Email: " + first.getEmail());
            }
            
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            System.out.println("❌ Error in /students: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error fetching students: " + e.getMessage());
        }
    }

    @GetMapping("/companies")
    public ResponseEntity<?> getAllCompanies() {
        try {
            List<Company> companies = companyRepository.findAll();
            System.out.println("🏢 GET /companies - Returning: " + companies.size() + " companies");
            
            if (!companies.isEmpty()) {
                Company first = companies.get(0);
                System.out.println("📝 First company - ID: " + first.getId() + 
                                 ", Name: " + first.getCompanyName() + 
                                 ", Email: " + first.getEmail());
            }
            
            return ResponseEntity.ok(companies);
        } catch (Exception e) {
            System.out.println("❌ Error in /companies: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error fetching companies: " + e.getMessage());
        }
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs() {
        try {
            List<PostingForm> jobs = jobRepository.findAll();
            System.out.println("💼 GET /jobs - Returning: " + jobs.size() + " jobs");
            
            if (!jobs.isEmpty()) {
                PostingForm first = jobs.get(0);
                System.out.println("📝 First job - ID: " + first.getId() + 
                                 ", Title: " + first.getJobTitle() + 
                                 ", Company: " + first.getCompanyName());
            }
            
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            System.out.println("❌ Error in /jobs: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error fetching jobs: " + e.getMessage());
        }
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        try {
            List<Application> applications = applicationRepository.findAll();
            System.out.println("📝 GET /applications - Returning: " + applications.size() + " applications");
            
            if (!applications.isEmpty()) {
                Application first = applications.get(0);
                System.out.println("📝 First application - ID: " + first.getId() + 
                                 ", Name: " + first.getFullName() + 
                                 ", Email: " + first.getEmail());
            }
            
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            System.out.println("❌ Error in /applications: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Error fetching applications: " + e.getMessage());
        }
    }

    // Delete methods
    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            if (studentRepository.existsById(id)) {
                studentRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting student: " + e.getMessage());
        }
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        try {
            if (companyRepository.existsById(id)) {
                companyRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Company deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting company: " + e.getMessage());
        }
    }

    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            if (jobRepository.existsById(id)) {
                jobRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting job: " + e.getMessage());
        }
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        try {
            if (applicationRepository.existsById(id)) {
                applicationRepository.deleteById(id);
                return ResponseEntity.ok(Map.of("message", "Application deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting application: " + e.getMessage());
        }
    }

    // Add this method to your existing AdminController class
@PostMapping("/forgot-password")
    public ResponseEntity<?> adminForgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("newPassword");
            String confirmPassword = request.get("confirmPassword");
            
            // Validation
            if (email == null || newPassword == null || confirmPassword == null) {
                return ResponseEntity.badRequest().body("All fields are required");
            }
            
            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }
            
            // Check if it's the admin email
            if (!ADMIN_EMAIL.equals(email)) {
                return ResponseEntity.badRequest().body("Admin email not found");
            }
            
            // Password validation
            boolean hasLowerCase = newPassword.matches(".*[a-z].*");
            boolean hasUpperCase = newPassword.matches(".*[A-Z].*");
            boolean hasNumber = newPassword.matches(".*[0-9].*");
            boolean hasSpecialChar = newPassword.matches(".*[!@#$%^&*(),.?\":{}|<>].*");
            
            if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
                return ResponseEntity.badRequest().body("Password must contain lowercase, uppercase, number, and special character");
            }
            
            // ✅ ACTUALLY UPDATE THE PASSWORD
            adminPassword = newPassword;
            
            return ResponseEntity.ok("Admin password reset successfully. Please use the new password to login.");
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

}