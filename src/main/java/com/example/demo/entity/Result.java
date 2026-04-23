package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Result {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	private int score;

	@ManyToOne
	@JsonBackReference(value = "user-result")
	private User user;

	@ManyToOne
	private Quiz quiz;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Quiz getQuiz() {
		return quiz;
	}

	public void setQuiz(Quiz quiz) {
		this.quiz = quiz;
	}

	public Result(Integer id, int score, User user, Quiz quiz) {
		super();
		this.id = id;
		this.score = score;
		this.user = user;
		this.quiz = quiz;
	}

	public Result() {
		super();
		// TODO Auto-generated constructor stub
	}

	@Override
	public String toString() {
		return "Result [id=" + id + ", score=" + score + ", user=" + user + ", quiz=" + quiz + "]";
	}

}