package com.example.BLOGAPI.Services.ServicesImpl;

import com.example.BLOGAPI.DTOs.response.AuthorDTO;
import com.example.BLOGAPI.Entities.Author;
import com.example.BLOGAPI.Exceptions.ResourceNotFoundException;
import com.example.BLOGAPI.Repositories.AuthorRepository;
import com.example.BLOGAPI.Services.ServicesInterfaces.AuthorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthorServiceImpl implements AuthorService {

    private final AuthorRepository authorRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    public List<AuthorDTO> getAllAuthors(Pageable pageable) {
        return authorRepository.findAll(pageable)
                .getContent()
                .stream()
                .map(author -> modelMapper.map(author,AuthorDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public AuthorDTO getAuthorById(Long id) {
        Author author=authorRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Author not found with id: "+id));

        return modelMapper.map(author,AuthorDTO.class);
    }
    @Override
    public List<AuthorDTO> getAuthorByUserName(String keyword) {
        return authorRepository.findByUserNameContainingIgnoreCase(keyword)
                .stream()
                .map(authors -> modelMapper.map(authors,AuthorDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void updateAuthorPassword(Long id, String password) {
        String encodedPassword=passwordEncoder.encode(password);
        authorRepository.updatePassword(id,encodedPassword);
    }
    @Override
    public AuthorDTO updateAuthorEmail(Long id, String email) {
        authorRepository.updateAuthorEmail(id,email);
        Author author=authorRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Author not found with id: "+id));

        return modelMapper.map(author,AuthorDTO.class);
    }
    @Override
    public void deleteAuthor(Long id) {
        authorRepository.deleteById(id);
    }

    public boolean authorExitsByEmail(String email) {
         return authorRepository.existsByEmail(email);
    }

    public AuthorDTO getLoggedInUser(Authentication authentication) {
        String userName = authentication.getName();

        Author author = authorRepository.findByUserName(userName)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found: "+userName));
        return modelMapper.map(author,AuthorDTO.class);

    }
}
