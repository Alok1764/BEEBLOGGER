package com.example.BLOGAPI.DTOs.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OTPData {
    private String otp;
    private LocalDateTime expiryTime;
}
