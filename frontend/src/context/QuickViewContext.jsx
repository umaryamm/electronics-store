import { createContext, useContext, useState, useCallback } from 'react';

const QuickViewContext = createContext(null);

export function QuickViewProvider({ children }) {
  const [item, setItem] = useState(null); // { type: 'product' | 'project', data }

  const openProductQuickView = useCallback((product) => setItem({ type: 'product', data: product }), []);
  const openProjectQuickView = useCallback((project) => setItem({ type: 'project', data: project }), []);
  const close = useCallback(() => setItem(null), []);

  return (
    <QuickViewContext.Provider value={{ item, openProductQuickView, openProjectQuickView, close }}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  return useContext(QuickViewContext);
}
