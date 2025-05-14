import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";


function App() {
  const [ingredients, setIngredients] = useState([]);
  const [message, setMessage] = useState("");
  const [editId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedUnit, setEditedUnit] = useState("");
  const [editedQuantity, setEditedQuantity] = useState("");
  const [editedDistributor, setEditedDistributor] = useState("");
  const [editedImportDate, setEditedImportDate] = useState();
  const [editedExpiryDate, setEditedExpiryDate] = useState();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State theo dõi đăng nhập

  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    username: '',
    address: '',
    position: '',
  });
  const [setUserId] = useState(null);
  const [settingsTab] = useState("profile");
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?.userId;


  const [activeView, setActiveView] = useState("dashboard");

  const [exportItem, setExportItem] = useState({
    ingredientId: "",
    quantity: "",
    date: "",
    purpose: ""
  });
  const [exportMessage, setExportMessage] = useState("");
  const [showPrintOption, setShowPrintOption] = useState(false);  

  const [importItem, setImportItem] = useState({
    ingredientId: "",
    quantity: "",
    date: "",
    expiry_date: "",
    supplier: ""
  });
  const [importMessage, setImportMessage] = useState("");

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    unit: "",
    quantity: "",
    import_date: "",
    expiry_date: "",
    supplier: ""
  });
  const [newIngredientMessage, setNewIngredientMessage] = useState("");

  useEffect(() => {
    fetchIngredients();
    if (activeView === "account") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.userId) return;
      fetch(`/api/user/${user.userId}`)
        .then((res) => res.json())
        .then((data) => {
          setProfile({
            full_name: data.full_name || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            position: data.position || "",
          });
        });
    }
  }, [activeView, userId]);  

  const fetchIngredients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/ingredients");
      console.log(res.data); // <--- In ra để kiểm tra
      setIngredients(res.data);
    } catch (err) {
      setMessage("❌ Lỗi khi tải danh sách nguyên liệu");
    }
  };  

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setIsAuthenticated(true);
        setUserId(data.userId); // ✅ data được khai báo ở đây
        localStorage.setItem("userId", data.userId);  // Lưu userId vào localStorage
        console.log("Lưu userId:", data.userId); // Kiểm tra
        setMessage(data.message);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Lỗi khi xác thực:', error);
      setMessage('');
    }
  };
  

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setMessage("✅ Đã đăng xuất");
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;
    if (!userId) return alert("Không tìm thấy User ID");
  
    try {
      const res = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("✅ Cập nhật thành công");
        setIsEditing(false);
      } else {
        alert(data.message || "❌ Lỗi khi cập nhật");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      alert("❌ Không thể kết nối tới máy chủ");
    }
  };
  
  
  const handleExport = () => {
    const selected = ingredients.find((i) => i.id === parseInt(exportItem.ingredientId));
    if (!selected) {
      setExportMessage("Không tìm thấy nguyên liệu.");
      return;
    }
  
    const quantity = parseFloat(exportItem.quantity);
    //const expiryDate = new Date(selected.expiry_date);
    //const today = new Date();
  
    if (quantity > selected.quantity) {
      setExportMessage("❌ Số lượng xuất vượt quá tồn kho.");
      return;
    }
  
    // Trừ số lượng nguyên liệu
    const updatedIngredients = ingredients.map((i) =>
      i.id === selected.id
        ? { ...i, quantity: i.quantity - quantity }
        : i
    );
    setIngredients(updatedIngredients);
  
    setExportMessage("✅ Xuất kho thành công.");
    setShowPrintOption(true);
  
    // Reset form
    setExportItem({
      ingredientId: "",
      quantity: "",
      date: "",
      purpose: ""
    });
  };

  const handleImport = () => {
    const selected = ingredients.find((i) => i.id === parseInt(importItem.ingredientId));
    if (!selected) {
      setImportMessage("Không tìm thấy nguyên liệu.");
      return;
    }
  
    const quantity = parseFloat(importItem.quantity);
    if (quantity <= 0) {
      setImportMessage("❌ Số lượng phải lớn hơn 0.");
      return;
    }
  
    // Cộng thêm số lượng
    const updatedIngredients = ingredients.map((i) =>
      i.id === selected.id
        ? { ...i, quantity: i.quantity + quantity, import_date: importItem.date,expiry_date: importItem.expiry_date, supplier: importItem.supplier }
        : i
    );
    setIngredients(updatedIngredients);
  
    setImportMessage("✅ Nhập kho thành công.");
    setShowPrintOption(true);
  
    // Reset form
    setImportItem({
      ingredientId: "",
      quantity: "",
      date: "",
      expiry_date: "",
      supplier: ""
    });
  };
  
  const handleAddIngredient = () => {
    const { name, unit, supplier } = newIngredient;
  
    // Kiểm tra các trường bắt buộc (name, unit, quantity)
    if (!name || !unit) {
      setNewIngredientMessage("❌ Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    // Kiểm tra xem nguyên liệu đã tồn tại chưa
    if (ingredients.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      setNewIngredientMessage("❌ Nguyên liệu đã tồn tại.");
      return;
    }
  
    const newId = ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      name,
      unit,
      supplier: supplier || null // Nếu không có nhà phân phối, gán giá trị mặc định là rỗng
    };
  
    setIngredients([...ingredients, newItem]);
    setNewIngredientMessage("✅ Thêm nguyên liệu mới thành công!");
  
    // Reset form
    setNewIngredient({
      name: "",
      unit: "",
      supplier: ""
    });
  };
  
  

  return (
    <div className="app">
      <header className="header">
        Quản lý kho nguyên liệu
        {isAuthenticated && (
          <button className="logout-button" onClick={handleLogout}>
            Đăng xuất
          </button>
        )}
      </header>
  
      <div className="container">
        {isAuthenticated && (
          <aside className="sidebar">
            <ul>
              <li onClick={() => setActiveView("dashboard")}>🏠 Dashboard</li>
              <li onClick={() => setActiveView("ingredients")}>🍞 Nguyên liệu</li>
              <li onClick={() => setActiveView("import")}>⬆️ Nhập kho</li>
              <li onClick={() => setActiveView("export")}>⬇️ Xuất kho</li>
              <li onClick={() => setActiveView("report")}>📊 Báo cáo</li>
              <li onClick={() => setActiveView("account")}>👤 Tài khoản</li>
            </ul>
          </aside>
        )}
  
        <main className="main-content">
          {isAuthenticated ? (
            <>
              {activeView === "ingredients" && (
                <>  
                  <h2>Danh sách nguyên liệu</h2>
                  {message && <p className="message">{message}</p>}
  
                  <table>
                    <thead>
                      <tr>
                        <th>Mã nguyên liệu</th>
                        <th>Tên</th>
                        <th>Đơn vị</th>
                        <th>Số lượng</th>
                        <th>Nhà phân phối</th>
                        <th>Cảnh báo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map((ingredient, index) => {
                        const formatDate = (dateString) => {
                          if (!dateString) return "";
                          const date = new Date(dateString);
                          return date.toISOString().split('T')[0].replace(/-/g, '/');
                        };                      
                        const today = new Date();
                        const expiryDate = new Date(ingredient.expiry_date);
                        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

                        let warning = "";
                        if (ingredient.quantity < 5) {
                          warning += "Số lượng thấp. ";
                        }
                        

                        return (
                          <tr key={ingredient.id}>
                            <td>{index + 1}</td>
                            <td>
                              {editId === ingredient.id ? (
                                <input
                                  value={editedName}
                                  onChange={(e) => setEditedName(e.target.value)}
                                />
                              ) : (
                                ingredient.name
                              )}
                            </td>
                            <td>
                              {editId === ingredient.id ? (
                                <input
                                  value={editedUnit}
                                  onChange={(e) => setEditedUnit(e.target.value)}
                                />
                              ) : (
                                ingredient.unit
                              )}
                            </td>
                            <td>
                              {editId === ingredient.id ? (
                                <input
                                  type="number"
                                  value={editedQuantity}
                                  onChange={(e) => setEditedQuantity(e.target.value)}
                                />
                              ) : (
                                ingredient.quantity
                              )}
                            </td>
                            <td>
                              {editId === ingredient.id ? (
                                <input
                                  type="text"
                                  value={editedDistributor}
                                  onChange={(e) => setEditedDistributor(e.target.value)}
                                />
                              ) : (
                                ingredient.distributor
                              )}
                            </td>

                            <td style={{ color: warning ? "red" : "green" }}>
                              {warning || "✔️"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                </>
              )}
  
              {activeView === "dashboard" && <p>🏠 Đây là trang Dashboard</p>}

              {activeView === "import" && (
                <div>
                  <h2>⬆️ Nhập kho nguyên liệu</h2>

                  {importMessage && <p className="message">{importMessage}</p>}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleImport();
                    }}
                  >
                    <label>Nguyên liệu:</label>
                    <select
                      value={importItem.ingredientId}
                      onChange={(e) =>
                        setImportItem({ ...importItem, ingredientId: e.target.value })
                      }
                      required
                    >
                      <option value="">-- Chọn nguyên liệu --</option>
                      {ingredients.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    <label>Số lượng:</label>
                    <input
                      type="number"
                      value={importItem.quantity}
                      onChange={(e) =>
                        setImportItem({ ...importItem, quantity: e.target.value })
                      }
                      required
                    />

                    <label>Ngày nhập:</label>
                    <input
                      type="date"
                      value={importItem.date}
                      onChange={(e) =>
                        setImportItem({ ...importItem, date: e.target.value })
                      }
                      required
                    />

                    <label>Hạn sử dụng:</label>
                    <input
                      type="date"
                      value={importItem.expiry_date}
                      onChange={(e) =>
                        setImportItem({ ...importItem, expiry_date: e.target.value })
                      }
                    />

                    <label>Nhà phân phối:</label>
                    <input
                      type="text"
                      value={importItem.supplier}
                      onChange={(e) =>
                        setImportItem({ ...importItem, supplier: e.target.value })
                      }
                      required
                    />

                    <button type="submit">Xác nhận nhập kho</button>
                  </form>
                  <hr style={{ margin: "2rem 0" }} />
                    <h3>➕ Thêm nguyên liệu mới</h3>

                    {newIngredientMessage && <p className="message">{newIngredientMessage}</p>}

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddIngredient();
                      }}
                    >
                      <label>Tên nguyên liệu:</label>
                      <input
                        type="text"
                        value={newIngredient.name}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, name: e.target.value })
                        }
                        required
                      />

                      <label>Đơn vị:</label>
                      <input
                        type="text"
                        value={newIngredient.unit}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, unit: e.target.value })
                        }
                        required
                      />

                      <label>Nhà phân phối:</label>
                      <input
                        type="text"
                        value={newIngredient.supplier}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, supplier: e.target.value })
                        }
                        
                      />

                      <button type="submit">Thêm nguyên liệu</button>
                    </form>
                    {showPrintOption && (
                    <div>
                      <p>Bạn có muốn in phiếu nhập kho không?</p>
                      <button onClick={() => alert("In phiếu...")}>Có</button>
                      <button onClick={() => setShowPrintOption(false)}>Không</button>
                    </div>
                  )}

                </div>
              )}


              {activeView === "export" && (
                <div>
                  <h2>⬇️ Xuất kho nguyên liệu</h2>

                  {exportMessage && <p className="message">{exportMessage}</p>}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleExport();
                    }}
                  >
                    <label>Nguyên liệu:</label>
                    <select
                      value={exportItem.ingredientId}
                      onChange={(e) =>
                        setExportItem({ ...exportItem, ingredientId: e.target.value })
                      }
                      required
                    >
                      <option value="">-- Chọn nguyên liệu --</option>
                      {ingredients.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>

                    <label>Số lượng:</label>
                    <input
                      type="number"
                      value={exportItem.quantity}
                      onChange={(e) =>
                        setExportItem({ ...exportItem, quantity: e.target.value })
                      }
                      required
                    />

                    <label>Ngày xuất:</label>
                    <input
                      type="date"
                      value={exportItem.date}
                      onChange={(e) =>
                        setExportItem({ ...exportItem, date: e.target.value })
                      }
                      required
                    />

                    <label>Mục đích sử dụng:</label>
                    <input
                      type="text"
                      value={exportItem.purpose}
                      onChange={(e) =>
                        setExportItem({ ...exportItem, purpose: e.target.value })
                      }
                      required
                    />

                    <button type="submit">Xác nhận xuất kho</button>
                  </form>

                  {showPrintOption && (
                    <div>
                      <p>Bạn có muốn in phiếu xuất kho không?</p>
                      <button onClick={() => alert("In phiếu...")}>Có</button>
                      <button onClick={() => setShowPrintOption(false)}>Không</button>
                    </div>
                  )}
                </div>
              )}

              {activeView === "report" && <p>📊 Trang báo cáo</p>}

              {activeView === "account" && (
  <div className="p-4">
    <h2 className="text-xl font-semibold mb-2">👤 Thông tin tài khoản</h2>
    {!isEditing ? (
      <div className="space-y-2">
        <p><strong>Họ tên:</strong> {profile.full_name}</p>
        <p><strong>Số điện thoại:</strong> {profile.phone}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Địa chỉ:</strong> {profile.address}</p>
        <p><strong>Vị trí:</strong> {profile.position}</p>
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          ✏️ Chỉnh sửa
        </button>
      </div>
    ) : (
      <form onSubmit={handleUpdate} className="space-y-3 max-w-md">
        <input
          type="text"
          name="full_name"
          placeholder="Họ tên"
          value={profile.full_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          value={profile.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          value={profile.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="position"
          placeholder="Vị trí công việc"
          value={profile.position}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            💾 Lưu
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            ❌ Hủy
          </button>
        </div>
      </form>
    )}
  </div>
)}

            </>
          ) : (
            // Nếu chưa đăng nhập, hiển thị form đăng nhập/đăng ký
            <div className="auth-form">
              <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
              <form onSubmit={handleAuthSubmit}>
                <input
                  type="username"
                  placeholder="Username"
                  value={username||""}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  value={password||""}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
              </form>
              <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}  

export default App;