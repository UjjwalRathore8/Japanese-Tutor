package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.LeaderboardDTO;
import com.example.demo.entity.Result;


public interface ResultRepository extends JpaRepository<Result, Integer> {

	List<Result> findByUserId(Integer userId);

	List<Result> findByUserEmail(String email);
	
	//List<Result> findTop10ByOrderByScoreDesc();
	
//	@Query("""
//			SELECT new com.example.demo.dto.LeaderboardDTO(
//			    r.user.name,
//			    r.user.email,
//			    SUM(r.score)
//			)
//			FROM Result r
//			GROUP BY r.user.id, r.user.name, r.user.email
//			ORDER BY SUM(r.score) DESC
//			""")
//			List<LeaderboardDTO> getLeaderboard();
	@Query("""
			SELECT new com.example.demo.dto.LeaderboardDTO(
			    r.user.name,
			    r.user.email,
			    SUM(r.score)
			)
			FROM Result r
			WHERE r.score = (
			    SELECT MAX(r2.score)
			    FROM Result r2
			    WHERE r2.user.id = r.user.id
			    AND r2.quiz.id = r.quiz.id
			)
			GROUP BY r.user.id, r.user.name, r.user.email
			ORDER BY SUM(r.score) DESC
			""")
			List<LeaderboardDTO> getLeaderboard();

	
	
	@Transactional
	@Modifying
	@Query("DELETE FROM Result r WHERE r.quiz.id = :quizId")
	void deleteByQuizId(@Param("quizId") int quizId);
	
}
