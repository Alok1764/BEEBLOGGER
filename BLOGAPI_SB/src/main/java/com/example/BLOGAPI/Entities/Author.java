package com.example.BLOGAPI.Entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "authors")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Author{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100,unique = true)
    private String userName;


    @Column (nullable = false,length=100)
    private String password;

    @Column(unique = true, nullable = false, length = 150)
    private String email;

    private String role="ROLE_AUTHOR";

    @Column(length = 500)
    private String bio;

    @Column(length = 200)
    private String website;

    @CreationTimestamp
    @Column(nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime updatedAt;


    @ToString.Exclude
    @OneToMany(mappedBy = "author",fetch = FetchType.LAZY)
    private List<Comment> comments;

    @ToString.Exclude
    @OneToMany(mappedBy = "author",cascade = CascadeType.REMOVE,orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Post> posts=new ArrayList<>();

    @Builder
    public Author(String userName, String email, String password, String bio, String website) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.website = website;
        this.comments=new ArrayList<>();
        this.posts = new ArrayList<>();
    }


}
