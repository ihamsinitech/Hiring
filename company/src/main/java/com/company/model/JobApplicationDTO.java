package com.company.model;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
@Data
public class JobApplicationDTO {
    private Long jobId;
    private String fullName;
    private String email;
    private String mobile;
    private String skills;
    private String fresherOrExp;
    private String companyName;
    private String role;
    private String yearsOfExperience;
    private String previousPackage;
    private String expectedPackage;
    private String description;
    private String companyEmail;

    private MultipartFile resume;

    private Long studentId;

}
