import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import Profile from './pages/Profile'
import DashboardHome from './pages/DashboardHome';
import UserManagement from './pages/UserManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import BranchManagement from './pages/BranchManagement';
import ProgramManagement from './pages/ProgramManagement';
import LevelManagement from './pages/LevelManagement';
import StudentManagement from './pages/StudentManagement';
import TransactionManagement from './pages/TransactionManagement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rute Bersarang (Nested Routes) untuk Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>

        {/* Konten Default saat baru masuk Dashboard */}
        <Route index element={<DashboardHome />} />

        {/* Nanti kita buat halaman Profil beneran di sini */}
        <Route path="profile" element={<Profile />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="branches" element={<BranchManagement />} />
        <Route path="programs" element={<ProgramManagement />} />
        <Route path="levels" element={<LevelManagement />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="transactions" element={<TransactionManagement />} />
      </Route>
    </Routes>
  )
}

export default App
