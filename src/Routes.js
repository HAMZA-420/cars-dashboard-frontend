import React from 'react';

import Auth from './views/auth/auth';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './views/dashboard/dashboard';
import { useSelector } from 'react-redux';

const UserRoutes=()=>(
  <Routes>
   <Route path="/dashboard" element={<Dashboard />} />
   <Route path="*" element={<Dashboard />} />
  </Routes>
)

const AuthRoutes=()=>(
  <Routes>
     <Route path="/" element={<Auth />} />
     <Route path="*" element={<Auth />} />
  </Routes>
)

function AppRoutes() {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {
    user?UserRoutes():AuthRoutes()
     }
    </BrowserRouter>
  );
}

export default AppRoutes;


