package com.company.controller;


import java.io.File;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.model.Application;
import com.company.model.Company;
import com.company.model.JobApplicationDTO;
import com.company.model.PostingForm;
import com.company.model.Student;
import com.company.repository.ApplicationRepository;
import com.company.repository.CompanyRepository;
import com.company.repository.JobRepository;
import com.company.repository.StudentRepository;

import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;




@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://15.206.41.13", "http://15.206.41.13:8085"},allowedHeaders = "*")
public class AuthController {
    
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }
            
            // Check student table first
            Optional<Student> studentOptional = studentRepository.findByEmail(email);
            if (studentOptional.isPresent()) {
                Student student = studentOptional.get();
                if (student.getPassword().equals(password)) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Login successful");
                    response.put("userType", "student");
                    response.put("userId", student.getId());
                    response.put("email", student.getEmail());
                    
                    // Check if student needs registration
                    if (student.getEducation() == null || student.getEducation().isEmpty()) {
                        response.put("redirect", "/student-registration");
                        response.put("completed", false);
                    } else {
                        response.put("redirect", "/jobs");
                        response.put("completed", true);
                    }
                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.badRequest().body("Invalid password");
                }
            }
            
            // Check company table
            Optional<Company> companyOptional = companyRepository.findByEmail(email);
            if (companyOptional.isPresent()) {
                Company company = companyOptional.get();
                if (company.getPassword().equals(password)) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Login successful");
                    response.put("userType", "company");
                    response.put("userId", company.getId());
                    response.put("email", company.getEmail());
                    response.put("redirect", "/companyDashboard");
                    response.put("completed", true);
                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.badRequest().body("Invalid password");
                }
            }
            
            return ResponseEntity.badRequest().body("User not found");
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred during signin: " + e.getMessage());
        }
    }
    
    @PostMapping("/signup/student")
    public ResponseEntity<?> signUpStudent(@RequestBody Map<String, String> signupRequest) {
        try {
            String email = signupRequest.get("email");
            String password = signupRequest.get("password");
            String fullName = signupRequest.get("fullName");
            String confirmPassword = signupRequest.get("confirmPassword");
            
            // Validation
            if (email == null || password == null || fullName == null) {
                return ResponseEntity.badRequest().body("All fields are required");
            }
            
            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }
            
            // Check if email exists in either table
            if (studentRepository.existsByEmail(email) || companyRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new student
            Student student = new Student();
            student.setEmail(email);
            student.setPassword(password);
            student.setFullName(fullName.toUpperCase());
            
            // Save the student
            studentRepository.save(student);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Student registered successfully");
            response.put("redirect", "/student-registration");
            response.put("completed", false);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/signup/company")
    public ResponseEntity<?> signUpCompany(@RequestBody Map<String, String> signupRequest) {
        try {
            String email = signupRequest.get("email");
            String password = signupRequest.get("password");
            String companyName = signupRequest.get("companyName");
            String mobile = signupRequest.get("mobile");
            String address = signupRequest.get("address");
            String confirmPassword = signupRequest.get("confirmPassword");
            
            // Validation
            if (email == null || password == null || companyName == null || mobile == null || address == null) {
                return ResponseEntity.badRequest().body("All fields are required");
            }
            
            if (!password.equals(confirmPassword)) {
                return ResponseEntity.badRequest().body("Passwords do not match");
            }
            
            // Check if email exists in either table
            if (studentRepository.existsByEmail(email) || companyRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Email already exists");
            }
            
            // Create new company
            Company company = new Company();
            company.setEmail(email);
            company.setPassword(password);
            company.setCompanyName(companyName);
            company.setMobile(mobile);
            company.setAddress(address);
            company.setPaymentStatus("Pending");
            
            // Save the company
            companyRepository.save(company);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Company registered successfully");
            response.put("redirect", "/posting-form");
            response.put("completed", true);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred during registration: " + e.getMessage());
        }
    }
    
    @PostMapping("/complete-student-registration")
    public ResponseEntity<?> completeStudentRegistration(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            
            if (email == null) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            // Find the student by email
            Optional<Student> studentOptional = studentRepository.findByEmail(email);
            
            if (studentOptional.isPresent()) {
                Student student = studentOptional.get();

                // Update student details

                if (request.containsKey("mobile")) {
                    student.setMobile((String) request.get("mobile"));
                }
                
                if (request.containsKey("education")) {
                    student.setEducation((String) request.get("education"));
                }
                if (request.containsKey("yearOfPassing")) {
                    student.setYearOfPassing((String) request.get("yearOfPassing"));
                }
                if (request.containsKey("place")) {
                    student.setPlace((String) request.get("place"));
                }
                if (request.containsKey("status")) {
                    student.setStatus((String) request.get("status"));
                }
                
                if ("Experience".equals(request.get("status"))) {
                    if (request.containsKey("companyName")) {
                        student.setCompanyName((String) request.get("companyName"));
                    }
                    if (request.containsKey("yearsOfExp")) {
                        student.setYearsOfExp((String) request.get("yearsOfExp"));
                    }
                    if (request.containsKey("role")) {
                        student.setRole((String) request.get("role"));
                    }
                }
                
                studentRepository.save(student);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Student registration completed successfully");
                response.put("redirect", "/");
                response.put("completed", true);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Student not found");
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }
    
    // Remove or fix the check-registration-status method since you don't have User entity
    @PostMapping("/check-registration-status")
    public ResponseEntity<?> checkRegistrationStatus(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            
            if (email == null) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            
            // Check student first
            Optional<Student> studentOptional = studentRepository.findByEmail(email);
            if (studentOptional.isPresent()) {
                Student student = studentOptional.get();
                Map<String, Object> response = new HashMap<>();
                response.put("userType", "student");
                
                if (student.getEducation() == null || student.getEducation().isEmpty()) {
                    response.put("redirect", "/student-registration");
                    response.put("completed", false);
                } else {
                    response.put("redirect", "/");
                    response.put("completed", true);
                }
                return ResponseEntity.ok(response);
            }
            
            // Check company
            Optional<Company> companyOptional = companyRepository.findByEmail(email);
            if (companyOptional.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("userType", "company");
                response.put("redirect", "/posting-form");
                response.put("completed", true);
                return ResponseEntity.ok(response);
            }
            
            return ResponseEntity.badRequest().body("User not found");
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
        }
    }

    
    
    @PostMapping("/post")
    public ResponseEntity<?> postJob(@RequestBody PostingForm job) {
        try {
            jobRepository.save(job);
            return ResponseEntity.ok(Map.of("message", "Job posted successfully", "jobId", job.getId()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error posting job: " + e.getMessage());
        }
    }

    @GetMapping
    public List<PostingForm> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostingForm> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody PostingForm jobDetails) {
        try {
            Optional<PostingForm> jobOptional = jobRepository.findById(id);
            if (jobOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            PostingForm existingJob = jobOptional.get();
            
            // Update all fields
            if (jobDetails.getJobTitle() != null) {
                existingJob.setJobTitle(jobDetails.getJobTitle());
            }
            if (jobDetails.getCompanyName() != null) {
                existingJob.setCompanyName(jobDetails.getCompanyName());
            }
            if (jobDetails.getEducationRequired() != null) {
                existingJob.setEducationRequired(jobDetails.getEducationRequired());
            }
            if (jobDetails.getExperienceLevel() != null) {
                existingJob.setExperienceLevel(jobDetails.getExperienceLevel());
            }
            if (jobDetails.getWorkMode() != null) {
                existingJob.setWorkMode(jobDetails.getWorkMode());
            }
            if (jobDetails.getSalary() != null) {
                existingJob.setSalary(jobDetails.getSalary());
            }
            if (jobDetails.getLocation() != null) {
                existingJob.setLocation(jobDetails.getLocation());
            }
            if (jobDetails.getContactEmail() != null) {
                existingJob.setContactEmail(jobDetails.getContactEmail());
            }
            if (jobDetails.getWebsite() != null) {
                existingJob.setWebsite(jobDetails.getWebsite());
            }
            if (jobDetails.getJobDescription() != null) {
                existingJob.setJobDescription(jobDetails.getJobDescription());
            }
            if (jobDetails.getResponsibilities() != null) {
                existingJob.setResponsibilities(jobDetails.getResponsibilities());
            }
            if (jobDetails.getBenefits() != null) {
                existingJob.setBenefits(jobDetails.getBenefits());
            }
            if (jobDetails.getPortalLink() != null) {
                existingJob.setPortalLink(jobDetails.getPortalLink());
            }
            
            PostingForm updatedJob = jobRepository.save(existingJob);
            return ResponseEntity.ok(updatedJob);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error updating job: " + e.getMessage());
        }
    }


@PostMapping("/apply")
    public ResponseEntity<?> applyForJob(@ModelAttribute JobApplicationDTO dto) {
        try {
            // Save resume
            String resumePath = null;
            if (dto.getResume() != null && !dto.getResume().isEmpty()) {
                String uploadDir = "uploads";
                File folder = new File(uploadDir);
                if (!folder.exists()) folder.mkdirs();

                String fileName = System.currentTimeMillis() + "_" + dto.getResume().getOriginalFilename();
                Path path = Paths.get(uploadDir, fileName);
                Files.write(path, dto.getResume().getBytes());
                resumePath = path.toString();
            }

            // Save application
            Application app = new Application();
            app.setJobId(dto.getJobId());
            app.setFullName(dto.getFullName());
            app.setEmail(dto.getEmail());
            app.setMobile(dto.getMobile());
            app.setSkills(dto.getSkills());
            app.setFresherOrExp(dto.getFresherOrExp());
            app.setCompanyName(dto.getCompanyName());
            app.setRole(dto.getRole());
            app.setYearsOfExperience(dto.getYearsOfExperience());
            app.setPreviousPackage(dto.getPreviousPackage());
            app.setExpectedPackage(dto.getExpectedPackage());
            app.setDescription(dto.getDescription());
            app.setCompanyEmail(dto.getCompanyEmail());
            app.setResumePath(resumePath);

            if (dto.getStudentId() != null) {
                app.setStudentId(dto.getStudentId());
            }

            applicationRepository.save(app);

            // ✅ Send professional email to company ONLY
            if (dto.getCompanyEmail() != null && !dto.getCompanyEmail().isEmpty()) {
                sendProfessionalApplicationEmail(dto);
            }

            Map<String, Object> cleanResponse = new HashMap<>();
        cleanResponse.put("success", true);
        cleanResponse.put("message", "Application submitted successfully");
        
        return ResponseEntity.ok(cleanResponse);
        
    } catch (Exception e) {
        e.printStackTrace();
        
        // ✅ Clean error response
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "Error in application: " + e.getMessage());
        
        return ResponseEntity.status(500).body(errorResponse);
    }
    }

    private void sendProfessionalApplicationEmail(JobApplicationDTO dto) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // ✅ PROFESSIONAL: Hidden email with professional display name
        helper.setFrom(new InternetAddress("lavanyagorle2003@gmail.com", "Career Spott Portal"));  
        
        // ✅ Send to company ONLY - REMOVED CC/BCC to yourself
        helper.setTo(dto.getCompanyEmail());
        
        // ✅ Set reply-to for direct communication between company and student
        helper.setReplyTo(dto.getEmail());
        
        helper.setSubject("New Job Application: " + dto.getFullName() + " for " + dto.getCompanyName());
        
        // ✅ Professional email content
        String emailContent = 
            "APPLICANT INFORMATION:\n" +
            "─────────────────────\n" +
            "• Full Name: " + dto.getFullName() + "\n" +
            "• Email: " + dto.getEmail() + "\n" +
            "• Mobile: " + dto.getMobile() + "\n" +
            "• Skills: " + dto.getSkills() + "\n" +
            "• Experience Level: " + dto.getFresherOrExp() + "\n";
            
        // Add experience details if provided
        if ("Experience".equals(dto.getFresherOrExp())) {
            if (dto.getYearsOfExperience() != null) {
                emailContent += "• Years of Experience: " + dto.getYearsOfExperience() + "\n";
            }
            if (dto.getPreviousPackage() != null) {
                emailContent += "• Previous Package: " + dto.getPreviousPackage() + "\n";
            }
            if (dto.getExpectedPackage() != null) {
                emailContent += "• Expected Package: " + dto.getExpectedPackage() + "\n";
            }
            if (dto.getRole() != null) {
                emailContent += "• Previous Role: " + dto.getRole() + "\n";
            }
        }
        
        emailContent += 
            "\nAPPLICATION DETAILS:\n" +
            "───────────────────\n" +
            "• Application Date: " + LocalDate.now() + "\n" +
            "• Resume: Attached\n\n";

        helper.setText(emailContent);

        // Attach resume file
        if (dto.getResume() != null && !dto.getResume().isEmpty()) {
            helper.addAttachment(dto.getResume().getOriginalFilename(), dto.getResume());
        }

        mailSender.send(message);
        
        System.out.println("✅ Application email sent to COMPANY ONLY: " + dto.getCompanyEmail());
        System.out.println("✅ NO email sent to your personal inbox");
        
    } catch (Exception e) {
        System.err.println("❌ Failed to send application email: " + e.getMessage());
    }
}

 @PostMapping("/application/{applicationId}/respond")
public ResponseEntity<?> respondToApplication(@PathVariable Long applicationId, 
                                            @RequestBody Map<String, String> request) {
    try {
        String responseMessage = request.get("message");
        String companyName = request.get("companyName");
        String actionType = request.get("actionType");

        Optional<Application> applicationOpt = applicationRepository.findById(applicationId);
        if (applicationOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Application not found");
        }

        Application application = applicationOpt.get();
        String studentEmail = application.getEmail();
        
        // Get job title
        String jobTitle = "the position";
        Optional<PostingForm> jobOpt = jobRepository.findById(application.getJobId());
        if (jobOpt.isPresent()) {
            jobTitle = jobOpt.get().getJobTitle();
        }

        // ✅ FIXED: Set status based on action type WITHOUT changing existing status
        if ("SHORTLIST".equals(actionType)) {
            application.setStatus("SHORTLISTED");
            application.setHasReply(false); // Shortlist doesn't count as message
            System.out.println("✅ Application " + applicationId + " marked as SHORTLISTED for student: " + studentEmail);
        } else if ("RESPONSE".equals(actionType)) {
            // For response, only set hasReply to true, don't change status
            application.setHasReply(true);
            application.setCompanyResponse(responseMessage);
            System.out.println("✅ Application " + applicationId + " marked as REPLIED for student: " + studentEmail);
        }
        
        applicationRepository.save(application);

        // Send professional response to student ONLY
        sendProfessionalResponseEmail(studentEmail, companyName, jobTitle, responseMessage);

        Map<String, Object> cleanResponse = new HashMap<>();
        cleanResponse.put("success", true);
        cleanResponse.put("message", "Response sent successfully to the student.");
        cleanResponse.put("status", application.getStatus());
        
        return ResponseEntity.ok(cleanResponse);

    } catch (Exception e) {
        System.err.println("❌ Response error: " + e.getMessage());
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", "Error sending response: " + e.getMessage());
        
        return ResponseEntity.status(500).body(errorResponse);
    }
}

private void sendProfessionalResponseEmail(String studentEmail, String companyName, 
                                        String jobTitle, String responseMessage) {
    try {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false);

        // ✅ Send to student ONLY
        helper.setTo(studentEmail);
        helper.setSubject("Application Update: " + jobTitle + " - " + companyName);
        
        // ✅ PROFESSIONAL: Hidden email with professional display name
        helper.setFrom(new InternetAddress("lavanyagorle2003@gmail.com", "HM Hire Portal"));
        
        // ✅ Clean professional email content
        String emailContent = 
            "APPLICATION STATUS UPDATE\n" +
            "=========================\n\n" +
            "Dear Candidate,\n\n" +
            "This email contains an important update regarding your job application.\n\n" +
            "APPLICATION DETAILS:\n" +
            "───────────────────\n" +
            "• Position: " + jobTitle + "\n" +
            "• Company: " + companyName + "\n" +
            "• Update Date: " + LocalDate.now() + "\n\n" +
            "MESSAGE FROM " + companyName.toUpperCase() + ":\n" +
            "────────────────────────────────────────────\n" +
            responseMessage + "\n" +
            "────────────────────────────────────────────\n\n" ;

        helper.setText(emailContent);
        mailSender.send(message);
        
        System.out.println("✅ Response email sent to STUDENT ONLY: " + studentEmail);
        System.out.println("✅ NO email sent to your personal inbox");
        
    } catch (Exception e) {
        System.err.println("❌ Failed to send response email: " + e.getMessage());
        throw new RuntimeException("Failed to send response email");
    }
}


@GetMapping("/student/{id}/profile")
public ResponseEntity<?> getStudentProfile(@PathVariable Long id) {
    try {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        Student student = studentOpt.get();

        // Count applications by this student
        long appliedCount = applicationRepository.countByStudentId(student.getId());
        long shortlistedCount = applicationRepository.countByStudentIdAndStatus(student.getId(), "SHORTLISTED");
        long messagesCount = applicationRepository.countByStudentIdAndHasReply(student.getId(), true);

        Map<String, Object> response = new HashMap<>();
        response.put("id", student.getId());
        response.put("fullName", student.getFullName());
        response.put("email", student.getEmail());
        response.put("mobile", student.getMobile());
        response.put("education", student.getEducation());
        response.put("yearOfPassing", student.getYearOfPassing());
        response.put("place", student.getPlace());
        response.put("status", student.getStatus());
        response.put("companyName", student.getCompanyName());
        response.put("yearsOfExp", student.getYearsOfExp());
        response.put("role", student.getRole());
        response.put("appliedCount", appliedCount);
        response.put("shortlisted", shortlistedCount);
        response.put("messages", messagesCount);

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
    }
}

    @PutMapping("/student/{id}/profile")
    public ResponseEntity<?> updateStudentProfile(
        @PathVariable Long id,
        @RequestBody Map<String, String> updates) {

        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Student not found");
        }

        Student student = studentOpt.get();

        if (updates.containsKey("fullName")) student.setFullName(updates.get("fullName"));
        if (updates.containsKey("email")) student.setEmail(updates.get("email"));
        if (updates.containsKey("mobile")) student.setMobile(updates.get("mobile"));
        if (updates.containsKey("education")) student.setEducation(updates.get("education"));
        if (updates.containsKey("yearOfPassing")) student.setYearOfPassing(updates.get("yearOfPassing"));
        if (updates.containsKey("place")) student.setPlace(updates.get("place"));
        if (updates.containsKey("status")) student.setStatus(updates.get("status"));
        if (updates.containsKey("companyName")) student.setCompanyName(updates.get("companyName"));
        if (updates.containsKey("yearsOfExp")) student.setYearsOfExp(updates.get("yearsOfExp"));
        if (updates.containsKey("role")) student.setRole(updates.get("role"));

        studentRepository.save(student);

        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @GetMapping("/student/{id}/applied-jobs")
    public ResponseEntity<?> getAppliedJobs(@PathVariable Long id) {
        try {
            List<PostingForm> jobs = applicationRepository.findAppliedJobsByStudentId(id);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching applied jobs: " + e.getMessage());
        }
    }

    @GetMapping("/student/{id}/messages")
public ResponseEntity<?> getStudentMessages(@PathVariable Long id) {
    try {
        List<Application> messages = applicationRepository.findByStudentIdAndHasReply(id, true);
        
        // Enhance messages with company and job information
        List<Map<String, Object>> enhancedMessages = messages.stream().map(application -> {
            Map<String, Object> messageData = new HashMap<>();
            
            // Basic application data
            messageData.put("id", application.getId());
            messageData.put("studentId", application.getStudentId());
            messageData.put("jobId", application.getJobId());
            messageData.put("companyResponse", application.getCompanyResponse());
            messageData.put("status", application.getStatus());
            messageData.put("hasReply", application.getHasReply());
            // Remove createdAt since it doesn't exist in Application entity
            // messageData.put("createdAt", application.getCreatedAt());
            
            // Get company name from the application
            String companyName = application.getCompanyName();
            if (companyName == null || companyName.isEmpty()) {
                // Fallback: try to get company name from job posting
                Optional<PostingForm> jobOpt = jobRepository.findById(application.getJobId());
                if (jobOpt.isPresent()) {
                    companyName = jobOpt.get().getCompanyName();
                } else {
                    companyName = "Hiring Company"; // Default fallback
                }
            }
            messageData.put("companyName", companyName);
            
            // Get job title from job posting
            String jobTitle = "Position";
            Optional<PostingForm> jobOpt = jobRepository.findById(application.getJobId());
            if (jobOpt.isPresent()) {
                jobTitle = jobOpt.get().getJobTitle();
            }
            messageData.put("jobTitle", jobTitle);
            
            return messageData;
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(enhancedMessages);
        
    } catch (Exception e) {
        return ResponseEntity.internalServerError()
                .body("Error fetching messages: " + e.getMessage());
    }
}

    @GetMapping("/student/{id}/shortlisted-jobs")
    public ResponseEntity<?> getShortlistedJobs(@PathVariable Long id) {
        try {
            List<PostingForm> jobs = applicationRepository.findShortlistedJobsByStudentId(id);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching shortlisted jobs: " + e.getMessage());
        }
    }

    // ==================== COMPANY PROFILE METHODS ====================

    @GetMapping("/company/{companyId}/profile")
    public ResponseEntity<?> getCompanyProfile(@PathVariable Long companyId) {
        try {
            Optional<Company> companyOpt = companyRepository.findById(companyId);
            if (companyOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Company not found");
            }

            Company company = companyOpt.get();
            long postedJobsCount = jobRepository.countByCompanyId(companyId);
            long applicationsCount = applicationRepository.countApplicationsByCompanyId(companyId);

            Map<String, Object> response = new HashMap<>();
            response.put("companyName", company.getCompanyName());
            response.put("email", company.getEmail());
            response.put("mobile", company.getMobile());
            response.put("address", company.getAddress());
            response.put("postedJobsCount", postedJobsCount);
            response.put("applicationsCount", applicationsCount);
            response.put("messagesCount", 0);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/company/{companyId}/jobs")
    public ResponseEntity<?> getJobsByCompanyId(@PathVariable Long companyId) {
        try {
            List<PostingForm> companyJobs = jobRepository.findByCompanyId(companyId);
            return ResponseEntity.ok(companyJobs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching company jobs: " + e.getMessage());
        }
    }

    @GetMapping("/company/{companyId}/applications")
    public ResponseEntity<?> getCompanyApplications(@PathVariable Long companyId) {
        try {
            List<PostingForm> companyJobs = jobRepository.findByCompanyId(companyId);
            List<Long> jobIds = companyJobs.stream()
                                          .map(PostingForm::getId)
                                          .collect(Collectors.toList());
            List<Application> applications = applicationRepository.findByJobIdIn(jobIds);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching company applications: " + e.getMessage());
        }
    }

    @GetMapping("/company/{companyId}/jobs-with-applications")
    public ResponseEntity<?> getJobsWithApplications(@PathVariable Long companyId) {
        try {
            List<PostingForm> companyJobs = jobRepository.findByCompanyId(companyId);
            List<Map<String, Object>> jobsWithApplications = companyJobs.stream()
                .map(job -> {
                    Map<String, Object> jobData = new HashMap<>();
                    jobData.put("id", job.getId());
                    jobData.put("jobTitle", job.getJobTitle());
                    jobData.put("companyName", job.getCompanyName());
                    jobData.put("location", job.getLocation());
                    jobData.put("experienceLevel", job.getExperienceLevel());
                    jobData.put("salary", job.getSalary());
                    jobData.put("skillsRequired", job.getSkillsRequired());
                    jobData.put("workMode", job.getWorkMode());
                    jobData.put("applicationsCount", applicationRepository.countByJobId(job.getId()));
                    return jobData;
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(jobsWithApplications);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching jobs with applications: " + e.getMessage());
        }
    }

// ==================== UTILITY METHODS ====================

    @GetMapping("/resume/{applicationId}")
    public ResponseEntity<?> downloadResume(@PathVariable Long applicationId) {
        try {
            Optional<Application> applicationOpt = applicationRepository.findById(applicationId);
            if (applicationOpt.isEmpty() || applicationOpt.get().getResumePath() == null) {
                return ResponseEntity.notFound().build();
            }

            Application application = applicationOpt.get();
            Path path = Paths.get(application.getResumePath());
            
            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            byte[] resumeData = Files.readAllBytes(path);
            String fileName = path.getFileName().toString();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resumeData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error downloading resume: " + e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}/applications")
    public ResponseEntity<?> getApplicationsByJobId(@PathVariable Long jobId) {
        try {
            List<Application> applications = applicationRepository.findByJobId(jobId);
            return ResponseEntity.ok(applications);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching job applications: " + e.getMessage());
        }
    }

    @PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
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
        
        // Password validation
        boolean hasLowerCase = newPassword.matches(".*[a-z].*");
        boolean hasUpperCase = newPassword.matches(".*[A-Z].*");
        boolean hasNumber = newPassword.matches(".*[0-9].*");
        boolean hasSpecialChar = newPassword.matches(".*[!@#$%^&*(),.?\":{}|<>].*");
        
        if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar) {
            return ResponseEntity.badRequest().body("Password must contain lowercase, uppercase, number, and special character");
        }
        
        // Check if email exists in student table
        Optional<Student> studentOptional = studentRepository.findByEmail(email);
        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            student.setPassword(newPassword);
            studentRepository.save(student);
            return ResponseEntity.ok("Password reset successfully");
        }
        
        // Check if email exists in company table
        Optional<Company> companyOptional = companyRepository.findByEmail(email);
        if (companyOptional.isPresent()) {
            Company company = companyOptional.get();
            company.setPassword(newPassword);
            companyRepository.save(company);
            return ResponseEntity.ok("Password reset successfully");
        }
        
        return ResponseEntity.badRequest().body("Email not found");
        
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("An error occurred: " + e.getMessage());
    }
}
}
