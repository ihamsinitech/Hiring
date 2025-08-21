package com.company.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.model.Company;
import com.company.model.Registration;
import com.company.model.User;
import com.company.repository.CompanyRepository;
import com.company.repository.RegistrationRepository;
import com.company.repository.UserRepository;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
     @Autowired
    private UserRepository userRepo;

    @Autowired
    private RegistrationRepository regRepo;

    // ✅ Signup
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return "Already registered";
        }
        userRepo.save(user);
        return "Signup successful";
    }

    // ✅ Signin
    @PostMapping("/signin")
    public String signin(@RequestBody User login) {
        Optional<User> u = userRepo.findByEmail(login.getEmail());
        if (u.isPresent() && u.get().getPassword().equals(login.getPassword())) {
            if (u.get().isRegistered()) {
                return "home"; // already registered → go home
            } else {
                return "register"; // new user → registration form
            }
        }
        return "Invalid credentials";
    }

    // ✅ Registration form
    @PostMapping("/register")
    public String register(@RequestBody Registration reg) {
        reg.setFullName(reg.getFullName().toUpperCase());
        regRepo.save(reg);

        // update user as registered
        userRepo.findByEmail(reg.getEmail()).ifPresent(u -> {
            u.setRegistered(true);
            userRepo.save(u);
        });

        return "Registration completed";
    }

    // ✅ Forgot Password
    @PostMapping("/forgot")
    public String forgot(@RequestParam String email,
                         @RequestParam String newPassword,
                         @RequestParam String confirmPassword) {
        if (!newPassword.equals(confirmPassword)) {
            return "Passwords do not match";
        }
        Optional<User> u = userRepo.findByEmail(email);
        if (u.isPresent()) {
            u.get().setPassword(newPassword);
            userRepo.save(u.get());
            return "Password updated";
        }
        return "Email not found";
    }


    @Autowired
private CompanyRepository companyRepo;

// ✅ Company Registration
@PostMapping("/company/register")
public String registerCompany(@RequestBody Company company) {
    if (companyRepo.findByEmail(company.getEmail()).isPresent()) {
        return "Company already registered";
    }
    companyRepo.save(company);
    return "Company registered successfully";
}

// ✅ Company Signin
@PostMapping("/company/signin")
public String companySignin(@RequestBody Company login) {
    return companyRepo.findByEmail(login.getEmail())
            .filter(c -> c.getPassword().equals(login.getPassword()))
            .map(c -> "company-home")
            .orElse("Invalid credentials");
}

}
