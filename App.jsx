import { createBrowserRouter } from 'react-router-dom';
import AiChat from './src/routes/AiChat';
import UserLogin from './src/components/UserLogin';
import UserSignup from './src/components/UserSignup';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserPage } from './src/routes/UserPage';
export const router = createBrowserRouter([
  {
    path: '/AiChat',
    element: <AiChat />,
  },
  {
    path: '/login',
    element: (
      <AuthProvider>
        <UserLogin />
      </AuthProvider>
    ),
  },
  {
    path: '/signup',
    element: (
      <AuthProvider>
        <UserSignup />
      </AuthProvider>
    ),
  },
  {
    path:'/userpage',
    element:(
      <UserPage/>
    ),
  },
]);
