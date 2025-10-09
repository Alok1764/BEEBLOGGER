package com.example.BLOGAPI.Repositories;

import com.example.BLOGAPI.Entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    
   Page<Comment> findAllByPostIdAndIsApprovedTrueOrderByCreatedAtDesc(Long postId, Pageable pageable);

    Page<Comment> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Comment> findAllByIsApprovedFalse(Pageable pageable);
}