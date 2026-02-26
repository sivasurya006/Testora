package com.testcreator.util;


import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.servlet.ServletContext;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;


public class JwtUtil {
	private final String secret;
	private final long expiryMillis;
	
	public JwtUtil(ServletContext context) {
		this.secret = (String) context.getAttribute("jwt.secret");
		this.expiryMillis = (Integer) context.getAttribute("jwt.expiryHours") * 60 * 60 * 1000;
	}
	
	public String generateToken(String subject) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expiryMillis);
		Key key = Keys.hmacShaKeyFor(secret.getBytes());
		return Jwts.builder()
				.setSubject(subject)
				.setIssuedAt(now)
				.setExpiration(expiry)
				.signWith(key,SignatureAlgorithm.HS256)
				.compact();
	}
	
	public Claims verifyToken(String token) {
	    try {
	        return Jwts.parserBuilder()
	                .setSigningKey(secret.getBytes(StandardCharsets.UTF_8))
	                .build()
	                .parseClaimsJws(token)
	                .getBody();   

	    } catch (JwtException | IllegalArgumentException e) {
	        return null;
	    }
	}
	

	
}
