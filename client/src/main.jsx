import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { SocketProvider } from './context/SocketContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
                borderRadius: '12px'
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' }
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' }
              }
            }}
          />
        </SocketProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);