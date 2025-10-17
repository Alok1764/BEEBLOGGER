package com.example.BLOGAPI.Entities;

import com.example.BLOGAPI.Enums.PostStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="posts")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    private String image;

    @Column(length = 500)
    private String excerpt;

    @Column(unique = true, length = 250)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostStatus status=PostStatus.DRAFT;

    @CreationTimestamp
    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;

    @Column
    private LocalDateTime publishedAt;

    @Column(columnDefinition = "int default 0")
    private Integer viewCount = 0;

    private String readingTime;

    @ManyToOne
    @JoinColumn(name = "author_id",nullable = false)
    @JsonManagedReference
    private Author author;

    @ToString.Exclude
    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Comment> comments=new ArrayList<>();


    @ManyToMany(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
    @JoinTable(
            name="post_cat",
            joinColumns = @JoinColumn(name="post_id"),
            inverseJoinColumns = @JoinColumn(name="cat_id")
    )
    @JsonManagedReference
    private Set<Category> categories=new HashSet<>();

    @Builder
    public Post(String title,String image, String excerpt, String content,
                PostStatus status, Author author,String readingTime, Set<Category> categories) {
        this.title = title;
        this.image=image;
        this.excerpt = excerpt;
        this.content = content;
        this.status = (status != null) ? status : PostStatus.DRAFT;
        this.author = author;
        this.viewCount = 0;
        this.readingTime=readingTime;
        this.comments = new ArrayList<>();
        this.categories = (categories != null) ? categories : new HashSet<>();
    }
    public void incrementViewCount() {
        this.viewCount++;
    }




}
