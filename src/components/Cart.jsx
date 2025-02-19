import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const { cartItems, removeItemFromCart } = useCart();

    return (
        <div>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.productId}>
                            Product ID: {item.productId} | Quantity: {item.quantity}
                            <button onClick={() => removeItemFromCart(item.productId)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
