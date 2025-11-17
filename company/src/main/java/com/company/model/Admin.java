// Admin.java (with constructor)
package com.company.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "admin")
@Setter
@Getter
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email_id", unique = true, nullable = false) // Match your database column
    private String email;

    @Column(name = "password", nullable = false) // Explicitly map to password column
    private String password;

    // Default constructor (required by JPA)
    public Admin() {
    }

    // Parameterized constructor
    public Admin(String email, String password) {
        this.email = email;
        this.password = password;
    }

}