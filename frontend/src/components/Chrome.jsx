import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      className={`back-to-top${show ? ' show' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
    >
      ↑
    </button>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      className="whatsapp-float"
      href="https://wa.me/923176572690?text=Hi%2C%20I%20have%20a%20question%20about%20your%20products"
      target="_blank"
      rel="noreferrer"
      title="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.6 6.32A8.86 8.86 0 0 0 12.05 4a8.94 8.94 0 0 0-7.74 13.4L3 21l3.7-1.27a8.93 8.93 0 0 0 4.34 1.1h.01a8.94 8.94 0 0 0 8.93-8.93 8.87 8.87 0 0 0-2.38-5.58zM12.05 19.4h-.01a7.4 7.4 0 0 1-3.77-1.03l-.27-.16-2.8.95.94-2.73-.18-.28A7.42 7.42 0 1 1 19.5 12a7.45 7.45 0 0 1-7.45 7.4zm4.06-5.56c-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.16-.48.05-.22-.11-.93-.34-1.78-1.1-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.4.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.21-.69-1.66-.18-.43-.37-.37-.5-.38h-.43c-.15 0-.39.05-.59.28-.2.22-.78.76-.78 1.86s.8 2.16.91 2.31c.11.15 1.57 2.4 3.81 3.36.53.23.95.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.31-.53 1.49-1.05.18-.51.18-.95.13-1.05-.05-.1-.2-.16-.42-.27z" />
      </svg>
    </a>
  );
}

export function CartToast() {
  const { toast } = useCart();
  return (
    <div className={`cart-toast${toast ? ' show' : ''}`}>
      {toast}
    </div>
  );
}
