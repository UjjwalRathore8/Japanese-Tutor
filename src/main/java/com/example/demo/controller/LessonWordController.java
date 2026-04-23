package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.LessonWord;
import com.example.demo.service.LessonWordService;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/lessonwords")
public class LessonWordController {
	
	@Autowired
	private LessonWordService lessonWordService;

	// ✅ ADD NEW WORD (MAIN API)
    @PostMapping("/add")
    public LessonWord addWord(@RequestBody LessonWord word) {
        return lessonWordService.saveWord(word);
    }
	
    @GetMapping("/{lessonId}")
    public List<LessonWord> getWords(@PathVariable int lessonId) {
        return lessonWordService.getWordsByLessonId(lessonId);
    }	
	
}
