import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); 
  const tableHeaderStyle = {
    padding: "10px",
    border: "1px solid #ccc"
  };
  
  const tableCellStyle = {
    padding: "8px",
    border: "1px solid #ddd"
  };
  
  const tableRowStyle = {
    backgroundColor: "#f9f9f9"
  };
  // Функція для отримання замовлень користувача
  const fetchOrders = async () => {
    try {      
      const response = await fetch(`http://localhost:5000/api/orders/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Перетворюємо відповідь у JSON
      setOrders(data);
      console.log(data);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Викликається при завантаженні компоненти
  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "20px" }}>
    <h2>Your Orders</h2>
    <table style={{ width: "80%", borderCollapse: "collapse", textAlign: "center" }}>
      <thead>
        <tr style={{ backgroundColor: "#007bff", color: "white" }}>
          <th style={tableHeaderStyle}>Order ID</th>
          <th style={tableHeaderStyle}>Product</th>
          <th style={tableHeaderStyle}>Quantity</th>
          <th style={tableHeaderStyle}>Total Price</th>
          <th style={tableHeaderStyle}>User</th>
          <th style={tableHeaderStyle}>Date</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (            
          orders.map((order) => (
            <tr key={order.id} style={tableRowStyle}>
              <td style={tableCellStyle}>{order.id}</td>
              <td style={tableCellStyle}>{order.product.name}</td>
              <td style={tableCellStyle}>{order.quantity}</td>
              <td style={tableCellStyle}>{order.totalPrice ?? "Not calculated"}</td>
              <td style={tableCellStyle}>{order.user.name}</td>
              <td style={tableCellStyle}>{new Date(order.createdAt).toLocaleString()}</td>                
            </tr>              
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ padding: "15px", fontSize: "16px" }}>No orders found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  
  );
};

export default UserOrders;
