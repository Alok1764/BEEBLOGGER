package com.example.BLOGAPI.Services.ServicesInterfaces;

import com.example.BLOGAPI.DTOs.response.AuthorDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuthorService {

    List<AuthorDTO> getAllAuthors(Pageable pageable);
    AuthorDTO getAuthorById(Long id);
     List<AuthorDTO> getAuthorByUserName(String keyword);
     void updateAuthorPassword(Long id, String password);
     AuthorDTO updateAuthorEmail(Long id, String email);
    void deleteAuthor(Long id);
}
