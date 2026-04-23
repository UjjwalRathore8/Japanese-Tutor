package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Result;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.ResultService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/Result")
public class ResultController {
	
	@Autowired
	private ResultService resultservice;
	
	@GetMapping("/all")
	public ResponseEntity<?> getAllResults() {
	    return ResponseEntity.ok(resultservice.getAllResults());
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> getById(@PathVariable int id) {
	    return ResponseEntity.ok(resultservice.getResultById(id));
	}
	
	@GetMapping("/user/{userId}")
	public ResponseEntity<?> getResultsByUser(@PathVariable Integer userId) {

	    List<Result> results = resultservice.getResultsByUser(userId);

	    return ResponseEntity.ok(results);
	}
	
	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> removeById(@PathVariable int id)
	{
		resultservice.deleteById(id);
			return ResponseEntity.ok("Result removed !!");
	}

	@GetMapping("/my")
	public ResponseEntity<?> getMyResults(HttpServletRequest request) {

	    String token = request.getHeader("Authorization").substring(7);
	    String email = JwtUtil.extractEmail(token);

	    return ResponseEntity.ok(resultservice.getResultsByEmail(email));
	}	
	
}
