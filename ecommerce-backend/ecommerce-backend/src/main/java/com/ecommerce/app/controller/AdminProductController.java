package com.ecommerce.app.controller;

import com.ecommerce.app.dto.ProductRequest;
import com.ecommerce.app.entity.Product;
import com.ecommerce.app.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

// All endpoints here are protected by SecurityConfig: /api/admin/** requires ROLE_ADMIN
@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final ProductService productService;

    private static final int LOW_STOCK_THRESHOLD = 5;

    // Simple low-stock alert endpoint — admin dashboard can poll this
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>> getLowStockProducts() {
        List<Product> lowStock = productService.getAllProducts().stream()
                .filter(p -> productService.isLowStock(p, LOW_STOCK_THRESHOLD))
                .collect(Collectors.toList());
        return ResponseEntity.ok(lowStock);
    }

    @PostMapping
    public ResponseEntity<Product> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
