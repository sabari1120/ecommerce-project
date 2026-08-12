package com.ecommerce.app.service;

import com.ecommerce.app.dto.CartItemRequest;
import com.ecommerce.app.entity.CartItem;
import com.ecommerce.app.entity.Product;
import com.ecommerce.app.entity.User;
import com.ecommerce.app.repository.CartItemRepository;
import com.ecommerce.app.repository.ProductRepository;
import com.ecommerce.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public List<CartItem> getCart(String email) {
        return cartItemRepository.findByUser(getUser(email));
    }

    public CartItem addToCart(String email, CartItemRequest request) {
        User user = getUser(email);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        CartItem item = cartItemRepository.findByUserAndProductId(user, product.getId())
                .orElse(new CartItem(null, user, product, 0));

        item.setQuantity(item.getQuantity() + request.getQuantity());
        return cartItemRepository.save(item);
    }

    public void removeFromCart(String email, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        if (!item.getUser().getEmail().equals(email)) {
            throw new SecurityException("Not authorized to modify this cart item");
        }
        cartItemRepository.delete(item);
    }

    public void clearCart(String email) {
        cartItemRepository.deleteByUser(getUser(email));
    }
}
