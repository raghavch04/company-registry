import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import 'animate.css';
import 'sweetalert2/dist/sweetalert2.min.css';



const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={clerkKey}>
    <App />
  </ClerkProvider>
);