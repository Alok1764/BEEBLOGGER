package com.example.BLOGAPI.Services.ServicesImpl;

import com.example.BLOGAPI.DTOs.request.OTPData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class OTPService{

    private final JavaMailSender javaMailSender;
    private final MailSender mailSender;
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${otp.expiry.minutes:5}")
    private int otpExpiryMinutes;


    private final Map<String, OTPData> otpStorage = new ConcurrentHashMap<>();


    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public void generateOTPAndSendToEmail(String email) throws Exception{
        String otp=generateOTP();

        LocalDateTime expiryTime=LocalDateTime.now().plusMinutes(otpExpiryMinutes);

        otpStorage.put(email,new OTPData(otp,expiryTime));

        sendOTPToEmail(email,otp);


    }
    private void sendOTPToEmail(String toEmail,String otp){
        try{
            SimpleMailMessage message=new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset OTP - Blog API");
            message.setText(
                    String.format("""
    Dear User,
    Your OTP for password reset is: %s
    This OTP is valid for %d minutes.
    If you didn't request this, please ignore this email.
    Best regards,
    Blog API Team.
    """, otp, otpExpiryMinutes)
            );
            mailSender.send(message);
            System.out.println("OTP send to: "+toEmail);
        }
        catch (Exception e){
            throw new RuntimeException("Failed to send OTP email: " + e.getMessage());

        }
    }

    public boolean verifyOTP(String email, String otp) {
    OTPData otpData=otpStorage.get(email);

    if(otpData==null) return false;

    if(LocalDateTime.now().isAfter(otpData.getExpiryTime())){
        otpStorage.remove(email);
        return  false;
    }
    return otpData.getOtp().equals(otp);
    }

    public void removeOTP(String email) {
        otpStorage.remove(email);
    }
}
