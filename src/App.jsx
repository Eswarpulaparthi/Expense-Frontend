import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup";
import GroupDetails from "./pages/GroupDetails";
import AddMember from "./pages/AddMember";
import SidebarLayout from "./components/SidebarLayout";

import { UserProviderWrapper } from "./components/UserProviderLayout";
import AddExpense from "./pages/AddExpense";
import GroupBalancePage from "./pages/Balance";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedLayout />}>
            <Route element={<UserProviderWrapper />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-group" element={<CreateGroup />} />
              <Route element={<SidebarLayout />}>
                <Route
                  path="/group/:id/balance"
                  element={<GroupBalancePage />}
                />
                <Route path="/group/add-member/:id" element={<AddMember />} />
                <Route path="/group/:id" element={<GroupDetails />} />
                <Route path="/group/:id/expense" element={<AddExpense />} />
              </Route>
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
