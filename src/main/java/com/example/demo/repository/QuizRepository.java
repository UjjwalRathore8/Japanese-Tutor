package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, Integer> {

	@Query("SELECT q FROM Quiz q JOIN FETCH q.questions WHERE q.id = :id")
	Quiz findQuizWithQuestions(@Param("id") int id);

	List<Quiz> findByLessonId(int lessonId);

}
