package com.example.BLOGAPI.Controllers;

import com.example.BLOGAPI.DTOs.request.PostCreatedDTO;
import com.example.BLOGAPI.DTOs.response.PostDTO;
import com.example.BLOGAPI.Entities.Author;
import com.example.BLOGAPI.Enums.PostStatus;
import com.example.BLOGAPI.Exceptions.ResourceNotFoundException;
import com.example.BLOGAPI.Repositories.AuthorRepository;
import com.example.BLOGAPI.Services.ServicesImpl.PostServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    Logger logger= LoggerFactory.getLogger(PostController.class);

    private  final PostServiceImpl postService;
    private final AuthorRepository authorRepository;

    //updated this and imporve the query time avoiding N+1 problem
    //map both all post and categories together

    @GetMapping
    public ResponseEntity<Page<PostDTO>> getPosts(
            @RequestParam(required = false) List<Long> categoryIds,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "12") int pageSize,
            @RequestParam(required = false, defaultValue = "id") String sortedBy,
            @RequestParam(required = false, defaultValue = "ASC") String sortOrder) {

        logger.info("GET /api/posts - categoryIds: {}, page: {}, size: {}, sortBy: {}, sortOrder: {}",
                categoryIds, pageNo, pageSize, sortedBy, sortOrder);

        Sort sort = sortOrder.equalsIgnoreCase("ASC") ? Sort.by(sortedBy).ascending() : Sort.by(sortedBy).descending();

        if (categoryIds != null && !categoryIds.isEmpty()) {
            return ResponseEntity.ok(postService.getPostsByCategory(categoryIds, PageRequest.of(pageNo, pageSize, sort)));
        }

        return ResponseEntity.ok(postService.getAllPosts(PageRequest.of(pageNo, pageSize, sort)));
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
            @RequestParam(defaultValue = "12") int pageSize) {

        logger.info("GET /api/posts/search - keyword: {}, page: {}, size: {}", keyword, pageNo, pageSize);

        return ResponseEntity.ok(postService.searchPosts(keyword,PageRequest.of(pageNo,pageSize)));
    }

    @GetMapping("/my-posts")
    public ResponseEntity<Page<PostDTO>> getPostsByLoggedInAuthor(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "12") int pageSize) {

        logger.info("GET /api/posts/my-posts/ - page: {}, size: {}", pageNo, pageSize);
        return ResponseEntity.ok(postService.getPostsByLoggedInAuthor(authentication,PageRequest.of(pageNo,pageSize)));
    }
    @GetMapping("/authors/{id}")
    public ResponseEntity<Page<PostDTO>> getPostsByAuthor(@PathVariable Long id,
                                                         @RequestParam(defaultValue = "0") int pageNo,
                                                         @RequestParam(defaultValue = "12") int pageSize){
        logger.info("GET /api/posts/authors/{id} - id :{},page: {}, size: {}",id,pageNo,pageSize);
        return ResponseEntity.ok(postService.getPostsByAuthor(id,PageRequest.of(pageNo,pageSize)));
    }


    @GetMapping("/recent")
    public ResponseEntity<List<PostDTO>> getRecentPosts(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "12") int pageSize
    ) {
        logger.info("GET /api/posts/recent");

        return ResponseEntity.ok(postService.getRecentPosts(PageRequest.of(pageNo,pageSize)));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<PostDTO>> getPopularPosts(
            @RequestParam(defaultValue = "0") int pageNo,
            @RequestParam(defaultValue = "12") int pageSize
    ) {
        logger.info("GET /api/posts/popular");

        return ResponseEntity.ok(postService.getPopularPosts(PageRequest.of(pageNo,pageSize)));
    }

    @PostMapping("/create")
    public ResponseEntity<PostDTO> createPost(@Valid @RequestBody PostCreatedDTO postCreatedDTO) {
        logger.info("POST /api/posts - title: {}", postCreatedDTO.getTitle());

        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(postCreatedDTO));
    }

    //just for testing
    @PostMapping("/{id}/upload-post-img")
    public ResponseEntity<Void> uploadPostImg(@PathVariable Long id, @RequestParam String url){
        postService.uploadPostImg(id,url);
        return ResponseEntity.noContent().build();
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
