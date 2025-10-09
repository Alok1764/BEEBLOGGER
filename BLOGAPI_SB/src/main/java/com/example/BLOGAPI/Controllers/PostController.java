package com.example.BLOGAPI.Controllers;

import com.example.BLOGAPI.DTOs.request.PostCreatedDTO;
import com.example.BLOGAPI.DTOs.response.PostDTO;
import com.example.BLOGAPI.Enums.PostStatus;
import com.example.BLOGAPI.Services.ServicesImpl.PostServiceImpl;
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
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    Logger logger= LoggerFactory.getLogger(PostController.class);

    private  final PostServiceImpl postService;

    @GetMapping
 ResponseEntity<List<PostDTO>> getAllPosts(@RequestParam(required = false,defaultValue = "0") int pageNo,
                                           @RequestParam(required = false,defaultValue = "10") int pageSize,
                                           @RequestParam(required = false,defaultValue = "id") String sortedBy,
                                           @RequestParam(required = false,defaultValue = "ASC") String sortOrder){

     logger.info("GET /api/posts");
     Sort sort=null;
     if(sortOrder.equalsIgnoreCase("ASC")) sort= Sort.by(sortedBy).ascending();
     else sort=Sort.by(sortedBy).descending();
     return ResponseEntity.ok(postService.getAllPosts(PageRequest.of(pageNo,pageSize,sort)));
 }

    @GetMapping("/{id}")
    ResponseEntity<PostDTO> getPostById(@PathVariable Long id){
        logger.info("GET /api/posts/ {}",id);
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<PostDTO> getPostBySlug(@PathVariable String slug) {
        logger.info("GET /api/posts/slug/ {}",slug);

        return ResponseEntity.ok(postService.getPostBySlug(slug));
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostDTO>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        logger.info("GET /api/posts/search - keyword: {}, page: {}, size: {}", keyword, pageNo, pageSize);

        return ResponseEntity.ok(postService.searchPosts(keyword,PageRequest.of(pageNo,pageSize)));
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<PostDTO>> getPostsByAuthor(
            @PathVariable Long authorId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        logger.info("GET /api/posts/author/{} - page: {}, size: {}", authorId, pageNo, pageSize);
        return ResponseEntity.ok(postService.getPostsByAuthor(authorId,PageRequest.of(pageNo,pageSize)));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<PostDTO>> getPostsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {

        logger.info("GET /api/posts/category/{} - page: {}, size: {}", categoryId, pageNo,pageSize);

        return ResponseEntity.ok(postService.getPostsByCategory(categoryId,PageRequest.of(pageNo,pageSize)));
    }


    @GetMapping("/recent")
    public ResponseEntity<List<PostDTO>> getRecentPosts(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        logger.info("GET /api/posts/recent");

        return ResponseEntity.ok(postService.getRecentPosts(PageRequest.of(pageNo,pageSize)));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<PostDTO>> getPopularPosts(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize
    ) {
        logger.info("GET /api/posts/popular");

        return ResponseEntity.ok(postService.getPopularPosts(PageRequest.of(pageNo,pageSize)));
    }

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@Valid @RequestBody PostCreatedDTO postCreatedDTO) {
        logger.info("POST /api/posts - title: {}", postCreatedDTO.getTitle());

        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(postCreatedDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@postSecurityService.isPostOwner(#id)")
    public ResponseEntity<PostDTO>  updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostCreatedDTO postCreatedDTO) {

        logger.info("PUT /api/posts/{} - title: {}", id, postCreatedDTO.getTitle());

        return ResponseEntity.ok(postService.updatePost(id, postCreatedDTO));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("@postSecurityService.isPostOwner(#id)")
    public ResponseEntity<PostDTO> publishPost(@PathVariable Long id) {
        logger.info("PATCH /api/posts/{}/publish", id);

        return ResponseEntity.ok(postService.publishPost(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("@postSecurityService.isPostOwner(#id)")
    public ResponseEntity<PostDTO> changePostStatus(
            @PathVariable Long id,
            @RequestParam PostStatus status) {

        logger.info("PATCH /api/posts/{}/status - new status: {}", id, status);

        return ResponseEntity.ok(postService.changePostStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("@postSecurityService.isPostOwner(#id)")
    public ResponseEntity<PostDTO> deletePost(@PathVariable Long id) {
        logger.info("DELETE /api/posts/{}", id);

        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

}
