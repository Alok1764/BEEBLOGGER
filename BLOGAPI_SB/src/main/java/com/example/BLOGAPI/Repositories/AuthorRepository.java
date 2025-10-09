package com.example.BLOGAPI.Repositories;

import com.example.BLOGAPI.Entities.Author;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    @Query("SELECT a FROM Author a WHERE a.userName LIKE CONCAT(:keyword, '%')")
    List<Optional<Author>> findByUserNameContainingIgnoreCase(@Param("keyword") String keyword);

    @Transactional
    @Modifying
    @Query("UPDATE Author a SET a.password=:password WHERE a.id=:id")
    void updatePassword(@Param("id")Long id,@Param("password") String password);

    @Transactional
    @Modifying
    @Query("UPDATE Author a SET a.email=:email WHERE a.id=:id")
    void updateAuthorEmail(@Param("id") Long id,@Param("email") String email);

    Optional<Author> findByUserName(String username);
}