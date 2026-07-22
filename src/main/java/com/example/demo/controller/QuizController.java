package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.QuizDTO;
import com.example.demo.dto.QuizSubmitRequest;
import com.example.demo.entity.Quiz;
import com.example.demo.service.QuizService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/Quiz")
public class QuizController {

	@Autowired
	private QuizService quizservice;

	@PostMapping("/add")
	public ResponseEntity<?> saveQuize(@RequestBody Quiz quiz) {
		Quiz q = quizservice.addQuiz(quiz);
		return ResponseEntity.status(201).body(q);
	}

	@GetMapping("/all")
	public ResponseEntity<?> getAll() {
		List<Quiz> l = quizservice.allQuize();
		return ResponseEntity.status(200).body(l);
	}

	@GetMapping("/get/{id}")
	public ResponseEntity<?> getQuizById(@PathVariable int id) {

		QuizDTO q = quizservice.getQuizById(id);

		return ResponseEntity.ok(q);
	}

	@DeleteMapping("/delete-quiz/{id}")
	public ResponseEntity<?> deleteQuiz(@PathVariable int id) {
	    quizservice.removeRecord(id);
	    return ResponseEntity.ok("Quiz deleted successfully");
	}
	
	@PostMapping("/submit")
	public ResponseEntity<?> submitQuiz(@RequestBody QuizSubmitRequest request, HttpServletRequest httpRequest) {

	    String email = (String) httpRequest.getAttribute("email");

	    System.out.println("EMAIL FROM TOKEN: " + email);
	    System.out.println("QUIZ ID: " + request.getQuizId());
	    System.out.println("ANSWERS: " + request.getAnswers());

	    int score = quizservice.evaluateQuiz(request, email);

	    System.out.println("FINAL SCORE: " + score);

	    return ResponseEntity.ok("Your Score: " + score);
	}

	@GetMapping("/lesson/{lessonId}/quizzes")
	public ResponseEntity<?> getQuizzesByLesson(@PathVariable int lessonId) {

		List<Quiz> quizzes = quizservice.getQuizzesByLesson(lessonId);

		return ResponseEntity.ok(quizzes);
	}

}
