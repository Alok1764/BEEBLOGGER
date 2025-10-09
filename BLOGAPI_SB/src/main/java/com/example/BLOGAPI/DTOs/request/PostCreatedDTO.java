package com.example.BLOGAPI.DTOs.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class PostCreatedDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    String title;

    @Size(max = 500, message = "Excerpt must not exceed 500 characters")
    String excerpt;

    @NotBlank(message = "Content is required")
    String content;

    @NotNull(message = "Author ID is required")
    Long authorId;

    @NotEmpty(message = "At least one category ID is required")
    Set<Long> categoryIds;

}
