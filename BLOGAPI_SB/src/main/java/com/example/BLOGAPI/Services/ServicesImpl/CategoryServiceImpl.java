package com.example.BLOGAPI.Services.ServicesImpl;

import com.example.BLOGAPI.DTOs.request.CategoryCreatedDTO;
import com.example.BLOGAPI.DTOs.response.CategoryDTO;
import com.example.BLOGAPI.Entities.Category;
import com.example.BLOGAPI.Exceptions.ResourceNotFoundException;
import com.example.BLOGAPI.Repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    public List<CategoryDTO> getAllCategories(Pageable pageable){
        return categoryRepository.findAll(pageable)
                .stream()
                .map(category -> modelMapper.map(category,CategoryDTO.class))
                .collect(Collectors.toList());
    }


    public List<CategoryDTO> getCategoriesOrderedByPostCount(Pageable pageable) {
        return categoryRepository.findAllByOrderByPostCountDesc(pageable).getContent();

    }

    public CategoryDTO getCategoryById(Long id) {
        Category category=categoryRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Category not found with id: "+id));
        return modelMapper.map(category,CategoryDTO.class);
    }

    public CategoryDTO getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    public CategoryDTO createCategory(CategoryCreatedDTO categoryCreatedDTO) {
        Category category=Category.builder()
                .name(categoryCreatedDTO.getName())
                .slug(categoryCreatedDTO.getSlug())
                .build();

        Category newCategory=categoryRepository.save(category);
        return modelMapper.map(newCategory,CategoryDTO.class);
    }

    public CategoryDTO updateCategory(Long id,CategoryCreatedDTO categoryCreatedDTO) {
        Category category=categoryRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Category not found for updation  with id: "+id));

           Category updatedCategory=Category.builder()
                .name(categoryCreatedDTO.getName())
                .slug(categoryCreatedDTO.getSlug())
                .build();

        Category newCategory=categoryRepository.save(updatedCategory);
        return modelMapper.map(newCategory,CategoryDTO.class);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

}
