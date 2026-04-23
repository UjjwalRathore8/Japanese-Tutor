package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Question;
import com.example.demo.service.QuestionService;

@RestController
@RequestMapping("/Question")
public class QuestionController {
	@Autowired
	private QuestionService questionservice;

	@PostMapping("/add")
	public ResponseEntity<?> saveQuestion(@RequestBody Question question) {
		Question q = questionservice.addQuestion(question);
		return ResponseEntity.status(201).body(q);
	}

	@GetMapping("/all")
	public ResponseEntity<?> getAllQuestion() {
		List<Question> q = questionservice.allQuestion();
		return ResponseEntity.ok(q);
	}

	@GetMapping("/getby/{id}")
	public ResponseEntity<?> getById(@PathVariable int id) {
		Question q = questionservice.byQuestionId(id);
		return ResponseEntity.ok(q);
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteById(@PathVariable int id) {
		questionservice.removeById(id);
		return ResponseEntity.ok("Deleted Successfully");
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<?> updateById(@RequestBody Question question, @PathVariable int id) {
		Question q = questionservice.updateById(question, id);
		return ResponseEntity.ok(q);
	}

}
