import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Agents from './pages/Agents';
import AgentProfile from './pages/AgentProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import ServiceDetails from './pages/ServiceDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LoginCallback from './pages/LoginCallback';
import Dashboard from './pages/Dashboard';
import MyProperties from './pages/MyProperties';
import AddProperty from './pages/AddProperty';
import BlogManager from './pages/BlogManager';
import SavedProperties from './pages/SavedProperties';
import SavedPosts from './pages/SavedPosts';
import ProfileSettings from './pages/ProfileSettings';
import Leads from './pages/Leads';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Subscription from './pages/Subscription';
import ManagementRequests from './pages/ManagementRequests';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminLocations from './pages/AdminLocations';
import AdminReviews from './pages/AdminReviews';
import AdminBlog from './pages/AdminBlog';
import AdminPages from './pages/AdminPages';
import AdminServices from './pages/AdminServices';
import AdminPropertyManagement from './pages/AdminPropertyManagement';
// import AdminTransactions from './pages/AdminTransactions';
import ProtectedRoute from './components/ProtectedRoute';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="properties" element={<Properties />} />
            <Route path="properties/:slug" element={<PropertyDetails />} />
            <Route path="agents" element={<Agents />} />
            <Route path="agents/:id" element={<AgentProfile />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="services/:id" element={<ServiceDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="login/callback" element={<LoginCallback />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/management" element={<Navigate to="/dashboard/management" replace />} />
            <Route path="/blog-writing" element={<Navigate to="/dashboard/blog" replace />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<MyProperties />} />
              <Route path="properties/create" element={<AddProperty />} />
              <Route path="inquiries" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="management" element={<ManagementRequests />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="saved" element={<SavedProperties />} />
              <Route path="saved-posts" element={<SavedPosts />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="users" element={<Dashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute roles={['admin', 'super-admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="properties" element={<MyProperties />} />
                <Route path="locations" element={<AdminLocations />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="property-management" element={<AdminPropertyManagement />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
