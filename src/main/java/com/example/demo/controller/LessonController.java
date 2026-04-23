package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

import com.example.demo.entity.Lesson;
import com.example.demo.service.LessonService;

@RestController
@RequestMapping("/lesson")
class LessonController 
{
	@Autowired
	private LessonService lessonservice ;

	@PostMapping("/add")
	public ResponseEntity<?> saveLesson(@RequestBody Lesson lesson)
	{
		Lesson l = lessonservice.addLesson(lesson);
		return ResponseEntity.status(201).body(l);	
	}
	
	@GetMapping("/all")
	public ResponseEntity<?> AllLesson()
	{
		List<Lesson> l = lessonservice.getAllLesson();
		return ResponseEntity.ok(l);	
	}
	

	@GetMapping("get/{id}")
	public ResponseEntity<?> getById(@PathVariable int id)
	{
		Lesson l = lessonservice.byId(id);
		return ResponseEntity.status(200).body(l);	
//	    }
		
	}
	
	@PutMapping("update/{id}")
	public ResponseEntity<?> updateById(@RequestBody Lesson lesson , @PathVariable int id)
	{
		Lesson lesson2 = lessonservice.modifyById(lesson ,id );
		return ResponseEntity.ok(lesson2);	
		}
//
	@DeleteMapping("delete/{id}")
	public ResponseEntity<?> deleteById(@PathVariable int id)
	{
	    lessonservice.removeById(id);
		return ResponseEntity.ok("Lesson Deleted Successfully");	
	}
	
	@GetMapping("lessons/progress")
    public ResponseEntity<Map<String, List<Integer>>> getProgress() {
        // For now, return empty array
        return ResponseEntity.ok(Map.of("completedLessons", new ArrayList<>()));
    }
	
}
