package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.LessonWord;
import com.example.demo.repository.LessonWordRepository;

@Service
public class LessonWordService {

	@Autowired
	private LessonWordRepository lessonWordRepository;

	// SAVE WORD (IMPORTANT PART)
	public LessonWord saveWord(LessonWord word) {
		return lessonWordRepository.save(word);
	}

	public List<LessonWord> getWordsByLessonId(int lessonId) {
		return lessonWordRepository.findByLessonId(lessonId);
	}

}
