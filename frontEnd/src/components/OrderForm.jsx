import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../http/orderAPI";
import { ORDERS_ROUTE } from "../utils/consts";


const OrderForm = () => {  
  const [userId, setUserId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate(); 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createOrder({ userId, productId, quantity });      
      console.log(response);
    
      navigate(`${ORDERS_ROUTE}/${userId}`); // Правильний виклик navigate
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      
      alert(errorMessage); 
      navigate(ORDERS_ROUTE);
    }
  };

  return (
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
  <div style={{ width: "300px", textAlign: "center" }}>
    <h2>Create Order</h2>
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <input
        type="text"
        placeholder="User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <input
        type="text"
        placeholder="Product ID"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        required
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        required
        style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <button type="submit" style={{ padding: "10px", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: "pointer" }}>
        Submit Order
      </button>
    </form>
  </div>
</div>

  );
};

export default OrderForm;
