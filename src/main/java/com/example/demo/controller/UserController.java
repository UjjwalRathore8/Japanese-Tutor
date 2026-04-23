package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.User;
import com.example.demo.security.JwtUtil;

@RestController

@RequestMapping("/User/auth")
public class UserController {

	@Autowired
	private com.example.demo.service.UserService userservice;

	@Autowired
	PasswordEncoder passwordEncoder;

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody User user) {

		user.setPassword(passwordEncoder.encode(user.getPassword()));

		User savedUser = userservice.userAdd(user);

		return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody User loginUser) {

		if (loginUser.getEmail() == null || loginUser.getPassword() == null) {
			return ResponseEntity.badRequest().body("Email and password required");
		}

		User user = userservice.findByEmail(loginUser.getEmail());

		if (user == null) {
			return ResponseEntity.status(401).body("User not found");
		}

		if (!passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
			return ResponseEntity.status(401).body("Invalid password");
		}
		// ✅ REAL TOKEN
		String token = JwtUtil.generateToken(user.getEmail());

		LoginResponse response = new LoginResponse(token, user);

		return ResponseEntity.ok(response);
	}

	@GetMapping("get/{id}")
	public ResponseEntity<?> userById(@PathVariable int id) {
		User s = userservice.byId(id);
		return ResponseEntity.ok(s);
	}

	@GetMapping("/dashboard")
	public ResponseEntity<?> getAllUser() {
		List<User> u = userservice.allUser();
		return ResponseEntity.ok(u);
	}

}
