import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import '../styles/adminProducts.css';

const categories = [
    "TSHIRTS", "JEANS", "SHORTS", "PANTS", "BAGS", "TOPS",
    "BLOUSES", "HATS", "JACKETS", "DRESS", "SNEAKERS", "ACCESSORIES"
];

const colors = [
    "WHITE", "BLACK", "BLUE", "RED", "GREEN", "YELLOW",
    "PURPLE", "PINK", "ORANGE", "BROWN", "GREY"
];

const genders = [
    "MALE", "FEMALE", "UNISEX"
];
const brands = [
    "ADIDAS", "AMIRI", "ARMANI", "BALENCIAGA", "BURBERRY", "CA",
    "CALVINKLEIN", "CHANNEL", "CHRISTIANDIOR", "CHAMPION", "DOLCEGABBANA",
    "DSQUARED2", "FENDI", "GIVENCHY", "GUCCI", "HERMES", "HM",
    "HUGOBOSS", "JACKNJONES", "JORDAN", "LACOSTE", "LEVIS", "LOUISVUITTON",
    "MONCLER", "NEWBALANCE", "NEWYORKER", "NIKE", "PULLANDBEAR", "PRADA",
    "PUMA", "ROLEX", "TOMMYHILFIGER", "VANS", "VERSACE", "VICTORIA", "WIKIKI", "ZARA"
];




const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        id: null,
        name: '',
        category: 'TSHIRTS',
        price: '',
        quantity: 0,
        shortDescription: '',
        longDescription: '',
        color: 'WHITE',
        gender: 'UNISEX'
    });
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'ADMIN') {
            alert('Access Denied! Only admins can access this page.');
            navigate('/login');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    useEffect(() => {
        setFilteredProducts(
            products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/product/get-all', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${btoa(`${user.email}:${localStorage.getItem('password')}`)}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data); // Initialize filtered products
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const method = newProduct.id ? 'PUT' : 'POST';
            const url = newProduct.id ? `http://localhost:8080/product/update/${newProduct.id}` : 'http://localhost:8080/product/create';
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Basic ${btoa(`${user.email}:${localStorage.getItem('password')}`)}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                resetForm();
                fetchProducts();
            } else {
                console.error('Failed to add or update product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await fetch(`http://localhost:8080/product/delete/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Basic ${btoa(`${user.email}:${localStorage.getItem('password')}`)}`,
                },
            });

            if (response.ok) {
                setProducts(products.filter(product => product.id !== productId));
            } else {
                console.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEditProduct = (product) => {
        setNewProduct(product);
    };

    const resetForm = () => {
        setNewProduct({
            id: null,
            name: '',
            category: 'TSHIRTS',
            price: '',
            quantity: 0,
            shortDescription: '',
            longDescription: '',
            color: 'WHITE',
            gender: 'UNISEX'
        });
    };

    return (
        <div className="admin-products-page">
            <h2>Admin Products</h2>
            <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />
            <form className="add-product-form" onSubmit={handleAddProduct}>
                <h3>{newProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
                <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    required
                />
                <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    required
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select
                    value={newProduct.color}
                    onChange={(e) => setNewProduct({...newProduct, color: e.target.value})}
                    required
                >
                    {colors.map((color) => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
                <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({...newProduct, gender: e.target.value})}
                    required
                >
                    {genders.map((gender) => (
                        <option key={gender} value={gender}>{gender}</option>
                    ))}
                </select>
                <select
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    required
                >
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                    required
                />
                <input
                    type="text"
                    placeholder="Short Description"
                    value={newProduct.shortDescription}
                    onChange={(e) => setNewProduct({...newProduct, shortDescription: e.target.value})}
                    required
                />
                <textarea
                    placeholder="Long Description"
                    value={newProduct.longDescription}
                    onChange={(e) => setNewProduct({...newProduct, longDescription: e.target.value})}
                />
                <div className="button-container">
                    <button type="submit" className="save-button">
                        {newProduct.id ? 'Update Product' : 'Add Product'}
                    </button>
                    {newProduct.id && (
                        <button type="button" className="cancel-button" onClick={resetForm}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>


            <div className="product-list">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card" onClick={() => handleEditProduct(product)}>
                        <p>ID: {product.id}</p>
                        <h3>{product.name}</h3>
                        <p>Category: {product.category}</p>
                        <p>Color: {product.color}</p>
                        <p>Gender: {product.gender}</p>
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {product.quantity}</p>
                        {/*<p>{product.shortDescription}</p>*/}
                        <p>Brand: {product.brand}</p>

                        <button
                            className="delete-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProduct(product.id);
                            }}
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProductsPage;

