package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.LessonWord;

@Repository
public interface LessonWordRepository extends JpaRepository<LessonWord, Integer> {
	List<LessonWord> findByLessonId(int lessonId);

}
