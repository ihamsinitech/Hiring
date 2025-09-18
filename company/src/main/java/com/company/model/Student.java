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
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
    private String fullName;
    private String email;
    private String password;
    private String education;
    
    @Column(name = "year_of_passing")
    private String yearOfPassing;
    private String place;
    private String status;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "years_of_exp")
    private String yearsOfExp;
    private String role;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "applied_count")
    private Integer appliedCount = 0;

    @Column(name = "shortlisted")
    private Integer shortlisted = 0;

    @Column(name = "messages")
    private Integer messages = 0;

    
    
}
