import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import DashBoard from './pages/DashBoard.jsx'
import OrderItem from './pages/OrderItem.jsx'
import OrderList from './pages/OrderList.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import MenuUser from './pages/MenuUser.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* <Route path="/" element={<DashBoard />} /> */}
        <Route path="/dashboard/:userId" element={<MenuUser />} />
        <Route path="/order-item" element={<OrderItem />} />
        <Route path="/order-list/:userId" element={<OrderList />} />
        <Route path="/admin-orders" element={<AdminOrders />} />
      </Routes>
    </Router>
  </StrictMode>
);