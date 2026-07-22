package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Lesson;
import com.example.demo.entity.Quiz;
import com.example.demo.service.LessonService;
import com.example.demo.service.QuizService;

@RestController
@RequestMapping("/trainer")
public class TrainerController {

	@Autowired
    private LessonService lessonservice;
    @Autowired
    private QuizService quizservice;
    
	@PostMapping("/add-lesson")
	public ResponseEntity<?> saveLesson(@RequestBody Lesson lesson)
	{
		Lesson l = lessonservice.addLesson(lesson);
		return ResponseEntity.status(201).body(l);	
	}
	
	@PostMapping("/add-quiz")
	public ResponseEntity<?> saveQuize(@RequestBody Quiz quiz) {
		Quiz q = quizservice.addQuiz(quiz);
		return ResponseEntity.status(201).body(q);
	}
    
    @DeleteMapping("/delete-lesson/{id}")
    public String deleteLesson(@PathVariable int id) {
        lessonservice. removeById(id);
        return "Lesson deleted successfully";
    }
    
    @DeleteMapping("/delete-quiz/{id}")
    public String deleteQuiz(@PathVariable int id) {
        quizservice. removeRecord(id);
        return "Quiz deleted successfully";
    }
    
    
}
