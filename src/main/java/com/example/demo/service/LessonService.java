package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Lesson;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.LessonRepository;

@Service
public class LessonService {
	private List<Lesson> list = new ArrayList<>();
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

	public Lesson modifyById(Lesson lesson, int id) {

		Lesson l1 = lessonrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
		l1.setTitle(lesson.getTitle());
		l1.setType(lesson.getType());
		l1.setContent(lesson.getContent());
		return lessonrepository.save(l1);
	}

	public void removeById(int id) {
		Lesson l2 = lessonrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
		lessonrepository.delete(l2);

	}

}
