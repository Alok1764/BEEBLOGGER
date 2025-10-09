package com.example.BLOGAPI.Controllers;


import com.example.BLOGAPI.DTOs.request.CommentCreatedDTO;
import com.example.BLOGAPI.DTOs.response.CommentDTO;
import com.example.BLOGAPI.Services.ServicesImpl.CommentServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {


    private final CommentServiceImpl commentService;

    Logger logger = LoggerFactory.getLogger(CommentController.class);

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getAllComments(
            @RequestParam(required = false, defaultValue = "0") int pageNo,
            @RequestParam(required = false, defaultValue = "10") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortedBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortOrder) {


        logger.info("GET /api/comments - page: {}, size: {}, sortBy: {}, direction: {}",
                pageNo, pageSize, sortedBy, sortOrder);

        Sort sort = null;
        if (sortOrder.equalsIgnoreCase("ASC")) sort = Sort.by(sortedBy).ascending();
        else sort = Sort.by(sortedBy).descending();
        return ResponseEntity.ok(commentService.getAllComments(PageRequest.of(pageNo, pageSize, sort)));
    }


    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPost(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(defaultValue = "true") boolean isApproved) {

        logger.info("GET /api/comments/post/{} - page: {}, size: {}, isApproved: {}",
                postId, pageNo, pageSize, isApproved);

        return ResponseEntity.ok(commentService.getCommentsByPost(postId, PageRequest.of(pageNo, pageSize), isApproved));
    }


    @GetMapping("/{id}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long id) {
        logger.info("GET /api/comments/ {}", id);

        return ResponseEntity.ok(commentService.getCommentById(id));
    }


    @GetMapping("/recent")
    public ResponseEntity<List<CommentDTO>> getRecentComments(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        logger.info("GET /api/comments/recent");

        return ResponseEntity.ok(commentService.getRecentComments(PageRequest.of(pageNo, pageSize)));

    }


    @GetMapping("/unapproved")
    public ResponseEntity<List<CommentDTO>> getUnapprovedComments(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        logger.info("GET /api/comments/unapproved");

        return ResponseEntity.ok(commentService.getUnapprovedComments(PageRequest.of(pageNo, pageSize)));
    }


    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CommentCreatedDTO commentCreatedDTO) {

        logger.info("POST /api/comments/post/{} ", postId);

        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.createComment(postId, commentCreatedDTO));
    }


    @PutMapping("/update/{id}")
    @PreAuthorize("@commentSecurityService.isCommentOwner(#id)")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentCreatedDTO commentCreatedDTO) {

        logger.info("PUT /api/comments/{}", id);

        return ResponseEntity.ok(commentService.updateComment(id, commentCreatedDTO));
    }

    @PatchMapping("/approve/{id}")
    @PreAuthorize("@commentSecurityService.isCommentOwner(#id)")
    public ResponseEntity<CommentDTO> approveComment(@PathVariable Long id) {
        logger.info("PATCH /api/comments/{}/approve", id);

        return ResponseEntity.ok( commentService.approveComment(id));
    }

    @PatchMapping("/reject/{id}")
    @PreAuthorize("@commentSecurityService.isCommentOwner(#id)")
    public ResponseEntity<CommentDTO> rejectComment(@PathVariable Long id) {
        logger.info("PATCH /api/comments/{}/reject", id);
        return ResponseEntity.ok(commentService.rejectComment(id));
    }


    @DeleteMapping("/delete/{id}")
    @PreAuthorize("@commentSecurityService.isCommentOwner(#id) or @commentSecurityService.isPostOwner(#id)")
    public ResponseEntity<CommentDTO> deleteComment(@PathVariable Long id) {
        logger.info("DELETE /api/comments/{}", id);
        commentService.deleteComment(id);
     return ResponseEntity.noContent().build();
    }
}
