package com.example.BLOGAPI.Security.JWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtTokenProvider;
    @Autowired
    private  UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(){}



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        System.out.println("=== JWT Filter ===");
        System.out.println("Path: " + path);
        System.out.println("Method: " + request.getMethod());


        if (path.startsWith("/api/v1/auth/")
                || (request.getMethod().equals("GET") && path.startsWith("/api/v1/posts") && !path.startsWith("/api/v1/posts/my-posts"))
                || (request.getMethod().equals("GET") && path.startsWith("/api/v1/categories"))
                || (request.getMethod().equals("GET") && path.startsWith("/api/v1/authors") && !path.startsWith("/api/v1/authors/loggedIn-user"))) {
            System.out.println("Path get skips is :"+path);
            filterChain.doFilter(request, response);
            System.out.println("Skipping JWT validation for public endpoint");
            return;
        }

        try {
            String jwt = jwtTokenProvider.getJwtFromHeader(request);
            System.out.println("JWT Token: " + (jwt != null ? "Present" : "Null"));

            if (jwt != null && jwtTokenProvider.validateToken(jwt)) {
                String username = jwtTokenProvider.getUserNameFromJwtToken(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (Exception e) {
            System.err.println("Error in JWT Filter: " + e.getMessage());
            e.printStackTrace();
        }
        filterChain.doFilter(request, response);

    }
}
