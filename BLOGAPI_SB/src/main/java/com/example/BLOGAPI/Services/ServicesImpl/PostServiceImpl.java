package com.example.BLOGAPI.Services.ServicesImpl;

import com.example.BLOGAPI.DTOs.request.PostCreatedDTO;
import com.example.BLOGAPI.DTOs.response.PostDTO;
import com.example.BLOGAPI.Entities.Author;
import com.example.BLOGAPI.Entities.Category;
import com.example.BLOGAPI.Entities.Post;
import com.example.BLOGAPI.Enums.PostStatus;
import com.example.BLOGAPI.Exceptions.ResourceNotFoundException;
import com.example.BLOGAPI.Repositories.AuthorRepository;
import com.example.BLOGAPI.Repositories.CategoryRepository;
import com.example.BLOGAPI.Repositories.PostRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl {

    private final PostRepository postRepository;
    private final ModelMapper modelMapper;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;

//    public List<PostDTO> getAllPosts(Pageable pageable) {
//        return postRepository.findAll(pageable).getContent()
//                .stream()
//                .map(post->modelMapper.map(post,PostDTO.class))
//                .collect(Collectors.toList());
//
//    }

  public Page<PostDTO> getAllPosts(Pageable pageable) {
    Page<Post> postsPage = postRepository.findAll(pageable);

    return postsPage.map(post -> modelMapper.map(post, PostDTO.class));
  }

    public Page<PostDTO> getPostsByLoggedInAuthor(Authentication authentication, Pageable pageable) {
        String username = authentication.getName();
        Author author = authorRepository.findByUserName(username)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));

        Page<Post> postsPage = postRepository.findByAuthorId(author.getId(),pageable);
        return postsPage.map(post-> modelMapper.map(post,PostDTO.class));
    }
    public Page<PostDTO> getPostsByAuthor(Long id,Pageable pageable) {
      Page<Post> postPage =postRepository.findByAuthorId(id,pageable);
      return postPage.map(post -> modelMapper.map(post,PostDTO.class));

    }

    // here instead to update the whole table and its updating every time on called so I have used update query
    //and since using transactional it will save its own
    @Transactional
    public PostDTO getPostById(Long id) {
        Post post= postRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Post not found with id: "+id));

        postRepository.IncrementPostViewCount(id);
        authorRepository.IncrementAuthorTotalViews(post.getAuthor().getId());
        return modelMapper.map(post,PostDTO.class);
    }


    public PostDTO getPostBySlug(String slug) {
        Post post= postRepository.findBySlug(slug)
                .orElseThrow(()-> new ResourceNotFoundException("Post not found with slug: "+slug));

        return modelMapper.map(post,PostDTO.class);
    }


    public List<PostDTO> searchPosts(String keyword,Pageable pageable){
        return postRepository.searchPosts(keyword,pageable).getContent()
                .stream()
                .map(posts ->modelMapper.map(posts,PostDTO.class))
                .collect(Collectors.toList());
    }


//    public List<PostDTO> getPostsByCategory(List<Long> categoryIds,Pageable pageable){
//        return postRepository.findByCategoryIds(categoryIds,pageable).getContent()
//                .stream()
//                .map(posts ->modelMapper.map(posts,PostDTO.class))
//                .collect(Collectors.toList());
//    }

public Page<PostDTO> getPostsByCategory(List<Long> categoryIds, Pageable pageable) {
    Page<Post> postsPage = postRepository.findByCategoryIds(categoryIds, pageable);

    return postsPage.map(post -> modelMapper.map(post, PostDTO.class));
}



    public List<PostDTO> getRecentPosts(Pageable pageable){
        return postRepository.findAllByOrderByCreatedAtDesc(pageable).getContent()
                .stream()
                .map(posts ->modelMapper.map(posts,PostDTO.class))
                .collect(Collectors.toList());
    }

    public List<PostDTO> getPopularPosts(Pageable pageable) {
        return postRepository.findAllByOrderByViewCountDesc(pageable).getContent()
                .stream()
                .map(posts ->modelMapper.map(posts,PostDTO.class))
                .collect(Collectors.toList());
    }
    @Transactional
    public PostDTO createPost(PostCreatedDTO postCreatedDTO){
        Author author=authorRepository.findById(postCreatedDTO.getAuthorId())
                .orElseThrow(()->new ResourceNotFoundException("Author not found with id: "+postCreatedDTO.getAuthorId()));
        authorRepository.IncrementAuthorTotalBlogs(author.getId());
        Set<Category> categories= new HashSet<>(categoryRepository.findAllById(postCreatedDTO.getCategoryIds()));

        Post post= Post.builder()
                .title(postCreatedDTO.getTitle())
                .excerpt(postCreatedDTO.getExcerpt())
                .content(postCreatedDTO.getContent())
                .author(author)
                .categories(categories)
                .build();


        return modelMapper.map(post,PostDTO.class);
    }

    public PostDTO updatePost(Long id,PostCreatedDTO postCreatedDTO) {
            Post post=postRepository.findById(id)
                    .orElseThrow(()->new ResourceNotFoundException("Post not found with id: "+id));
        Set<Category> categories= new HashSet<>(categoryRepository.findAllById(postCreatedDTO.getCategoryIds()));

         Post updatedpost= Post.builder()
                .title(postCreatedDTO.getTitle())
                .excerpt(postCreatedDTO.getExcerpt())
                .content(postCreatedDTO.getContent())
                .categories(categories)
                .build();
        Post savedPost =postRepository.save(updatedpost);
        return modelMapper.map(savedPost,PostDTO.class);

    }


    public PostDTO publishPost(Long id) {
        Post post=postRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Post not found with id: "+id));

        if (post.getStatus() == PostStatus.PUBLISHED) {
            throw new RuntimeException("Post is already published");
        }
        post.setStatus(PostStatus.PUBLISHED);
        post.setPublishedAt(LocalDateTime.now());

        Post publishedPost = postRepository.save(post);
        return modelMapper.map(publishedPost,PostDTO.class);
    }

    public PostDTO changePostStatus(Long id, PostStatus status) {
        Post post=postRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("Post not found with id: "+id));

        post.setStatus(status);
        Post updatePost=postRepository.save(post);
        return modelMapper.map(updatePost,PostDTO.class);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public void uploadPostImg(Long id, String url) {
        Post post=postRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("No such Post find by id: "+id));
        post.setImage(url);
        postRepository.save(post);
    }


}
