package com.example.BLOGAPI.Services.ServicesInterfaces;

import com.example.BLOGAPI.DTOs.response.CategoryDTO;

import java.util.List;

public interface CategoryService {
    List<CategoryDTO> getAllCategories();
}
