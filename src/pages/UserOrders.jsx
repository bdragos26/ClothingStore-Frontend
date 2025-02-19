import { useEffect, useState } from 'react';
import '../styles/userorders.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5; // Numărul de comenzi pe pagină
    const user_id = localStorage.getItem("id") || null;
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
        const fetchOrders = async () => {
            try {
                const response = await fetch(`http://localhost:8080/order/user-orders/userid/${user_id}/get-all`, {
                    headers: getAuthHeader(),
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchOrders();
    }, [user_id]);

    // Paginate orders
    const startIndex = (currentPage - 1) * ordersPerPage;
    const paginatedOrders = orders.slice(startIndex, startIndex + ordersPerPage);

    const handleNextPage = () => {
        if (currentPage * ordersPerPage < orders.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (!orders.length) {
        return <p className="loading">Loading orders...</p>;
    }

    return (
        <div className="user-orders-container">
            {paginatedOrders.map((order) => (
                <div key={order.id} className="order-card">
                    <h3 className="order-header">
                        Order id: {order.id}
                        <span className="total-price">  Total: {order.total.toFixed(2)} $</span>

                    </h3>
                    <h5 className="order-status" style={{color: "green"}}>Status: Processed ✓</h5>
                    <h4 className="order-subheader">Products:</h4>
                    <table className="order-table compact-table">
                        <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product</th>
                            <th>Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {order.orderItems.map((item) => (
                            <tr key={item.id} className="order-item">
                                <td className="product-image">
                                    <img
                                        src={`/productimages/${item.product.id}-1.png`}
                                        alt={item.product.name}
                                        onError={(e) => (e.target.src = '/fallback-image.png')}
                                    />
                                </td>
                                <td className="product-name">
                                    {item.product.name}
                                </td>
                                <td className="quantity">
                                    {item.quantity}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>Page {currentPage}</span>
                <button onClick={handleNextPage} disabled={currentPage * ordersPerPage >= orders.length}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserOrders;
