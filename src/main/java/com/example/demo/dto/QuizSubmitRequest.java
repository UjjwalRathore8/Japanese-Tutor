package com.example.demo.dto;

import java.util.List;

public class QuizSubmitRequest {

	private Integer quizId;

	private List<AnswerRequest> answers;

	public Integer getQuizId() {
		return quizId;
	}

	public void setQuizId(Integer quizId) {
		this.quizId = quizId;
	}

	public List<AnswerRequest> getAnswers() {
		return answers;
	}

	public void setAnswers(List<AnswerRequest> answers) {
		this.answers = answers;
	}

}
