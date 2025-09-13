package com.company.controller;


import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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
                    response.put("redirect", "/postingForm");
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
        app.setJobId(dto.getJobId().toString());
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

        applicationRepository.save(app);

    // Send email if companyEmail is not null
    if (dto.getCompanyEmail() != null && !dto.getCompanyEmail().isEmpty()) {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);

    // ✅ Set "from" as your Gmail (must match spring.mail.username)
    helper.setFrom("lavanyagorle2003@gmail.com");  
    helper.setTo(dto.getCompanyEmail()); // send to company email
    helper.setSubject("New Job Application: " + dto.getFullName());
    helper.setText(
        "Candidate Details:\n\n" +
        "Name: " + dto.getFullName() + "\n" +
        "Email: " + dto.getEmail() + "\n" +
        "Mobile: " + dto.getMobile() + "\n" +
        "Skills: " + dto.getSkills() + "\n" +
        "Experience: " + dto.getFresherOrExp() + "\n\n" +
        "Please find attached resume."
    );

    // ✅ Attach resume file
    if (dto.getResume() != null && !dto.getResume().isEmpty()) {
        helper.addAttachment(dto.getResume().getOriginalFilename(), dto.getResume());
    }

           mailSender.send(message);
        }

        return ResponseEntity.ok(Map.of("message", "Application submitted successfully"));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body("❌ Error in /apply: " + e.getMessage());
    }
}

}