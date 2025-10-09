package com.example.BLOGAPI.Controllers;

import com.example.BLOGAPI.DTOs.request.LoginReqDTO;
import com.example.BLOGAPI.DTOs.request.RegisterReqDTO;
import com.example.BLOGAPI.DTOs.response.LoginResDTO;
import com.example.BLOGAPI.DTOs.response.RegisterResDTO;
import com.example.BLOGAPI.Security.Services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResDTO> Login(@RequestBody LoginReqDTO loginReqDTO){
        return ResponseEntity.ok(authService.login(loginReqDTO));
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResDTO> Register(@RequestBody RegisterReqDTO registerReqDTO){
        return ResponseEntity.ok(authService.register(registerReqDTO));
    }

}
