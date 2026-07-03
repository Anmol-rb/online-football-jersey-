import { createContext, useState, useContext, useEffect } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartItem, removeCartItem, clearCart as apiClearCart } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Load cart from backend
    const loadCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setCartItems([]);
                setCartCount(0);
                return;
            }
            const response = await getCart();
            if (response.data.success) {
                setCartItems(response.data.cart);
                setCartCount(response.data.cart.length);
            }
        } catch (error) {
            console.error('Load cart error:', error);
            setCartItems([]);
            setCartCount(0);
        } finally {
            setLoading(false);
        }
    };

    // Add item to cart
    const addToCart = async (product, size, quantity = 1) => {
        try {
            const response = await apiAddToCart(product.id, size, quantity);
            if (response.data.success) {
                await loadCart(); // Reload cart to get the updated data with image
                return { success: true, message: 'Item added to cart' };
            }
            return { success: false, message: 'Failed to add item' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to add item' };
        }
    };

    // Update quantity
    const updateQuantity = async (cartId, newQuantity) => {
        try {
            await updateCartItem(cartId, newQuantity);
            await loadCart();
        } catch (error) {
            console.error('Update quantity error:', error);
        }
    };

    // Remove from cart
    const removeFromCart = async (cartId) => {
        try {
            await removeCartItem(cartId);
            await loadCart();
        } catch (error) {
            console.error('Remove from cart error:', error);
        }
    };

    // Clear cart
    const clearCart = async () => {
        try {
            await apiClearCart();
            await loadCart();
        } catch (error) {
            console.error('Clear cart error:', error);
        }
    };

    // Get total price
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);
    };

    // Load cart when token changes
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadCart();
        } else {
            setCartItems([]);
            setCartCount(0);
        }
    }, []);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            getCartTotal,
            clearCart,
            loadCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}