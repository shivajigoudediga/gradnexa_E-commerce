package com.gradnexa.wear.dto;

import com.gradnexa.wear.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String profileImage;
    private Role role;
}
