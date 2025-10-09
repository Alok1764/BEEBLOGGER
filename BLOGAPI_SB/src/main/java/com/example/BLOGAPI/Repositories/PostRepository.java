package com.example.BLOGAPI.Repositories;

import com.example.BLOGAPI.Entities.Post;
import com.example.BLOGAPI.Enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    Optional<Post> findBySlug(String slug);


    // Its very very costly

    @Query("SELECT p FROM Post p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
            "LOWER(p.content) LIKE LOWER(CONCAT('%',:keyword,'%'))")
    Page<Post> searchPosts(@Param("keyword") String keyword, Pageable pageable);


    Page<Post> findByAuthorId(Long authorId, Pageable pageable);

    @Query("SELECT p FROM Post p JOIN p.categories c WHERE c.id = :categoryId")
    Page<Post> findByCategoryId(@Param("categoryId") Long categoryId, Pageable pageable);



//    Page<Post> findByAuthorIdAndCategoryIdAndStatus(Long authorId, Long categoryId,
//                                                    PostStatus status, Pageable pageable);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);


//    List<Post> findTop10ByStatusOrderByViewCountDesc(PostStatus status);

    Page<Post> findAllByOrderByViewCountDesc(Pageable pageable);



    @Query("SELECT p FROM Post p WHERE p.status = 'PUBLISHED' AND " +
            "p.publishedAt BETWEEN :startDate AND :endDate ORDER BY p.publishedAt DESC")
    List<Post> findPostsPublishedBetween(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    long countByStatus(PostStatus status);

    long countByAuthorId(Long authorId);

    @Query("SELECT COUNT(p) FROM Post p JOIN p.categories c WHERE c.id = :categoryId")
    long countByCategoryId(Long categoryId);

    boolean existsBySlug(String slug);


}