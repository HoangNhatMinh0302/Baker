const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);
    res.json({ message: "✅ Đăng ký thành công" });
  } catch (err) {
    res.status(500).json({ message: "❌ Lỗi khi đăng ký" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [username]);
    const user = rows[0];
    if (!user) return res.status(401).json({ message: "❌ Tài khoản không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "❌ Sai mật khẩu" });

    const token = jwt.sign({ id: user.id }, "secret_key", { expiresIn: "1h" });
    res.json({ message: "✅ Đăng nhập thành công", token, userId: user.id });
  } catch (err) {
    res.status(500).json({ message: "❌ Lỗi khi đăng nhập" });
  }
};

exports.updateProfile = async (req, res) => {
    const userId = req.params.id;
    const { fullName, email, phone, address, position } = req.body;
    try {
      await db.execute(
        "UPDATE users SET fullName = ?, email = ?, phone = ?, address = ?, position = ? WHERE id = ?",
        [fullName, email, phone, address, position, userId]
      );
      res.json({ message: "Cập nhật thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi khi cập nhật" });
    }
  };
  
