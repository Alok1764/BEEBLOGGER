package com.example.BLOGAPI.Repositories;

import com.example.BLOGAPI.DTOs.response.CategoryDTO;
import com.example.BLOGAPI.Entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {


    @Query("""
    SELECT new com.example.BLOGAPI.DTOs.response.CategoryDTO(
        c.id, c.name, c.slug, COUNT(p)
    )
    FROM Category c
    LEFT JOIN c.posts p
    GROUP BY c.id, c.name, c.slug
    ORDER BY COUNT(p) DESC
    """)
    Page<CategoryDTO> findAllByOrderByPostCountDesc(Pageable pageable);


    CategoryDTO findBySlug(String slug);
}