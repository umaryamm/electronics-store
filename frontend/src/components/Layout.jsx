import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import QuickViewModal from './QuickViewModal';
import { BackToTop, WhatsAppFloat, CartToast } from './Chrome';

export default function Layout() {
  return (
    <>
      <Header />
      <main className="page-wrap">
        <Outlet />
      </main>
      <Footer />
      <QuickViewModal />
      <BackToTop />
      <WhatsAppFloat />
      <CartToast />
    </>
  );
}
