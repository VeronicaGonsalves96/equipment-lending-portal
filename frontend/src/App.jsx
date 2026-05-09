import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import EquipmentListPage from "./pages/EquipmentListPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import BorrowRequestPage from "./pages/BorrowRequestPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AuthBootstrap = ({ children }) => {
  const { fetchMe } = useAuth();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route
      path="/"
      element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/equipment"
      element={
        <PrivateRoute>
          <EquipmentListPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/equipment/:id"
      element={
        <PrivateRoute>
          <EquipmentDetailPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/borrow"
      element={
        <PrivateRoute>
          <BorrowRequestPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <PrivateRoute>
          <AdminPanelPage />
        </PrivateRoute>
      }
    />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <AuthBootstrap>
      <Navigation />
      <AppRoutes />
    </AuthBootstrap>
  </AuthProvider>
);

export default App;
