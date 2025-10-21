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
    private String userName;
    private String email;
    private String bio;
    private String authorPic;
    private String githubLink;
    private String linkedInLink;
    private Long totalBlogs;
    private Long totalViews;
    private Long followers;
    private Long following;
    private String website;
    private LocalDateTime createdAt;
}
