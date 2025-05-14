const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredientController");

// Route để thêm nguyên liệu mới
router.post("/", ingredientController.createIngredient);

// Route để xóa nguyên liệu
router.delete("/:id", ingredientController.deleteIngredient);


// Route để lấy danh sách nguyên liệu
router.get("/", ingredientController.getIngredients);

// Router để update nguyên liệu
router.put("/:id", ingredientController.updateIngredient);

module.exports = router;
