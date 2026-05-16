package com.gradnexa.wear.controller;

import com.gradnexa.wear.dto.ApiResponse;
import com.gradnexa.wear.entity.Category;
import com.gradnexa.wear.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(categoryRepository.findAll()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Category>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(
                categoryRepository.findBySlug(slug).orElse(null)));
    }
}
