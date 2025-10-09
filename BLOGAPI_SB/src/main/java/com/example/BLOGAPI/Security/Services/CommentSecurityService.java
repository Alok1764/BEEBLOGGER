package com.example.BLOGAPI.Security.Services;

import com.example.BLOGAPI.Entities.Comment;
import com.example.BLOGAPI.Exceptions.ResourceNotFoundException;
import com.example.BLOGAPI.Repositories.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service("@commentSecurityService")
@RequiredArgsConstructor
public class CommentSecurityService {

    private final CommentRepository commentRepository;

    public boolean isCommentOwner(Long id){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();

        UserDetailsImpl userDetails=(UserDetailsImpl) authentication.getPrincipal();

        Comment comment=commentRepository.findById(id).orElse(null);
        if(comment==null) return  false;

        Long loggedInAuthorId= userDetails.getId();

        return comment.getAuthor().getId().equals(loggedInAuthorId);
    }

    public boolean isPostOwner(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Long loggedInAuthorId = userDetails.getId();

        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment == null || comment.getPost() == null) {
            return false;
        }

        return comment.getPost().getAuthor().getId().equals(loggedInAuthorId);
    }
}
