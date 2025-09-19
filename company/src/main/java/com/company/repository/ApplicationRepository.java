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
   

    @Query("SELECT j FROM PostingForm j WHERE j.id IN (SELECT a.jobId FROM Application a WHERE a.studentId = :studentId)")
    List<PostingForm> findAppliedJobsByStudentId(@Param("studentId") Long studentId);

    List<Application> findByStudentIdAndHasReply(Long studentId, Boolean hasReply);

}
