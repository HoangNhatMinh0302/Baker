import React, { useEffect, useState } from "react";
import axios from "axios";

function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedUnit, setEditedUnit] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ingredients");
      setIngredients(res.data);
    } catch (err) {
      setMessage("❌ Lỗi khi tải danh sách nguyên liệu");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ingredients/${id}`);
      setMessage("✅ Đã xóa nguyên liệu");
      fetchIngredients();
    } catch (err) {
      setMessage("❌ Lỗi khi xóa nguyên liệu");
    }
  };

  const handleEdit = (ingredient) => {
    setEditId(ingredient.id);
    setEditedName(ingredient.name);
    setEditedUnit(ingredient.unit);
    setEditedQuantity(ingredient.quantity);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/ingredients/${editId}`, {
        name: editedName,
        unit: editedUnit,
        quantity: editedQuantity,
      });
      setMessage("✅ Cập nhật thành công");
      setEditId(null);
      fetchIngredients();
    } catch (err) {
      setMessage("❌ Lỗi khi cập nhật nguyên liệu");
    }
  };

  return (
    <div>
      <h2>Danh sách nguyên liệu</h2>
      {message && <p>{message}</p>}
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên</th>
            <th>Đơn vị</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <tr key={ingredient.id}>
              <td>{index + 1}</td>
              {editId === ingredient.id ? (
                <>
                  <td>
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      value={editedUnit}
                      onChange={(e) => setEditedUnit(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(e.target.value)}
                    />
                  </td>
                  <td>
                    <button onClick={handleUpdate}>Lưu</button>
                    <button onClick={() => setEditId(null)}>Hủy</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{ingredient.name}</td>
                  <td>{ingredient.unit}</td>
                  <td>{ingredient.quantity}</td>
                  <td>
                    <button onClick={() => handleEdit(ingredient)}>Sửa</button>
                    <button onClick={() => handleDelete(ingredient.id)}>Xóa</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IngredientList;
