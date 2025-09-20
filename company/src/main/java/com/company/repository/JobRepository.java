package com.company.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.model.PostingForm;

@Repository
public interface JobRepository extends JpaRepository <PostingForm , Long>{
     List<PostingForm> findByCompanyId(Long companyId);
    long countByCompanyId(Long companyId);

    
}
