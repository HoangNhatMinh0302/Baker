const express = require('express');
const router = express.Router();
const db = require('../db'); // Đảm bảo bạn import đúng kết nối DB

// Cập nhật thông tin tài khoản
router.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { fullName, phone, email, address, position } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ họ tên và email.' });
  }

  try {
    await db.query(
      'UPDATE users SET full_name = ?, phone = ?, email = ?, address = ?, position = ? WHERE id = ?',
      [fullName, phone, email, address, position, userId]
    );
    res.json({ message: '✅ Thông tin tài khoản đã được cập nhật' });
  } catch (err) {
    console.error('Lỗi cập nhật tài khoản:', err);
    res.status(500).json({ message: '❌ Lỗi cập nhật thông tin' });
  }
});

module.exports = router;
