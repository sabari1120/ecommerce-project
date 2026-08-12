package com.ecommerce.app.controller;

import com.ecommerce.app.dto.CartItemRequest;
import com.ecommerce.app.entity.CartItem;
import com.ecommerce.app.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(Authentication auth) {
        return ResponseEntity.ok(cartService.getCart(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<CartItem> addToCart(Authentication auth, @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addToCart(auth.getName(), request));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(Authentication auth, @PathVariable Long cartItemId) {
        cartService.removeFromCart(auth.getName(), cartItemId);
        return ResponseEntity.noContent().build();
    }
}
