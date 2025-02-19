import { useState } from 'react';
import { useCart } from '../contexts/CartContext';

const ProductDetails = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { addItemToCart } = useCart();

    const handleAddToCart = () => {
        addItemToCart(product.id, quantity);
    };

    return (
        <div>
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
            <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value, 10))}
            />
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
};

export default ProductDetails;
