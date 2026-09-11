import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import GalleryPage from './pages/GalleryPage';
import JoinUs from './pages/JoinUs';
import JobDetail from './pages/JobDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/Admin/Login';
import ForgotPassword from './pages/Admin/ForgotPassword';
import ResetPassword from './pages/Admin/ResetPassword';
import Dashboard from './pages/Admin/Dashboard';
import Photos from './pages/Admin/Photos';
import Jobs from './pages/Admin/Jobs';
import Applications from './pages/Admin/Applications';
import Settings from './pages/Admin/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="join-us" element={<JoinUs />} />
        <Route path="job/:id" element={<JobDetail />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/reset-password" element={<ResetPassword />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/photos" element={<ProtectedRoute><Photos /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
      <Route path="/admin/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  );
}
