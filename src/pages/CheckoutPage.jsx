import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/checkout.css';

const CheckoutPage = () => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState([]);
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    const getAuthHeader = () => {
        if (email && password) {
            return {
                Authorization: 'Basic ' + btoa(`${email}:${password}`)
            };
        }
        return {};
    };

    useEffect(() => {
        // Fetch product details to validate stock and display the first image
        const fetchProductDetails = async () => {
            try {
                const productDetailsPromises = cartItems.map(async (item) => {
                    const response = await fetch(`http://localhost:8080/product/view/${item.id}`);
                    if (response.ok) {
                        return response.json();
                    }
                    return null;
                });

                const details = await Promise.all(productDetailsPromises);
                setProductDetails(details.filter(Boolean)); // Filter out any failed responses
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        if (cartItems.length > 0) {
            fetchProductDetails();
        }
    }, [cartItems]);

    const handleSubmitOrder = async () => {
        const orderData = {
            userId: localStorage.getItem("id"),
            items: cartItems.map(item => ({
                productId: item.id, // Use item.id instead of item.productId
                quantity: item.quantity
            }))
        };

        try {
            const response = await axios.post(
                'http://localhost:8080/order/create',
                orderData,
                { headers: getAuthHeader() }
            );
            console.log(response);
            alert('Order placed successfully!');
            localStorage.removeItem("cart");
            navigate('/products');
            window.location.reload();

        } catch (error) {
            console.error('Error creating order:', error);
            if (error.response) {
                console.error('Server responded with:', error.response.data);
                alert(`Error placing order: ${error.response.data}`);
            } else {
                alert('Unknown error occurred while placing order.');
            }
        }
    };


    const handleQuantityChange = (item, newQuantity) => {
        const validQuantity = Math.min(Math.max(newQuantity, 0), item.stock || Infinity);
        updateQuantity(item.id, validQuantity);
    };

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            {cartItems.length > 0 ? (
                <ul className="cart-items-list">
                    {cartItems.map((item, index) => (
                        <li key={item.id} className="cart-item">
                            <div className="cart-item-image">
                                <img
                                    src={`/productimages/${item.id}-1.png`}
                                    alt={item.name}
                                    className="product-image"
                                />
                            </div>
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>Price: ${item.price}</p>
                                <p>Stock: {productDetails[index]?.stock || 0}</p>
                                <div className="quantity-controls">
                                    <button
                                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                        disabled={item.quantity === 0}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                                        min="0"
                                        max={productDetails[index]?.stock || item.quantity}
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                        // disabled={item.quantity >= (productDetails[index]?.stock || 0)}
                                    >
                                        +
                                    </button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)}>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
            {cartItems.length > 0 && (
                <button onClick={handleSubmitOrder} className="place-order-button">
                    Place Order
                </button>
            )}
        </div>
    );
};

export default CheckoutPage;
