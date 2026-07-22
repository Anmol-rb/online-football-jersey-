// Khalti service - Simplified Working Version

const KHALTI_PUBLIC_KEY = 'pk_test_7d2127d3b13441a7bc3d11b9e4166daa';

export const initiatePayment = (amount, orderId, user, items) => {
    return new Promise((resolve, reject) => {
        try {
            // Create Khalti payment URL - Using the correct format
            const khaltiUrl = new URL('https://khalti.com/payment/pay/');
            
            const params = {
                amount: amount,
                order_id: orderId,
                product_identity: 'jerseyhub_order',
                product_name: 'Jersey Hub Order',
                product_url: 'http://localhost:5174/',
                public_key: KHALTI_PUBLIC_KEY
            };

            Object.keys(params).forEach(key => 
                khaltiUrl.searchParams.append(key, params[key])
            );

            console.log('💰 Opening Khalti payment...');
            console.log('📦 Order ID:', orderId);
            console.log('🔗 URL:', khaltiUrl.toString());

            // Open Khalti in new window
            const khaltiWindow = window.open(
                khaltiUrl.toString(), 
                '_blank', 
                'width=500,height=600,scrollbars=yes'
            );

            if (!khaltiWindow) {
                reject(new Error('Popup blocked. Please allow popups.'));
                return;
            }

            // For now, resolve after 3 seconds (for testing)
            setTimeout(() => {
                resolve({
                    success: true,
                    token: 'test_token_' + Date.now(),
                    orderId: orderId,
                    message: 'Payment simulated'
                });
            }, 3000);

        } catch (error) {
            console.error('❌ Khalti error:', error);
            reject(error);
        }
    });
};

export default {
    initiatePayment
};