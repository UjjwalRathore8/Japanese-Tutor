package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.LeaderboardDTO;
import com.example.demo.dto.ResultDTO;
import com.example.demo.entity.Result;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.ResultRepository;

@Service
public class ResultService {


	@Autowired
	private ResultRepository resultrepository;

//	public Result addResultForUser(Result result, String email) {
//
//	    User user = userrepository.findByEmail(email)
//	            .orElseThrow(() -> new RuntimeException("User not found"));
//
//	    result.setUser(user);
//
//	    return resultrepository.save(result);
//	}
	
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

//	public Result addResult(Result result) {
//		return resultrepository.save(result);
//	}

//	public ResultDTO getResultById(Integer id) {
//		Result r = resultrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Result not found"));
//		ResultDTO dto = new ResultDTO();
//		dto.setResultId(r.getId());
//		dto.setScore(r.getScore());
//		dto.setQuizTitle(r.getQuiz().getTitle());
//		dto.setUserName(r.getUser().getName());
//		return dto;
//	}

//	public List<Result> getResultsByUser(Integer userId) {
//		return resultrepository.findByUserId(userId);
//	}

	public void deleteById(int id) {
		Result r = resultrepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Result not found"));
		resultrepository.delete(r);
	}

	public List<Result> getResultsByEmail(String email) {
		return resultrepository.findByUserEmail(email);
	}

//	public List<LeaderboardDTO> getTopResults() {
//	    return resultrepository.findTop10ByOrderByScoreDesc()
//	            .stream()
//	            .map(r -> new LeaderboardDTO(
//	                    r.getUser().getName(),
//	                    r.getUser().getEmail(),
//	                    r.getScore()
//	            ))
//	            .toList();
//	}
	public List<LeaderboardDTO> getTopResults() {
	    return resultrepository.getLeaderboard();
	}
	

}
