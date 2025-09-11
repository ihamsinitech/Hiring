package com.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.model.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    
}
