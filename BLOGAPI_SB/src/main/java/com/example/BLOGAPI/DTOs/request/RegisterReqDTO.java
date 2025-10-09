package com.example.BLOGAPI.DTOs.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterReqDTO {
    private String userName;
    private String email;
    private Set<String> role;
    private String password;
}
