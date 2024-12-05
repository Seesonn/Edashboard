

import { useState, useEffect } from 'react'
import { Search, ShoppingCart, Package, Tag, Settings, LogOut, ChevronDown, Edit, Trash2, Upload, Plus, X, Check, DollarSign, Users } from 'lucide-react'
import "./dashboard.css"
const Sidebar = ({ activeItem, setActiveItem }) => (
  <aside className="sidebar">
    <div className="logo">
      <div className="logo-icon">A</div>
      <span className="logo-text">ANGST</span>
    </div>
    <nav className="nav">
      {['Dashboard', 'Orders', 'Products', 'Categories', 'Settings'].map((item) => (
        <button
          key={item}
          className={`nav-item ${activeItem === item ? 'active' : ''}`}
          onClick={() => setActiveItem(item)}
        >
          {item === 'Dashboard' && <div className="dashboard-icon"></div>}
          {item === 'Orders' && <ShoppingCart className="icon" size={20} />}
          {item === 'Products' && <Package className="icon" size={20} />}
          {item === 'Categories' && <Tag className="icon" size={20} />}
          {item === 'Settings' && <Settings className="icon" size={20} />}
          {item}
        </button>
      ))}
    </nav>
    <div className="logout">
      <button className="logout-button">
        <LogOut size={20} className="icon" />
        Log Out
      </button>
    </div>
  </aside>
)

const Header = ({ searchTerm, setSearchTerm }) => (
  <header className="header">
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Product"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <Search className="search-icon" size={20} />
    </div>
    <div className="user-profile">
      <img src="https://occ-0-2794-2219.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABbme8JMz4rEKFJhtzpOKWFJ_6qX-0y5wwWyYvBhWS0VKFLa289dZ5zvRBggmFVWVPL2AAYE8xevD4jjLZjWumNo.png?r=a41" alt="User Avatar" className="user-avatar" />
      <span className="user-name">ANGST</span>
      <ChevronDown size={20} className="chevron-down" />
    </div>
  </header>
)

const DashboardContent = ({ orders, products, categories }) => (
  <div className="container">
    <h3 className="section-title">Dashboard</h3>
    <div className="dashboard-stats">
      <div className="stat-card">
        <ShoppingCart size={24} className="stat-icon" />
        <div className="stat-content">
          <h4>Total Orders</h4>
          <p>{orders.length}</p>
        </div>
      </div>
      <div className="stat-card">
        <Package size={24} className="stat-icon" />
        <div className="stat-content">
          <h4>Total Products</h4>
          <p>{products.length}</p>
        </div>
      </div>
      <div className="stat-card">
        <Tag size={24} className="stat-icon" />
        <div className="stat-content">
          <h4>Total Categories</h4>
          <p>{categories.length}</p>
        </div>
      </div>
      <div className="stat-card">
        <DollarSign size={24} className="stat-icon" />
        <div className="stat-content">
          <h4>Total Revenue</h4>
          <p>Rs {orders.reduce((sum, order) => sum + parseInt(order.price.replace('Rs ', '')), 0)}</p>
        </div>
      </div>
    </div>
  </div>
)

const Orders = ({ orders }) => (
  <div className="container">
    <h3 className="section-title">Orders</h3>
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
            <th>Customer Name</th>
            <th>Customer Address</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                <div className="product-info">
                  <img src={order.image} alt={order.name} className="product-image" />
                  {order.name}
                </div>
              </td>
              <td>{order.date}</td>
              <td>{order.price}</td>
              <td>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>{order.customerName}</td>
              <td>{order.customerAddress}</td>
              <td>{order.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const Products = ({ products, setProducts, categories }) => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '', category: '', size: '', image: null })
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.size) return
    const newProductWithId = { ...newProduct, id: Date.now(), image: newProduct.image || '/placeholder.svg?height=40&width=40' }
    setProducts([...products, newProductWithId])
    setNewProduct({ name: '', price: '', stock: '', category: '', size: '', image: null })
    setIsAddingProduct(false)
  }

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product })
  }

  const handleUpdateProduct = () => {
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const handleImageUpload = (e, isNewProduct = true) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isNewProduct) {
          setNewProduct({ ...newProduct, image: reader.result })
        } else {
          setEditingProduct({ ...editingProduct, image: reader.result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container">
      <div className="header-actions">
        <h3 className="section-title">Products</h3>
        <button className="add-button" onClick={() => setIsAddingProduct(true)}>
          <Plus size={20} className="icon" />
          Add New Product
        </button>
      </div>
      {isAddingProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Add New Product</h4>
            <button className="close-button" onClick={() => setIsAddingProduct(false)}>
              <X size={20} />
            </button>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <input
                type="text"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              />
              <input
                type="text"
                placeholder="Size"
                value={newProduct.size}
                onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
              <div className="file-input">
                <label htmlFor="image-upload" className="file-label">
                  <Upload size={20} className="icon" />
                  Upload Image
                </label>
                <input
                  id="image-upload"
                  type="file"
                  onChange={(e) => handleImageUpload(e)}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </div>
            <button onClick={handleAddProduct} className="add-button">Add Product</button>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image} alt={product.name} className="product-image" />
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  ) : (
                    product.category
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                  ) : (
                    product.price
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td>
                  {editingProduct && editingProduct.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.size}
                      onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                    />
                  ) : (
                    product.size
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingProduct && editingProduct.id === product.id ? (
                      <>
                        <button onClick={handleUpdateProduct} className="edit-button">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingProduct(null)} className="delete-button">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditProduct(product)} className="edit-button">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Categories = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState({ name: '' })
  const [editingCategory, setEditingCategory] = useState(null)
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const handleAddCategory = () => {
    if (!newCategory.name) return
    setCategories([...categories, { ...newCategory, id: Date.now() }])
    setNewCategory({ name: '' })
    setIsAddingCategory(false)
  }

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category })
  }

  const handleUpdateCategory = () => {
    setCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c))
    setEditingCategory(null)
  }

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id))
  }

  return (
    <div className="container">
      <div className="header-actions">
        <h3 className="section-title">Categories</h3>
        <button className="add-button" onClick={() => setIsAddingCategory(true)}>
          <Plus size={20} className="icon" />
          Add New Category
        </button>
      </div>
      {isAddingCategory && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Add New Category</h4>
            <button className="close-button" onClick={() => setIsAddingCategory(false)}>
              <X size={20} />
            </button>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ name: e.target.value })}
              />
            </div>
            <button onClick={handleAddCategory} className="add-button">Add Category</button>
          </div>
        </div>
      )}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  {editingCategory && editingCategory.id === category.id ? (
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    />
                  ) : (
                    category.name
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingCategory && editingCategory.id === category.id ? (
                      <>
                        <button onClick={handleUpdateCategory} className="edit-button">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingCategory(null)} className="delete-button">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditCategory(category)} className="edit-button">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteCategory(category.id)} className="delete-button">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeItem, setActiveItem] = useState('Dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([
    { id: 1, name: 'T-Shirt', image: "https://via.placeholder.com/150/000000/FFFFFF?text=T-Shirt", category: 'Clothing', price: 'Rs 500', stock: 100, size: 'M' },
    { id: 2, name: 'Jeans', image: "https://via.placeholder.com/150/000000/FFFFFF?text=Jeans", category: 'Clothing', price: 'Rs 1000', stock: 50, size: '32' },
  ])
  const [categories, setCategories] = useState([
    { id: 1, name: 'Clothing' },
    { id: 2, name: 'Accessories' },
  ])
  const [orders, setOrders] = useState([
    { id: 1, name: 'Product A', image:"https://via.placeholder.com/150/000000/FFFFFF?text=Product", date: '2024-09-12', price: 'Rs 300', status: 'pending', customerName: 'Riyan Brai', customerAddress: 'jhapa , Morang', quantity: 2 },
    { id: 2, name: 'Product B', image:"https://via.placeholder.com/150/000000/FFFFFF?text=Product", date: '2024-09-12', price: 'Rs 130', status: 'shipped', customerName: 'Sabita limbu', customerAddress: 'Biratnagar , Morang', quantity: 1 },
    { id: 3, name: 'Product C', image:"https://via.placeholder.com/150/000000/FFFFFF?text=Product", date: '2024-09-12', price: 'Rs 330', status: 'pending', customerName: 'Sujan Bhattarai', customerAddress: 'Biratnagar , Morang', quantity: 1 },
    { id: 4, name: 'Product D', image:"https://via.placeholder.com/150/000000/FFFFFF?text=Product", date: '2024-09-12', price: 'Rs 330', status: 'delivered', customerName: 'jenisha Bhattarai', customerAddress: 'Gothgau , Morang', quantity: 4 },
  ])

  useEffect(() => {
    // Fetch or initialize products and categories if needed
  }, [])

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <DashboardContent orders={orders} products={products} categories={categories} />
      case 'Orders':
        return <Orders orders={orders} />
      case 'Products':
        return <Products products={products} setProducts={setProducts} categories={categories} />
      case 'Categories':
        return <Categories categories={categories} setCategories={setCategories} />
      default:
        return <div className="dashboard-content">Dashboard Content</div>
    }
  }

  return (
    <div className="dashboard">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="main-content">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}