package com.example.BLOGAPI.DTOs.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuthorDTO {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String website;
    private LocalDateTime createdAt;
    private Long postCount;
}
