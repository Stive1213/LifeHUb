import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = localStorage.getItem('token');

  // If token exists, render the child routes (Outlet); otherwise, redirect to login
  return token ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;