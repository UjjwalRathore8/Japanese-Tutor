package com.example.demo.dto;

import java.util.List;

import com.example.demo.entity.Question;

public class QuizDTO {

	private Integer id;
	private String title;
	private String description;
	private int totalQuestions;
	private List<Question> questions;
	public QuizDTO() {
	}

	public QuizDTO(Integer id, String title, String description, int totalQuestions) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.totalQuestions = totalQuestions;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getTotalQuestions() {
		return totalQuestions;
	}

	public void setTotalQuestions(int totalQuestions) {
		this.totalQuestions = totalQuestions;
	}

	public List<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(List<Question> questions) {
		this.questions = questions;
	}
	
	
	
}
