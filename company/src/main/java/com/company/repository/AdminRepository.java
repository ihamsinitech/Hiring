// AdminRepository.java - UPDATED
package com.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.company.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // Use the correct column name in query
    @Query("SELECT a FROM Admin a WHERE a.email = :email")
    Admin findByEmail(@Param("email") String email);

    @Query("SELECT COUNT(a) > 0 FROM Admin a WHERE a.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Modifying
    @Query("UPDATE Admin a SET a.password = :password WHERE a.email = :email")
    void updatePassword(@Param("email") String email, @Param("password") String password);
}