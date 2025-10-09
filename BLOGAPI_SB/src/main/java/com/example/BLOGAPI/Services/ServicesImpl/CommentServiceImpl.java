package com.example.BLOGAPI.Services.ServicesImpl;

import com.example.BLOGAPI.DTOs.request.CommentCreatedDTO;
import com.example.BLOGAPI.DTOs.response.CommentDTO;
import com.example.BLOGAPI.Entities.Author;
import com.example.BLOGAPI.Entities.Comment;
import com.example.BLOGAPI.Entities.Post;
import com.example.BLOGAPI.Exceptions.ResourceNotFoundException;
import com.example.BLOGAPI.Repositories.CommentRepository;
import com.example.BLOGAPI.Repositories.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl {

    private final CommentRepository commentRepository;
    private final ModelMapper modelMapper;
    private final PostRepository postRepository;


    public List<CommentDTO> getAllComments(Pageable pageable){
        return commentRepository.findAll(pageable).getContent()
                .stream()
                .map(comment -> modelMapper.map(comment,CommentDTO.class))
                .collect(Collectors.toList());
    }

    public List<CommentDTO> getCommentsByPost(Long postId, Pageable pageable, boolean isApproved) {
        Post post=postRepository.findById(postId)
                .orElseThrow(()->new ResourceNotFoundException("Post not found with id: "+postId));


        return commentRepository.findAllByPostIdAndIsApprovedTrueOrderByCreatedAtDesc(postId,pageable).getContent()
                .stream()
                .map(comment -> modelMapper.map(comment,CommentDTO.class))
                .collect(Collectors.toList());

    }

    public CommentDTO getCommentById(Long id) {
        Comment comment=commentRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Comment not found with id: "+id));
        return modelMapper.map(comment,CommentDTO.class);
    }


    public List<CommentDTO> getRecentComments(Pageable pageable) {
        return commentRepository.findAllByOrderByCreatedAtDesc(pageable).getContent()
                .stream()
                .map(comment -> modelMapper.map(comment,CommentDTO.class))
                .collect(Collectors.toList());
    }

    public List<CommentDTO> getUnapprovedComments(Pageable pageable) {
        return commentRepository.findAllByIsApprovedFalse(pageable).getContent()
                .stream()
                .map(comment -> modelMapper.map(comment,CommentDTO.class))
                .collect(Collectors.toList());
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    public CommentDTO createComment(Long postId, CommentCreatedDTO commentCreatedDTO) {

        Post post=postRepository.findById(postId)
                .orElseThrow(()-> new ResourceNotFoundException("Post not found with id: "+postId)) ;

        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        Author author= (Author) authentication.getPrincipal();
        Comment newComment=Comment.builder()
                .content(commentCreatedDTO.getComment())
                .author(author)
                .post(post)
                .build();

        return modelMapper.map(newComment,CommentDTO.class);
    }

    @Transactional
    public CommentDTO updateComment(Long id,CommentCreatedDTO commentCreatedDTO) {
        Comment comment=commentRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Comment not found with id: "+id));

        comment.setContent(commentCreatedDTO.getComment());
        comment.setUpdated(true);
        return modelMapper.map(comment,CommentDTO.class);
    }

    @Transactional
    public CommentDTO approveComment(Long id) {
        Comment comment=commentRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Comment not found with id: "+id));
        if(!comment.getIsApproved()) {
            comment.setIsApproved(true);
        }
        return modelMapper.map(comment,CommentDTO.class);
    }

    @Transactional
    public CommentDTO rejectComment(Long id) {
        Comment comment=commentRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Comment not found with id: "+id));
        comment.setIsApproved(false);
        return modelMapper.map(comment,CommentDTO.class);
    }
}
