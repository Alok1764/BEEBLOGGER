package com.example.BLOGAPI.Security.Services;

import com.example.BLOGAPI.Repositories.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Service("@authorSecurityService")
@RequiredArgsConstructor
public class AuthorSecurityService {

    private final AuthorRepository authorRepository;

    public boolean isAuthorOwner(Long authorId){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();

        UserDetailsImpl userDetails= (UserDetailsImpl) authentication.getPrincipal();
        Long loggedInAuthorId=userDetails.getId();


        return  loggedInAuthorId.equals(authorId);
    }


}
