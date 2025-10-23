package com.example.BLOGAPI.DTOs.request;


import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AuthorProfileDTO {

    @Size(max=500 ,message = "Bio size should not exceed 500 characters")
    private String bio;
    private String githubLink;
    private String linkedInLink;
    private String website;
    private String authorPic;
}
