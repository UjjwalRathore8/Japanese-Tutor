package com.example.demo.security;

import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtUtil {

	private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor("mysecretkeymysecretkeymysecretkey12".getBytes());

	public static String generateToken(String email) {

		return Jwts.builder().setSubject(email) // store email
				.setIssuedAt(new Date()) // current time
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60) // 1 hour
				).signWith(SECRET_KEY) // sign token
				.compact();
	}

	public static String extractEmail(String token) {

		Claims claims = Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token).getBody();

		return claims.getSubject(); // returns email
	}

	public static boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);

			return true; // token is valid

		} catch (Exception e) {
			return false; // token invalid / expired
		}
	}

}
