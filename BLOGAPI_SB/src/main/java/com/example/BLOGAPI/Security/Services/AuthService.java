package com.example.BLOGAPI.Security.Services;

import com.example.BLOGAPI.DTOs.request.LoginReqDTO;
import com.example.BLOGAPI.DTOs.request.RegisterReqDTO;
import com.example.BLOGAPI.DTOs.response.AuthorDTO;
import com.example.BLOGAPI.DTOs.response.LoginResDTO;
import com.example.BLOGAPI.DTOs.response.RegisterResDTO;
import com.example.BLOGAPI.Entities.Author;
import com.example.BLOGAPI.Exceptions.ResourceNotFoundException;
import com.example.BLOGAPI.Repositories.AuthorRepository;
import com.example.BLOGAPI.Security.JWT.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.lang.module.ResolutionException;
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AuthorRepository authorRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;


    public LoginResDTO login(LoginReqDTO loginReqDTO) {

        System.out.println("Login username: "+loginReqDTO.getUserName());

        try {
            Authentication authentication = authenticationManager.authenticate(new
                    UsernamePasswordAuthenticationToken(loginReqDTO.getUserName(), loginReqDTO.getPassword()));

            System.out.println("Authentication Successful");

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtUtils.generateToken(userDetails);
            return new LoginResDTO(jwt);
        } catch (RuntimeException e) {
            System.err.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }

    }

    public RegisterResDTO register(RegisterReqDTO registerReqDTO) {
        Author author=authorRepository.findByUserName(registerReqDTO.getUserName())
                .orElse(null);
        if(author!= null) throw new IllegalArgumentException("User already exists");

        author= authorRepository.save(Author.builder()
                .userName(registerReqDTO.getUserName())
                .email(registerReqDTO.getEmail())
                .password(passwordEncoder.encode(registerReqDTO.getPassword()))
                .build()
        );
        return new RegisterResDTO(author.getId(),author.getUserName());

    }


}
