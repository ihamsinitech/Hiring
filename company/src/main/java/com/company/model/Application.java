package com.company.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Table(name = "applications")
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String jobId;
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

    @Column(length = 2000)
    private String description;

     
    private String companyEmail;

    private String resumePath;  // Store uploaded resume file path
}
