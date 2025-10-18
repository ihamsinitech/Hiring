// AdminService.java - FIXED VERSION
package com.company.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.company.model.Admin;
import com.company.repository.AdminRepository;
import jakarta.annotation.PostConstruct;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    private final String ADMIN_EMAIL = "admin@company.com";

    @PostConstruct
    public void initAdmin() {
        try {
            System.out.println("=== 🚀 INITIALIZING ADMIN ACCOUNT ===");
            System.out.println("📧 Admin email: " + ADMIN_EMAIL);
            
            // Check current database state
            System.out.println("🔍 Checking current database state...");
            long totalAdmins = adminRepository.count();
            System.out.println("📊 Total admins in database: " + totalAdmins);
            
            // List all admins for debugging
            java.util.List<Admin> allAdmins = adminRepository.findAll();
            System.out.println("🔍 All admins in database:");
            for (Admin admin : allAdmins) {
                System.out.println("   - ID: " + admin.getId() + 
                                 ", Email: " + admin.getEmail() + 
                                 ", Password: " + admin.getPassword());
            }
            
            boolean adminExists = adminRepository.existsByEmail(ADMIN_EMAIL);
            System.out.println("🔎 Admin exists by email check: " + adminExists);
            
            if (!adminExists) {
                System.out.println("🆕 Creating default admin account...");
                Admin defaultAdmin = new Admin();
                defaultAdmin.setEmail(ADMIN_EMAIL);
                defaultAdmin.setPassword("admin123");
                
                Admin savedAdmin = adminRepository.save(defaultAdmin);
                System.out.println("✅ Default admin account created:");
                System.out.println("   ID: " + savedAdmin.getId());
                System.out.println("   Email: " + savedAdmin.getEmail());
                System.out.println("   Password: " + savedAdmin.getPassword());
            } else {
                System.out.println("ℹ️ Admin account already exists - KEEPING EXISTING PASSWORD");
                // REMOVED THE PASSWORD RESET CODE - THIS IS THE FIX!
                
                Admin existingAdmin = adminRepository.findByEmail(ADMIN_EMAIL);
                if (existingAdmin != null) {
                    System.out.println("📋 Current admin details:");
                    System.out.println("   ID: " + existingAdmin.getId());
                    System.out.println("   Email: " + existingAdmin.getEmail());
                    System.out.println("   Password: " + existingAdmin.getPassword());
                }
            }
            
            // Final verification
            System.out.println("🔍 Final verification...");
            Admin finalAdmin = adminRepository.findByEmail(ADMIN_EMAIL);
            if (finalAdmin != null) {
                System.out.println("✅ FINAL VERIFICATION SUCCESS:");
                System.out.println("   ID: " + finalAdmin.getId());
                System.out.println("   Email: " + finalAdmin.getEmail());
                System.out.println("   Password: " + finalAdmin.getPassword());
            } else {
                System.out.println("❌ FINAL VERIFICATION FAILED");
            }
            
        } catch (Exception e) {
            System.out.println("❌ ERROR initializing admin: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Rest of your methods remain the same...
    public boolean validateCredentials(String email, String password) {
        try {
            System.out.println("🔐 Validating credentials for: " + email);
            Admin admin = adminRepository.findByEmail(email);
            
            if (admin == null) {
                System.out.println("❌ Admin not found for email: " + email);
                return false;
            }
            
            boolean isValid = admin.getPassword().equals(password);
            System.out.println("🔑 Password validation result: " + isValid);
            System.out.println("📧 Stored email: " + admin.getEmail());
            System.out.println("🔑 Stored password: " + admin.getPassword());
            System.out.println("🔑 Provided password: " + password);
            
            return isValid;
        } catch (Exception e) {
            System.out.println("❌ Error validating credentials: " + e.getMessage());
            return false;
        }
    }

    public boolean updatePassword(String email, String newPassword) {
        try {
            System.out.println("🔄 Updating password for: " + email);
            Admin admin = adminRepository.findByEmail(email);
            
            if (admin != null) {
                System.out.println("📝 Old password: " + admin.getPassword());
                admin.setPassword(newPassword);
                Admin updatedAdmin = adminRepository.save(admin);
                System.out.println("✅ Password updated for: " + email);
                System.out.println("📝 New password: " + updatedAdmin.getPassword());
                
                // Immediate verification
                Admin verifyAdmin = adminRepository.findByEmail(email);
                if (verifyAdmin != null && verifyAdmin.getPassword().equals(newPassword)) {
                    System.out.println("✅ Password update verified in database");
                    return true;
                } else {
                    System.out.println("❌ Password update verification failed");
                    return false;
                }
            }
            System.out.println("❌ Admin not found for password update: " + email);
            return false;
        } catch (Exception e) {
            System.out.println("❌ Error updating password: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    public String getAdminEmail() {
        return ADMIN_EMAIL;
    }
    
    public Admin getAdminDetails() {
        try {
            Admin admin = adminRepository.findByEmail(ADMIN_EMAIL);
            System.out.println("🔍 Getting admin details - Found: " + (admin != null));
            return admin;
        } catch (Exception e) {
            System.out.println("❌ Error getting admin details: " + e.getMessage());
            return null;
        }
    }
    
    public java.util.List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
}