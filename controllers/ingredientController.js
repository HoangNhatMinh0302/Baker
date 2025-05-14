const pool = require("../db");

// Lấy danh sách nguyên liệu
exports.getIngredients = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM ingredients");
    res.json(rows);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nguyên liệu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm nguyên liệu mới
exports.createIngredient = async (req, res) => {
  try {
    const { name, unit, quantity, import_date, expiry_date } = req.body;
    console.log("Received body:", req.body);
    await pool.execute(
      "INSERT INTO ingredients (name, unit, quantity, import_date, expiry_date) VALUES (?, ?, ?, ?, ?)",
      [name, unit, quantity, import_date, expiry_date]
    );

    res.status(201).json({ message: "✅ Thêm nguyên liệu thành công" });
  } catch (error) {
    console.error("Lỗi khi thêm nguyên liệu:", error);
    res.status(500).json({ message: "❌ Lỗi server khi thêm nguyên liệu" });
  }
};

// Cập nhật nguyên liệu
exports.updateIngredient = async (req, res) => {
  try {
    const { name, unit, quantity, import_date, expiry_date } = req.body;
    const { id } = req.params;

    await pool.execute(
      "UPDATE ingredients SET name = ?, unit = ?, quantity = ?, import_date = ?, expiry_date = ? WHERE id = ?",
      [name, unit, quantity, import_date, expiry_date, id]
    );

    res.json({ message: "✅ Cập nhật nguyên liệu thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật nguyên liệu:", error);
    res.status(500).json({ message: "❌ Lỗi server khi cập nhật" });
  }
};

// Xóa nguyên liệu
exports.deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM ingredients WHERE id = ?", [id]);
    res.json({ message: "✅ Đã xóa nguyên liệu" });
  } catch (error) {
    console.error("Lỗi khi xóa nguyên liệu:", error);
    res.status(500).json({ message: "❌ Lỗi server khi xóa" });
  }
};


