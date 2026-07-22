package com.example.demo.dto;

public class LeaderboardDTO {

	    private String name;
	    private String email;
	    private Long score;

	    public LeaderboardDTO(String name, String email, Long score) {
	        this.name = name;
	        this.email = email;
	        this.score = score;
	    }

	    public String getName() { return name; }
	    public String getEmail() { return email; }
	    public Long getScore() { return score; }
	}
	