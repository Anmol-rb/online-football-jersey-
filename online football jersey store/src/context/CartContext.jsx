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
                await loadCart();
                return { success: true, message: 'Item added to cart' };
            }
            return { success: false, message: 'Failed to add item' };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to add item' };
        }
    };

    // ============ UPDATE QUANTITY - FIXED ============
    const updateQuantity = async (cartId, size, newQuantity) => {
        if (newQuantity < 1) return;
        
        try {
            // Find the cart item by id and size
            const itemToUpdate = cartItems.find(item => item.id === cartId && item.size === size);
            if (!itemToUpdate) {
                console.error('Item not found in cart');
                return;
            }
            
            await updateCartItem(itemToUpdate.id, newQuantity);
            await loadCart();
        } catch (error) {
            console.error('Update quantity error:', error);
        }
    };

    // Remove from cart
    const removeFromCart = async (cartId, size) => {
        try {
            // Find the cart item by id and size
            const itemToRemove = cartItems.find(item => item.id === cartId && item.size === size);
            if (!itemToRemove) {
                console.error('Item not found in cart');
                return;
            }
            
            await removeCartItem(itemToRemove.id);
            await loadCart();
        } catch (error) {
            console.error('Remove from cart error:', error);
        }
    };

    // Clear cart — hits the backend and deletes the saved cart
    const clearCart = async () => {
        try {
            await apiClearCart();
            await loadCart();
        } catch (error) {
            console.error('Clear cart error:', error);
        }
    };

    // Reset cart locally only — no backend call
    const resetCart = () => {
        setCartItems([]);
        setCartCount(0);
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
            resetCart,
            loadCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}