package com.example.BLOGAPI.Controllers;

import com.example.BLOGAPI.DTOs.request.LoginReqDTO;
import com.example.BLOGAPI.DTOs.request.RegisterReqDTO;
import com.example.BLOGAPI.DTOs.response.AuthorDTO;
import com.example.BLOGAPI.DTOs.response.LoginResDTO;
import com.example.BLOGAPI.DTOs.response.RegisterResDTO;
import com.example.BLOGAPI.Entities.Author;
import com.example.BLOGAPI.Exceptions.ResourceNotFoundException;
import com.example.BLOGAPI.Repositories.AuthorRepository;
import com.example.BLOGAPI.Security.Services.AuthService;
import com.example.BLOGAPI.Services.ServicesImpl.AuthorServiceImpl;
import com.example.BLOGAPI.Services.ServicesImpl.OTPService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthorServiceImpl authorService;
    private final OTPService otpService;
    private final AuthorRepository authorRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResDTO> Login(@RequestBody LoginReqDTO loginReqDTO){
        return ResponseEntity.ok(authService.login(loginReqDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResDTO> Register(@RequestBody RegisterReqDTO registerReqDTO){
        return ResponseEntity.ok(authService.register(registerReqDTO));
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String,String> req){
        String email = req.get("email");

        try{
            if(!authorService.authorExitsByEmail(email)){
                return ResponseEntity.badRequest().body("No Author with this email");
            }
            otpService.generateOTPAndSendToEmail(email);

            return ResponseEntity.ok("OTP send to your email.");
        }
        catch (Exception e){
            return ResponseEntity.internalServerError().body("Failed to send OTP "+e.getMessage());
        }

    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOTP(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (otpService.verifyOTP(email, otp)) {

            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        try{
            if(!otpService.verifyOTP(email,otp)){
                return ResponseEntity.badRequest().body("Invalid or expired OTP");
            }
            Long authorId=authorRepository.findByEmail(email);
            authorService.updateAuthorPassword(authorId,newPassword);

            otpService.removeOTP(email);
            return ResponseEntity.ok("Password reset successfully");
        }catch (Exception e){
            return ResponseEntity.internalServerError().body("Failed to reset password "+e.getMessage());
        }

    }



}
