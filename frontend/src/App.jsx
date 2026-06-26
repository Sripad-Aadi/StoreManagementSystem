// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StoreList from './pages/StoreList.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import AddUser from './pages/AddUser.jsx';
import AddStore from './pages/AddStore.jsx';
import UserList from './pages/UserList.jsx';
import StoreListAdmin from './pages/StoreListAdmin.jsx';
import ChangePassword from './pages/ChangePassword.jsx';

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/stores"
            element={
              <PrivateRoute allowedRoles={["user"]}>
                <StoreList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["owner"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-user"
            element={
              <PrivateRoute allowedRoles={["owner"]}>
                <AddUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-store"
            element={
              <PrivateRoute allowedRoles={["owner"]}>
                <AddStore />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={["owner"]}>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <PrivateRoute allowedRoles={["owner"]}>
                <StoreListAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <OwnerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <PrivateRoute allowedRoles={["user", "admin"]}>
                <ChangePassword />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
