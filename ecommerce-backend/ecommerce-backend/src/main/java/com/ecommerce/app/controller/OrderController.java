package com.ecommerce.app.controller;

import com.ecommerce.app.entity.Order;
import com.ecommerce.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> placeOrder(Authentication auth) {
        return ResponseEntity.ok(orderService.placeOrder(auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getOrderHistory(Authentication auth) {
        return ResponseEntity.ok(orderService.getOrderHistory(auth.getName()));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long orderId, @RequestParam Order.OrderStatus status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, status));
    }
}
