import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // Jika tidak ada token, langsung arahkan ke halaman login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Jika token ada, tampilkan halaman yang diminta
    return children;
};

export default ProtectedRoute;
