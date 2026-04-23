package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.exception.InvalidCredentialsException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	UserRepository userrepository;
	@Autowired
	private PasswordEncoder passwordEncoder;

	public User userAdd(User user) {
		return userrepository.save(user);
	}

	public User loginUser(String email, String password) {

		User user = userrepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

		if (!passwordEncoder.matches(password, user.getPassword())) { // ✅ FIX
			throw new InvalidCredentialsException("Invalid password");
		}

		return user;
	}

	public User byId(int id) {
		User s = userrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
		return s;
	}

	public User findByEmail(String email) {
		User s = userrepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
		return s;

	}

	public List<User> allUser() {
		return userrepository.findAll();
	}

}
