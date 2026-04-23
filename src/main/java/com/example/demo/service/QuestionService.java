package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Question;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.QuestionRepository;

@Service
public class QuestionService {

	@Autowired
	private QuestionRepository questionrepository;

	public Question addQuestion(Question question) {
		return questionrepository.save(question);
	}

	public List<Question> allQuestion() {
		return questionrepository.findAll();
	}

	public Question byQuestionId(int id) {
		Question q = questionrepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Question not found"));
		return q;
	}

	public void removeById(int id) {
		Question q = questionrepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Question not found"));
		questionrepository.delete(q);
	}

	public Question updateById(Question question, int id) {
		Question q = questionrepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Question not found"));
		q.setQuestionText(question.getQuestionText());
		q.setOptionA(question.getOptionA());
		q.setOptionB(question.getOptionB());
		q.setOptionC(question.getOptionC());
		q.setOptionD(question.getOptionD());
		q.setCorrectAnswer(question.getCorrectAnswer());
		questionrepository.save(q);
		return q;
	}

}
