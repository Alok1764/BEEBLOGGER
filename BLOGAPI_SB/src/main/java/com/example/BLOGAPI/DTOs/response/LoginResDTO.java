package com.example.BLOGAPI.DTOs.response;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class LoginResDTO {
    private String jwtToken;
}
