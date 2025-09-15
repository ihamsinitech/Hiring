package com.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.company.model.PostingForm;

@Repository
public interface JobRepository extends JpaRepository <PostingForm , Long>{

    

    
}
