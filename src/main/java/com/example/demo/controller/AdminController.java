package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;

@RestController

@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private UserService userservice;

	@PostMapping("/add-trainer")
	public String addTrainer(@RequestBody User user) {

		user.setRole(Role.TRAINER);

		userservice.userAdd(user);

		return "Trainer added successfully";
	}
}
