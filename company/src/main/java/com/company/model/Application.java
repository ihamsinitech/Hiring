package com.company.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "applications")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long companyId;
    private Long jobId;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
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
    private String resumePath;
    private Long studentId;

    private String status;

    @Column(name = "has_reply")
    private Boolean hasReply = false;

    private String companyResponse;

    // FIX: Change from primitive boolean to wrapper Boolean
    @Column(name = "viewed_by_company")
    private Boolean viewedByCompany = false;

    @Column(name = "viewed_at")
    private LocalDateTime viewedAt;

    @Column(name = "applied_date")
    private LocalDateTime appliedDate;

    // Add safe getter for viewedByCompany
    public Boolean getViewedByCompany() {
        return viewedByCompany != null ? viewedByCompany : false;
    }

    // Add safe getter for hasReply
    public Boolean getHasReply() {
        return hasReply != null ? hasReply : false;
    }

    // Add safe getter for status
    public String getStatus() {
        return status != null ? status : "Applied";
    }

    // Add safe getter for appliedDate
    public LocalDateTime getAppliedDate() {
        return appliedDate != null ? appliedDate : LocalDateTime.now();
    }

}
