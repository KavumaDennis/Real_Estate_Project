import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Agents from './pages/Agents';
import AgentProfile from './pages/AgentProfile';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyProperties from './pages/MyProperties';
import AddProperty from './pages/AddProperty';
import BlogManager from './pages/BlogManager';
import ProfileSettings from './pages/ProfileSettings';
import Leads from './pages/Leads';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Subscription from './pages/Subscription';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCategories from './pages/AdminCategories';
import AdminLocations from './pages/AdminLocations';
import AdminAmenities from './pages/AdminAmenities';
import AdminReviews from './pages/AdminReviews';
import AdminBlog from './pages/AdminBlog';
import AdminPages from './pages/AdminPages';
import AdminTransactions from './pages/AdminTransactions';
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
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="properties" element={<MyProperties />} />
              <Route path="properties/create" element={<AddProperty />} />
              <Route path="saved" element={<Dashboard />} />
              <Route path="inquiries" element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="subscription" element={<Subscription />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="users" element={<Dashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="properties" element={<MyProperties />} /> {/* Reuse MyProperties for now */}
              <Route path="categories" element={<AdminCategories />} />
              <Route path="locations" element={<AdminLocations />} />
              <Route path="amenities" element={<AdminAmenities />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="transactions" element={<AdminTransactions />} />

            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
