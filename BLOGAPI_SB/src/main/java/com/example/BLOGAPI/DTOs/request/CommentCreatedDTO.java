package com.example.BLOGAPI.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CommentCreatedDTO {

    @NotBlank
    @Size(max=1000,message = "Message size should not exceed 1000 characters")
    private String comment;

}
