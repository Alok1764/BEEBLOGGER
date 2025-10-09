package com.example.BLOGAPI.DTOs.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
    private Long id;
    private String title;
    private String slug;
    private String excerpt;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private Integer viewCount;
}
