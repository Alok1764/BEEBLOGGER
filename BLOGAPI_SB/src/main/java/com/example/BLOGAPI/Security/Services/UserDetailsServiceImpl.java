package com.example.BLOGAPI.Security.Services;

import com.example.BLOGAPI.Entities.Author;
import com.example.BLOGAPI.Repositories.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private  final  AuthorRepository authorRepository;
    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Author author=authorRepository.findByUserName(userName)
                .orElseThrow(()->new UsernameNotFoundException("Author not found with username: "+userName));

        return UserDetailsImpl.build(author);
    }
}
