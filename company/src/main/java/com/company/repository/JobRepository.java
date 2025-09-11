package com.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.company.model.PostingForm;

public interface JobRepository extends JpaRepository <PostingForm , Long>{

    

    
}
