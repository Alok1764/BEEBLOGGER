package com.example.BLOGAPI.Security.Services;

import com.example.BLOGAPI.Entities.Author;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Data
@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private static final long SERIAL_VERSION_UID=1L;

    private Long id;
    private String userName;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public  static UserDetailsImpl build(Author author){
       GrantedAuthority authority=new SimpleGrantedAuthority(author.getRole());
             return new UserDetailsImpl(
                     author.getId(),
                     author.getUserName(),
                     author.getEmail(),
                     author.getPassword(),
                     Collections.singletonList(authority)
                              );
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return userName;
    }
}
