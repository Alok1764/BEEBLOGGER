package com.example.BLOGAPI.Config;


import com.example.BLOGAPI.Security.JWT.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth-> auth
                        .requestMatchers("/auth/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/posts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/authors/**").permitAll()
//                       .requestMatchers(HttpMethod.GET, "/api/v1/comments/**").permitAll()
                        .requestMatchers("/authors/loggedIn-user").authenticated()
                                .requestMatchers("/posts/my-posts").authenticated()


                                .requestMatchers(HttpMethod.POST, "/posts/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/posts/**").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/posts/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/posts/**").authenticated()

                                .requestMatchers(HttpMethod.POST, "/authors/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/authors/**").authenticated()
                                .requestMatchers(HttpMethod.PATCH, "/authors/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/authors/**").authenticated()

                                .requestMatchers(HttpMethod.POST, "/comments/**").authenticated()
                                .requestMatchers(HttpMethod.PUT, "/comments/**").authenticated()
                                .requestMatchers(HttpMethod.DELETE, "/comments/**").authenticated()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return httpSecurity.build();
    }
}
