import React, { useState } from "react";
import axios from "axios";

function IngredientForm() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [importDate, setImportDate] = useState("");
  const [expiryDate, setExpiryDate] =  useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/ingredients", {
        name,
        unit,
      });
      setMessage(res.data.message);
      setName("");
      setUnit("");
      setQuantity("");
      setImportDate("");
      setExpiryDate("");
      
    } catch (error) {
      setMessage("❌ Lỗi khi thêm nguyên liệu");
    }
  };

  return (
    <div>
        <h2>Thêm nguyên liệu</h2>
        <form className="form" onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Tên nguyên liệu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />
        <input
        type="text"
        placeholder="Đơn vị"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        required
        />
        <input
            type="number"
            placeholder="Số lượng"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
        />
        <input
            type="date"
            placeholder="Ngày nhập"
            value={importDate}
            onChange={(e) => setImportDate(e.target.value)}
            required
        />
        <input
            type="date"
            placeholder="Hạn sử dụng"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
        />
        <button type="submit">Thêm</button>
        </form>
        {message && <p>{message}</p>}
    </div>
  );
}

export default IngredientForm;
