import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/favoritesPage.css';

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const userId = localStorage.getItem("id");
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const navigate = useNavigate();

    const getAuthHeader = () => {
        if (email && password) {
            return {
                Authorization: 'Basic ' + btoa(`${email}:${password}`),
            };
        }
        return {};
    };

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:8080/favorite/userid/${userId}/get-all`, {
                    headers: getAuthHeader(),
                });
                if (response.ok) {
                    const data = await response.json();
                    setFavorites(data);
                } else {
                    console.error('Failed to fetch favorites');
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, [userId]);

    const handleViewProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (favorites.length === 0) {
        return <p>No favorites yet. Start adding some!</p>;
    }

    return (
        <div className="favorites-page">
            <h1>Your Favorite Products</h1>
            <div className="favorites-list">
                {favorites.map((fav) => (
                    <div key={fav.product.id} className="favorite-item">
                        <img
                            src={`/productimages/${fav.product.id}-1.png`}
                            alt={fav.product.name}
                            onError={(e) => (e.target.src = '/placeholder.png')}
                        />
                        <div className="favorite-details">
                            <h2>{fav.product.name}</h2>
                            <p>Brand: {fav.product.brand}</p>
                            <p>Price: ${fav.product.price}</p>
                            <button onClick={() => handleViewProduct(fav.product.id)}>View Product</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
