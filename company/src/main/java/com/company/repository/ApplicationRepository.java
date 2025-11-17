package com.company.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.company.model.Application;
import com.company.model.PostingForm;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, String status);
    long countByStudentIdAndHasReply(Long studentId, Boolean hasReply); 
   
    // ✅ ADD THESE MISSING METHODS
    List<Application> findByJobId(Long jobId);
    List<Application> findByStudentIdAndStatus(Long studentId, String status);

    @Query("SELECT j FROM PostingForm j WHERE j.id IN (SELECT a.jobId FROM Application a WHERE a.studentId = :studentId)")
    List<PostingForm> findAppliedJobsByStudentId(@Param("studentId") Long studentId);

    List<Application> findByStudentIdAndHasReply(@Param("studentId") Long studentId, @Param("hasReply") boolean hasReply);

    @Query("SELECT j FROM PostingForm j JOIN Application a ON j.id = a.jobId WHERE a.studentId = :studentId AND a.status = 'SHORTLISTED'")
    List<PostingForm> findShortlistedJobsByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.jobId IN (SELECT j.id FROM PostingForm j WHERE j.companyId = :companyId)")
    long countApplicationsByCompanyId(@Param("companyId") Long companyId);

    List<Application> findByJobIdIn(List<Long> jobIds);

    long countByJobId(Long jobId);

    

// Count applications by job IDs and status
   long countByJobIdInAndStatus(List<Long> jobIds, String status);

// Count applications by job IDs and hasReply
   long countByJobIdInAndHasReply(List<Long> jobIds, boolean hasReply);

// Count applications by student ID and hasReply
   long countByStudentIdAndHasReply(Long studentId, boolean hasReply);

   
   long countByJobIdIn(List<Long> jobIds);

   List<Application> findByStudentId(Long studentId);

   
}