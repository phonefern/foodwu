import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import OrderItem from './pages/OrderItem.jsx'
import OrderList from './pages/OrderList.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import MenuUser from './pages/MenuUser.jsx'
import AdminList from './pages/AdminList.jsx'
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
        <Route path="/admin-list/:userId" element={<AdminList />} />
        
      </Routes>
    </Router>
  </StrictMode>
);