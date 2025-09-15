'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from '@/store';

export default function MainLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <div
            className={`flex-1 ${isOpen ? 'ml-64' : 'ml-14'} overflow-y-auto pl-6 bg-white`}
          >
            {children}
          </div>
        </PersistGate>
      </Provider>
    </div>
  );
}
