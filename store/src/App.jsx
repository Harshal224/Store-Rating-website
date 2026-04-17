// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UpdatePassword from './pages/UpdatePassword';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddUser from './pages/AddUser';
import AddStore from './pages/AddStore';
import AdminStores from './pages/AdminStores';
import AdminUsers from './pages/AdminUsers';
import UserDetails from './pages/UserDetails';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path='/admin/users/:id' element={<UserDetails/>}></Route>
        <Route path='/admin/users' element={<AdminUsers/>}></Route>
        <Route path='/admin/stores' element={<AdminStores/>}></Route>
        <Route path='/admin/addstore' element={<AddStore/>}></Route>
        <Route path='/admin/adduser' element={<AddUser/>}></Route>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}></Route>
        <Route path='/owner/dashboard' element={<OwnerDashboard/>}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updatepassword" element={<UpdatePassword/>}></Route>
        {/* Add fallback 404 page if needed */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
