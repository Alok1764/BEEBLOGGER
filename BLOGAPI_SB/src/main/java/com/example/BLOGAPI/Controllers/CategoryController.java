package com.example.BLOGAPI.Controllers;


import com.example.BLOGAPI.DTOs.request.CategoryCreatedDTO;
import com.example.BLOGAPI.DTOs.response.CategoryDTO;
import com.example.BLOGAPI.Services.ServicesImpl.CategoryServiceImpl;
import com.example.BLOGAPI.Services.ServicesImpl.PostServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final PostServiceImpl postService;
    private final CategoryServiceImpl categoryService;

    Logger logger= LoggerFactory.getLogger(CategoryController.class);

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories(@RequestParam(required = false,defaultValue = "0") int pageNo,
                                                              @RequestParam(required = false,defaultValue = "10") int pageSize) {
        logger.info("GET /api/categories");

        return ResponseEntity.ok(categoryService.getAllCategories(PageRequest.of(pageNo,pageSize)));
    }


    @GetMapping("/by-popularity")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByPopularity(@RequestParam(required = false,defaultValue = "0") int pageNo,
                                                                       @RequestParam(required = false,defaultValue = "10") int pageSize) {
        logger.info("GET /api/categories/by-popularity");

        return ResponseEntity.ok(categoryService.getCategoriesOrderedByPostCount(PageRequest.of(pageNo,pageSize)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        logger.info("GET /api/categories/ {}", id);

        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoryDTO> getCategoryBySlug(@PathVariable String slug) {
        logger.info("GET /api/categories/slug/{}", slug);

        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryCreatedDTO categoryCreatedDTO) {
        logger.info("POST /api/categories - name: {}", categoryCreatedDTO.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.createCategory(categoryCreatedDTO));
    }


    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryCreatedDTO categoryCreatedDTO) {

        logger.info("PUT /api/categories/{} - name: {}", id, categoryCreatedDTO.getName());

        return ResponseEntity.ok(categoryService.updateCategory(id, categoryCreatedDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable Long id) {
        logger.info("DELETE /api/categories/{}", id);

        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}
