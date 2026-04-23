package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.ResultDTO;
import com.example.demo.entity.Result;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ResultRepository;

@Service
public class ResultService {

	@Autowired
	private ResultRepository resultrepository;

	public List<ResultDTO> getAllResults() {

		List<Result> results = resultrepository.findAll();

		return results.stream().map(r -> {
			ResultDTO dto = new ResultDTO();

			dto.setResultId(r.getId());
			dto.setScore(r.getScore());
			dto.setQuizTitle(r.getQuiz().getTitle());
			dto.setUserName(r.getUser().getName());

			return dto;
		}).toList();
	}

	public Result addResult(Result result) {
		return resultrepository.save(result);
	}

	public ResultDTO getResultById(Integer id) {
		Result r = resultrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Result not found"));
		ResultDTO dto = new ResultDTO();
		dto.setResultId(r.getId());
		dto.setScore(r.getScore());
		dto.setQuizTitle(r.getQuiz().getTitle());
		dto.setUserName(r.getUser().getName());
		return dto;
	}

	public List<Result> getResultsByUser(Integer userId) {
		return resultrepository.findByUserId(userId);
	}

	public void deleteById(int id) {
		Result r = resultrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Result not found"));
		resultrepository.delete(r);
	}

	public List<Result> getResultsByEmail(String email) {
		return resultrepository.findByUserEmail(email);
	}

}
