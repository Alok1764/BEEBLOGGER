package com.example.BLOGAPI.Controllers;

import com.example.BLOGAPI.DTOs.response.AuthorDTO;
import com.example.BLOGAPI.Services.ServicesImpl.AuthorServiceImpl;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/authors")
@RequiredArgsConstructor
public class AuthorController {

 private final AuthorServiceImpl authorService;

 private static final Logger logger= LoggerFactory.getLogger(AuthorController.class);

 @GetMapping()
 ResponseEntity<List<AuthorDTO>> getAllAuthors(@RequestParam(required = false,defaultValue = "0") int pageNo,
                                           @RequestParam(required = false,defaultValue = "10") int pageSize,
                                           @RequestParam(required = false,defaultValue = "id") String sortedBy,
                                           @RequestParam(required = false,defaultValue = "ASC") String sortOrder){

      logger.info("GET api/authors");
     Sort sort=null;
     if(sortOrder.equalsIgnoreCase("ASC")) sort= Sort.by(sortedBy).ascending();
     else sort=Sort.by(sortedBy).descending();
     return ResponseEntity.ok(authorService.getAllAuthors(PageRequest.of(pageNo,pageSize,sort)));
 }
    @GetMapping("/popular")
    public ResponseEntity<List<AuthorDTO>> getPopularAuthors(){
     return ResponseEntity.ok(authorService.getPopularAuthors());
    }
    @GetMapping("/loggedIn-user")
    public ResponseEntity<AuthorDTO> getCurrentUser(Authentication authentication) {

        return ResponseEntity.ok(authorService.getLoggedInUser(authentication));
    }
 @GetMapping("/{id}")
 ResponseEntity<AuthorDTO> getAuthorById(@PathVariable Long id){
     logger.info("GET /api/authors/{}",id);
     return ResponseEntity.ok(authorService.getAuthorById(id));
 }

    @GetMapping("/search")
    ResponseEntity<List<AuthorDTO>> getAuthorByName(@RequestParam String userName){
        logger.info("GET /api/authors/search?username=keyword");

        return ResponseEntity.ok(authorService.getAuthorByUserName(userName));
    }


    @PatchMapping("/{id}/update_password")
    @PreAuthorize("@authorSecurityService.isAuthorOwner(#id)")
    void updateAuthorPass(@PathVariable Long id,@RequestParam String password ){
     logger.info("PATCH /api/authors/{}/password",id);
            authorService.updateAuthorPassword(id,password);
    }

    @PatchMapping("/{id}/update_email")
    @PreAuthorize("@authorSecurityService.isAuthorOwner(#id)")
    ResponseEntity<AuthorDTO> updateAuthorEmail(@PathVariable Long id,@RequestParam String email){
        logger.info("PATCH /api/authors/{}/email",id);
        return ResponseEntity.ok(authorService.updateAuthorEmail(id,email));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("@authorSecurityService.isAuthorOwner(#id)")
    ResponseEntity<AuthorDTO> deleteAuthor(@PathVariable Long id){
        logger.info("DELETE /api/authors/delete/{}",id);
     authorService.deleteAuthor(id);
     return ResponseEntity.noContent().build();
    }













}
