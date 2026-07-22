package com.example.demo.security;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtFilter extends OncePerRequestFilter {

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// ✅ STEP 1: Allow public endpoints (login/register)
		String path = request.getRequestURI();
		if (path.startsWith("/User/auth") || path.equals("/login.html") || path.equals("/register.html")
				|| path.equals("/")

				/*|| path.startsWith("/Quiz/all") || path.startsWith("/Quiz/get") || path.startsWith("/lesson/all")
				|| path.startsWith("/lesson/") || path.startsWith("/Result/user")*/ || path.startsWith("/css/")
				|| path.startsWith("/js/") || path.startsWith("/images/") || path.endsWith(".html")
				|| path.endsWith(".css") || path.endsWith(".js") || path.endsWith(".ico")
				//|| path.startsWith("/lessonwords")
				)

		{
			filterChain.doFilter(request, response);
			return;
		}

		String header = request.getHeader("Authorization");

		if (header == null || !header.startsWith("Bearer ")) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write("Missing Token");
			return;

		}
		String token = header.substring(7);

		if (!JwtUtil.validateToken(token)) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().write("Invalid Token");
			return;
		}
		// OPTIONAL: extract email if needed
		String email = JwtUtil.extractEmail(token);
		String role = JwtUtil.extractRole(token);
		request.setAttribute("email", email);
		request.setAttribute("role", role);

		// Admin protection
		if (path.startsWith("/admin") && !role.equals("ADMIN")) {
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			response.getWriter().write("Access Denied: Admin only");
			return;
		}

		// Trainer protection
		if (path.startsWith("/trainer") && !(role.equals("TRAINER") || role.equals("ADMIN"))) {
			response.setStatus(HttpServletResponse.SC_FORBIDDEN);
			response.getWriter().write("Access Denied: Trainer only");
			return;
		}

		filterChain.doFilter(request, response);

	}

}
