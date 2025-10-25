package com.example.BLOGAPI.DTOs.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CategoryCreatedDTO {

    @NotBlank(message = "Category name is required")
    @Size(max = 50, message = "Category name must not exceed 50 characters")
    private String name;

//    @NotBlank(message = "Category slug is required")
//    @Size(max = 50, message = "Category slug must not exceed 50 characters")
//    private String slug;

}
