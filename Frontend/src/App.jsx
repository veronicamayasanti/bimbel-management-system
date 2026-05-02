import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import DashboardLayout from './components/DashboardLayout'
import Profile from './pages/Profile'
import DashboardHome from './pages/DashboardHome';
import UserManagement from './pages/UserManagement';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rute Bersarang (Nested Routes) untuk Dashboard */}
      <Route path="/dashboard" element={<DashboardLayout />}>

        {/* Konten Default saat baru masuk Dashboard */}
        <Route index element={<DashboardHome />} />

        {/* Nanti kita buat halaman Profil beneran di sini */}
        <Route path="profile" element={<Profile />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
    </Routes>
  )
}

export default App
