import axios from 'axios';

// ==== Config ====
// Backend base URL — hardcoded as requested (no frontend .env).
// Change this if your backend port/host changes.
const API_BASE_URL = 'http://localhost:5002/api';

export const initiatePayment = async (amount, orderId, user, items) => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.post(
            `${API_BASE_URL}/khalti/initiate`,
            {
                amount, // send as rupees — backend converts to paisa
                orderId,
                productName: items?.length ? `Order #${orderId} (${items.length} items)` : 'Jersey Hub Order',
                customerInfo: {
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // matches your verifyToken middleware
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.data.success && response.data.payment_url) {
            console.log('💰 Redirecting to Khalti payment page...');
            console.log('📦 Order ID:', orderId);
            console.log('🔗 pidx:', response.data.pidx);

            // Full-page redirect — Khalti's hosted checkout is not a popup flow anymore
            window.location.href = response.data.payment_url;

            // Nothing to resolve here since the browser is navigating away.
            // The promise just confirms the redirect was triggered.
            return { redirecting: true };
        }

        throw new Error(response.data.message || 'Payment initiation failed');
    } catch (error) {
        console.error('❌ Khalti error:', error.response?.data || error.message);
        throw error;
    }
};

export default {
    initiatePayment,
};