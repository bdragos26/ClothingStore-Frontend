import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

import '../styles/singleProduct.css';


// eslint-disable-next-line react/prop-types
const StarRating = ({ rating, onRate }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="star-rating">
            {stars.map((star) => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'filled' : ''}`}  // Apply 'filled' class based on rating
                    onClick={() => onRate(star)}  // Set rating when clicked
                    onMouseEnter={() => onRate(star)}  // Show preview rating on hover
                    onMouseLeave={() => onRate(rating)}  // Reset to original rating on hover leave
                >
                    ★
                </span>
            ))}
        </div>
    );
};

const SingleProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const { addToCart } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(1);
    const [imageError, setImageError] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewContent, setReviewContent] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [isProcessing, setIsProcessing] = useState(false); //to avoid button mashing (the heart)

    const user_id = localStorage.getItem("id") || null;
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    const maxImageCount = 3;

    const getAuthHeader = () => {
        if (email && password) {
            return {
                Authorization: 'Basic ' + btoa(`${email}:${password}`)
            };
        }
        return {};
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/product/view/${id}`, {
                    headers: getAuthHeader(),
                });
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    console.error('Failed to fetch product');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:8080/reviews/product/${id}`, {
                    headers: getAuthHeader(),
                });
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                } else {
                    console.error('Failed to fetch reviews');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:8080/favorite/userid/${user_id}/get-all`, {
                    headers: getAuthHeader(),
                });
                if (response.ok) {
                    const favorites = await response.json();
                    // Check if the product ID is in the favorites list
                    const isFavorited = favorites.some((fav) => fav.product.id === parseInt(id, 10));
                    setIsFavorite(isFavorited);
                } else {
                    console.error('Failed to fetch favorites');
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchProduct();
        fetchReviews();
        fetchFavorites();
    }, [id, user_id]);

    const handleAddToCart = () => {
        if(user_id !=null) {
            if (selectedSize || product.category === "BAGS" || product.category === "HATS" || product.category === "ACCESSORIES") {
                addToCart(product, 1); // You can adjust quantity if needed
                alert(`Added ${product.name} (Size: ${selectedSize}) to cart`);
            } else {
                alert('Please select a size');
            }
        }
        else
            alert('You must be Authenticate before place an order!');
    };


    const handleAddReview = async () => {
        if (user_id && reviewContent && reviewRating) {
            try {
                const response = await fetch(
                    `http://localhost:8080/reviews/add?user=${user_id}&productId=${id}&content=${encodeURIComponent(reviewContent)}&rating=${reviewRating}`,
                    {
                        method: 'POST',
                        headers: getAuthHeader(),
                    }
                );
                if (response.ok) {
                    const newReview = await response.json();
                    setReviews([...reviews, newReview]);
                    setReviewContent('');
                    setReviewRating(5);
                } else {
                    console.error('Failed to add review');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert('Please add your review content and rating');
        }
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex < maxImageCount ? prevIndex + 1 : 1));
        setImageError(false);
    };

    const handlePreviousImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex > 1 ? prevIndex - 1 : maxImageCount));
        setImageError(false);
    };

    const toggleFavorite = async () => {
        console.log("Toggle favorite clicked");
        if(isProcessing) return; //avoid button mashing
        setIsProcessing(true);

        try {
            // Determine the endpoint and HTTP method
            const endpoint = isFavorite
                ? `http://localhost:8080/favorite/delete-one-product`
                : `http://localhost:8080/favorite/add`;

            const method = isFavorite ? "DELETE" : "POST";

            // Construct the query parameters
            const params = new URLSearchParams({
                product: product.id, // Use the product ID
                user: user_id,       // Use the user ID
            });

            //Optimistic approach, for faster display
            setIsFavorite(!isFavorite);

            // Send the request
            const response = await fetch(`${endpoint}?${params.toString()}`, {
                method: method,
                headers: getAuthHeader(),
            });

            if (response.ok) {
                console.log(
                    isFavorite ? "Successfully removed from favorites" : "Successfully added to favorites"
                );
            } else {
                //if the response is negative, we revert the modification
                setIsFavorite(!isFavorite);
                console.error("Failed to toggle favorite status");
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        } finally {
            setIsProcessing(false);
        }
    };


    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="single-product-page">
            <button className="back-to-products-button" onClick={() => navigate('/products')}>
                ← Back to Products
            </button>

            <div className="product-image-carousel">
                <button onClick={handlePreviousImage} className="carousel-button">{"<"}</button>
                <img
                    src={`/productimages/${product.id}-${currentImageIndex}.png`}
                    alt={product.name}
                    onError={() => setImageError(true)}
                    style={{display: imageError ? 'none' : 'block'}}
                />
                {imageError && <p>Image not available</p>}
                <button onClick={handleNextImage} className="carousel-button">{">"}</button>
            </div>

            <div className="product-details">
                <h1>{product.name}</h1>
                <p>Brand: {product.brand}</p>
                <p>Category: {product.category}</p>
                <p>Gender: {product.gender}</p>
                <p>Color: {product.color}</p>
                <div className="product-price-text">Price: ${product.price}</div>
                <p style={{fontWeight: 'bold'}}>Short Description:</p>
                <p>{product.shortDescription}</p>

                <div className="product-size-select">
                    <label htmlFor="size">Select Size:</label>
                    {product.category === "BAGS" || product.category === "ACCESSORIES" ? (
                        <p>For this category the size is universal !</p>
                    ) : (
                        <select id="size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                            <option value="">Choose size</option>
                            {product.category === "SNEAKERS" ? (
                                <>
                                    <option value="35">35</option>
                                    <option value="36">36</option>
                                    <option value="37">37</option>
                                    <option value="38">38</option>
                                    <option value="39">39</option>
                                    <option value="40">40</option>
                                    <option value="41">41</option>
                                    <option value="42">42</option>
                                    <option value="43">43</option>
                                    <option value="44">44</option>
                                    <option value="45">45</option>
                                    <option value="46">46</option>
                                    <option value="47">47</option>
                                </>
                            ) : (
                                <>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </>
                            )}
                        </select>
                    )}
                </div>


                <div className="product-buttons">
                    <button onClick={handleAddToCart} className="add-to-cart-button">Add to Cart</button>
                    <div className="favorite-button-container">
                        <button onClick={toggleFavorite} className="favorite-button">
                            {isFavorite ? "❤️" : "🤍"}
                        </button>
                    </div>
                </div>
                <div className="delivery-info">
                    <div className="delivery-card">🚚 Free delivery
                        <div className="delivery-card__info">FREE</div>
                    </div>
                    <div className="delivery-card">
                        <div className="delivery-text"> 🔄 100 days return policy</div>
                        <div className="delivery-info-container">
                            <div className="delivery-card-info">Fast delivery</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                {reviews.length === 0 ? (
                    <p>For this product, there are no reviews yet.</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review">
                            <p><strong>{review.user.username}:</strong> {review.content}</p>
                            <p>Rating: {review.rating} / 5</p>
                        </div>
                    ))
                )}

                {(email && password) && (
                    <div className="add-review">
                        <h3>Add Your Review</h3>
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="Write your review here..."
                        />
                        <StarRating rating={reviewRating} onRate={setReviewRating} />
                        <button onClick={handleAddReview}>Submit Review</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleProductPage;
