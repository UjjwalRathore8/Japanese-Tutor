package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Lesson;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.LessonRepository;

@Service
public class LessonService {
	@Autowired
	private LessonRepository lessonrepository;

	public Lesson addLesson(Lesson lesson) {
		Lesson l = lessonrepository.save(lesson);
		return l;
	}

	public List<Lesson> getAllLesson() {
		List<Lesson> l = lessonrepository.findAll();
		return l;
	}

	public Lesson byId(int id) {
		Lesson l = lessonrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
		return l;
	}

	public void removeById(int id) {
		Lesson l2 = lessonrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
		lessonrepository.delete(l2);

	}

}
