package com.example.BLOGAPI.Config;

import com.example.BLOGAPI.DTOs.response.PostDTO;
import com.example.BLOGAPI.Entities.Post;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class Appconfig {

//    @Bean
//    public ModelMapper modelMapper(){return new ModelMapper();}

        @Bean
        public ModelMapper modelMapper() {
            ModelMapper modelMapper = new ModelMapper();

            // Custom mapping for Post → PostDTO
            modelMapper.typeMap(Post.class, PostDTO.class).addMappings(mapper -> {
                mapper.map(Post::getAuthor, PostDTO::setAuthorDTO);
            });

            return modelMapper;
        }


    @Bean
    public PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

}
