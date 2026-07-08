import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Projects from './pages/Projects';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Policies from './pages/Policies';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { QuickViewProvider } from './context/QuickViewContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <QuickViewProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/policies" element={<Policies />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<Home />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </QuickViewProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}