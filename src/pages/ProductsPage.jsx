import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/products.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedGender, setSelectedGender] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 15000]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [filterOpen, setFilterOpen] = useState({
        category: false,
        color: false,
        gender: false,
        price: false,
    });
    const [delayCompleted, setDelayCompleted] = useState(false); // New state for delay
    const itemsPerPage = 12;

    const location = useLocation();
    const navigate = useNavigate();

    const resetURL = () => {
        navigate('/products', { replace: true });
        window.location.reload();
    }
    // Function to update URL based on selected filters
    const updateURLWithFilters = () => {
        const params = new URLSearchParams();

        // Add selected categories to the URL
        selectedCategories.forEach((category) => {
            params.append('category', category);
        });

        // Add selected colors to the URL
        selectedColors.forEach((color) => {
            params.append('color', color);
        });

        // Add selected genders to the URL
        selectedGender.forEach((gender) => {
            params.append('gender', gender);
        });

        // Add selected price range to the URL
        if (priceRange[0] !== 0 || priceRange[1] !== 15000) {
            params.append('minPrice', priceRange[0]);
            params.append('maxPrice', priceRange[1]);
        }

        // Update the URL with the filters
        navigate(`?${params.toString()}`, { replace: true });
    };

    // Sync filter selections with URL when they change
    useEffect(() => {
        updateURLWithFilters(); // Update the URL when filters change
    }, [selectedCategories, selectedColors, selectedGender, priceRange]);

    //for filters persistance
    useEffect(() => {
        // Update selected categories from URL
        const params = new URLSearchParams(location.search);
        const categoryFromURL = params.getAll('category');
        const colorFromURL = params.getAll('color');
        const genderFromURL = params.getAll('gender');

        if (categoryFromURL) {
            setSelectedCategories(categoryFromURL.map((category) => category.toUpperCase()));
        }
        if(colorFromURL) {
            setSelectedColors(colorFromURL.map((category) => category.toUpperCase()));
        }
        if(genderFromURL) {
            setSelectedGender(genderFromURL.map((category) => category.toUpperCase()));
        }
        setPriceRange([0, 15000]);

    }, []); //applied only once per load/reload page (to avoid conflicts)

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // Set a delay of 0.55 seconds before showing content
        const delayTimer = setTimeout(() => setDelayCompleted(true), 550);
        return () => clearTimeout(delayTimer);
    }, []);

    useEffect(() => {
        filterProducts();
        setCurrentPage(1);
    }, [searchTerm, selectedCategories, selectedColors, selectedGender, priceRange, products]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/product/get-all', {
                method: 'GET',
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleToggleSelection = (value, setFunction) => {
        setFunction((prevSelections) =>
            prevSelections.includes(value)
                ? prevSelections.filter((item) => item !== value) // Remove if already selected
                : [...prevSelections, value] // Add if not selected
        );
    };


    const handlePriceInputChange = (index, value) => {
        // If the input is empty, we allow it to be an empty string
        if (value === '' || /^[0-9]+$/.test(value)) {
            setPriceRange((prevRange) => {
                const updatedRange = [...prevRange];
                updatedRange[index] = value === '' ? 0 : parseInt(value, 10);
                return updatedRange;
            });
        }
    };
    const handlePriceButtonClick = (index, change) => {
        setPriceRange((prevRange) => {
            const updatedRange = [...prevRange];
            const newValue = updatedRange[index] + change;
            if (newValue >= 0) {
                updatedRange[index] = newValue;
            }
            return updatedRange;
        });
    };

    const filterProducts = (term = searchTerm) => {
        let filtered = products.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase()) // Make sure the comparison is case-insensitive
        );

        if (selectedCategories.length > 0) {
            filtered = filtered.filter((product) => selectedCategories.includes(product.category));
        }

        if (selectedColors.length > 0) {
            filtered = filtered.filter((product) => selectedColors.includes(product.color));
        }

        if (selectedGender.length > 0) {
            filtered = filtered.filter((product) => selectedGender.includes(product.gender));
        }

        filtered = filtered.filter((product) =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        setFilteredProducts(filtered);
    };


    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
         window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const displayedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleFilterOpen = (filterType) => {
        setFilterOpen((prev) => ({ ...prev, [filterType]: !prev[filterType] }));
    };

    return (
        <div className="products-page">
            <aside className="filter-menu">
                <h3>Filter by</h3>

                <h4 onClick={() => toggleFilterOpen('category')}>
                    <span>{filterOpen.category ? '⬓ Category' : '⬒ Category'}</span>
                </h4>
                {filterOpen.category && (
                    <div className="filter-group">
                        {["TSHIRTS", "JEANS", "SHORTS", "PANTS", "BAGS", "TOPS", "BLOUSES", "HATS", "JACKETS", "DRESS", "SNEAKERS", "ACCESSORIES"].map((category) => (
                            <button
                                key={category}
                                className={`filter-button ${selectedCategories.includes(category) ? 'active' : ''}`}
                                onClick={() => handleToggleSelection(category, setSelectedCategories, selectedCategories)}
                            >
                                {category.charAt(0) + category.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                )}

                <h4 onClick={() => toggleFilterOpen('color')}>
                    <span>{filterOpen.color ? '⬓ Color' : '⬒ Color'}</span>
                </h4>
                {filterOpen.color && (
                    <div className="filter-group">
                        {["WHITE", "BLACK", "BLUE", "RED", "GREEN", "YELLOW", "PURPLE", "PINK", "ORANGE", "BROWN", "GRAY"].map((color) => (
                            <button
                                key={color}
                                className={`filter-button color-button ${selectedColors.includes(color) ? 'active' : ''}`}
                                onClick={() => handleToggleSelection(color, setSelectedColors, selectedColors)}
                            >
                                <span className={`color-box ${color.toLowerCase()}`}></span>
                                {color.charAt(0) + color.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                )}

                <h4 onClick={() => toggleFilterOpen('gender')}>
                    <span>{filterOpen.gender ? '⬓ Gender' : '⬒ Gender'}</span>
                </h4>
                {filterOpen.gender && (
                    <div className="filter-group">
                        {["MALE", "FEMALE", "UNISEX"].map((gender) => (
                            <button
                                key={gender}
                                className={`filter-button color-button ${selectedGender.includes(gender) ? 'active' : ''}`}
                                onClick={() => handleToggleSelection(gender, setSelectedGender, selectedGender)}
                            >
                                {gender.charAt(0) + gender.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                )}

                <h4 onClick={() => toggleFilterOpen('price')}>
                    <span>{filterOpen.price ? '⬓ Price' : '⬒ Price'}</span>
                </h4>
                {filterOpen.price && (
                    <div className="price-cards">
                        {/* Card for Minimum Price */}
                        <div className="price-label">
                            Min
                        </div>
                        <div className="price-card">

                            <button
                                className="price-btn"
                                onClick={() => handlePriceButtonClick(0, -50)}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={priceRange[0]}
                                onChange={(e) => handlePriceInputChange(0, e.target.value)}
                                className="price-input"
                            />
                            <button
                                className="price-btn"
                                onClick={() => handlePriceButtonClick(0, 50)}
                            >
                                +
                            </button>
                        </div>
                        {/* Card for Maximum Price */}
                        <div className="price-label">
                            Max
                        </div>
                        <div className="price-card">
                            <button
                                className="price-btn"
                                onClick={() => handlePriceButtonClick(1, -50)}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                value={priceRange[1]}
                                onChange={(e) => handlePriceInputChange(1, e.target.value)}
                                className="price-input"
                            />
                            <button
                                className="price-btn"
                                onClick={() => handlePriceButtonClick(1, 50)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
                <div className="button-container">
                    <button
                        className="clear-filters-button"
                        onClick={() => resetURL()}
                    >
                        Clear filters
                    </button>
                </div>
            </aside>

            <main className="products-content">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                {delayCompleted ? (
                    <div className="product-list">
                        {displayedProducts.length > 0 ? (
                            displayedProducts.map((product) => (
                                <Link key={product.id} to={`/product/${product.id}`} className="product-card">
                                    <img
                                        src={`/productimages/${product.id}-1.png`}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.src = '/productimages/default.png';
                                        }}
                                    />
                                    <h3>{product.name}</h3>
                                    <p style={{fontWeight: 'bold', color: 'green'}}>Price: ${product.price}</p>
                                    <p style={{fontWeight: 'bold'}}>Brand: {product.brand}</p>
                                    <p>Category: {product.category}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="nothing-to-show">No products found.</div>
                        )}
                    </div>
                ) : (<div className="nothing-to-show">Loading...</div>)}

                {delayCompleted ? (
                    <div className="pagination">
                        {[...Array(totalPages).keys()].map((pageNumber) => (
                            <button
                                key={pageNumber + 1}
                                className={`page-button ${currentPage === pageNumber + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(pageNumber + 1)}
                            >
                                {pageNumber + 1}
                            </button>
                        ))}
                    </div>
                ) : (<div> </div>)}


                {showBackToTop && (
                    <button className="back-to-top" onClick={scrollToTop}>
                        ⭡ Back to Top
                    </button>
                )}
            </main>
        </div>
    );
};

export default ProductsPage;
