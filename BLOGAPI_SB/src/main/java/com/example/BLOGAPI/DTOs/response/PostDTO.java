package com.example.BLOGAPI.DTOs.response;

import com.example.BLOGAPI.Entities.Author;
import com.example.BLOGAPI.Entities.Category;
import com.example.BLOGAPI.Enums.PostStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
    private Long id;
    private String title;
    private String image;
    private String slug;
    private PostStatus status;
    private AuthorDTO authorDTO;
    private String excerpt;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private Long viewCount;
    private String readingTime;
    private Set<Category> categories;
}
