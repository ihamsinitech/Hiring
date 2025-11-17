package com.company.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "job_postings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostingForm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long companyId;

    private String jobTitle;
    private String companyName;
    private String jobType;
    private String workMode;
    private String location;
    private String salary;
    private String experienceLevel;
    private String educationRequired;

    @Column(length = 1000)
    private String skillsRequired;

    @Column(length = 2000)
    private String jobDescription;

    @Column(length = 1500)
    private String responsibilities;

    @Column(length = 1000)
    private String benefits;

    private String contactEmail;
    private String website;
    private String portalLink;
}
