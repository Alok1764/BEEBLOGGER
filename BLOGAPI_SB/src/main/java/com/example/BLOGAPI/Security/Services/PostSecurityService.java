package com.example.BLOGAPI.Security.Services;

import com.example.BLOGAPI.Entities.Post;
import com.example.BLOGAPI.Repositories.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("@postSecurityService")
@RequiredArgsConstructor
public class PostSecurityService {

    private final PostRepository postRepository;

    public boolean isPostOwner(Long id){

        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails=(UserDetailsImpl) authentication.getPrincipal();
        Long loggedInAuthorId= userDetails.getId();

        Post post=postRepository.findById(id).orElse(null);
        if(post==null) return false;

        return post.getAuthor().getId().equals(loggedInAuthorId);
    }
}
