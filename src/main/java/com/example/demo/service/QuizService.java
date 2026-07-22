package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.AnswerRequest;
import com.example.demo.dto.QuizDTO;
import com.example.demo.dto.QuizSubmitRequest;
import com.example.demo.entity.Question;
import com.example.demo.entity.Quiz;
import com.example.demo.entity.Result;
import com.example.demo.entity.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.QuizRepository;
import com.example.demo.repository.ResultRepository;
import com.example.demo.repository.UserRepository;

@Service
public class QuizService {

	@Autowired
	private QuizRepository quizrepository;
	
	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ResultRepository resultRepository;

	public Quiz addQuiz(Quiz quiz) {
		return quizrepository.save(quiz);
	}

	public List<Quiz> allQuize() {
		return quizrepository.findAll();
	}

	@Transactional
	public void removeRecord(int id) {
		Quiz q = quizrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

		resultRepository.deleteByQuizId(id);

		quizrepository.delete(q);
	}

	public QuizDTO getQuizById(int id) {

		Quiz quiz = quizrepository.findQuizWithQuestions(id);
		// CONVERT ENTITY → DTO
		if (quiz == null) {
			throw new ResourceNotFoundException("Quiz not found");
		}
		QuizDTO dto = new QuizDTO();

		dto.setId(quiz.getId());
		dto.setTitle(quiz.getTitle());
		dto.setDescription(quiz.getDescription());
		dto.setQuestions(quiz.getQuestions());
		dto.setTotalQuestions(quiz.getQuestions() != null ? quiz.getQuestions().size() : 0);
		return dto;
	}

	public List<Quiz> getQuizzesByLesson(int lessonId) {
		return quizrepository.findByLessonId(lessonId);
	}


	public int calculateScore(Quiz quiz, List<AnswerRequest> answers) {

		int score = 0;

		for (AnswerRequest ans : answers) {

			for (Question q : quiz.getQuestions()) {

				if (q.getId().equals(ans.getQuestionId())) {

					String correctAnswer = q.getCorrectAnswer();
					String selectedOption = ans.getSelectedOption();

					String selectedText = selectedOption;

					if ("A".equalsIgnoreCase(selectedOption)) {
						selectedText = q.getOptionA();
					} else if ("B".equalsIgnoreCase(selectedOption)) {
						selectedText = q.getOptionB();
					} else if ("C".equalsIgnoreCase(selectedOption)) {
						selectedText = q.getOptionC();
					} else if ("D".equalsIgnoreCase(selectedOption)) {
						selectedText = q.getOptionD();
					}

					System.out.println("Correct Answer: " + correctAnswer);
					System.out.println("Selected Option: " + selectedOption);
					System.out.println("Selected Text: " + selectedText);

					if (correctAnswer != null && selectedText != null
							&& correctAnswer.trim().equalsIgnoreCase(selectedText.trim())) {
						score++;
					}
				}
			}
		}

		return score;
	}

	public int evaluateQuiz(QuizSubmitRequest request, String email) {

		Quiz quiz = quizrepository.findById(request.getQuizId())
				.orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
		if (user == null) {
			throw new RuntimeException("User not found");
		}

		int score = calculateScore(quiz, request.getAnswers());

		Result result = new Result();
		result.setUser(user);
		result.setQuiz(quiz);
		result.setScore(score);

		resultRepository.save(result);

		return score;
	}

}
