package com.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.model.Application;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, String status);
    long countByStudentIdAndCompanyEmailNotNull(Long studentId);

}
