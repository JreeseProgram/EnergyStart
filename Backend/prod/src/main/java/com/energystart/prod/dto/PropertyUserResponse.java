package com.energystart.prod.dto;

public record PropertyUserResponse(
        String userId,
        String email,
        String firstName,
        String lastName
) {

}