package com.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.model.Registration;

public interface RegistrationRepository extends JpaRepository<Registration, Long>  {
    
}
