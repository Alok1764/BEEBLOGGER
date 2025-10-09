package com.example.BLOGAPI.DTOs.response;

import com.example.BLOGAPI.Entities.Author;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class CommentDTO {
    private Long id;
    private Author author;
    private String content;
    private LocalDateTime createdAt;
    private boolean isUpdated;
}
