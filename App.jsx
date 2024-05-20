import { createBrowserRouter } from 'react-router-dom';
import AiChat from './src/routes/AiChat';
import UserLogin from './src/routes/UserLogin';
import UserSignup from './src/routes/UserSignup';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserPage } from './src/routes/UserPage';
import CreatePage from './src/routes/CreatePage';
import PrivateRoute from './src/contexts/PrivateRoute';
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
    path: '/userpage',
    element: (
      <AuthProvider>
        <PrivateRoute>
          <UserPage />
        </PrivateRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/Create',
    element: (
      <AuthProvider>
        <PrivateRoute>
          <CreatePage />
        </PrivateRoute>
      </AuthProvider>
    ),
  },
]);
