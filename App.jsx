import { createBrowserRouter } from 'react-router-dom';
import AiChat from './src/routes/AiChat';
import UserLogin from './src/routes/UserLogin';
import UserSignup from './src/routes/UserSignup';
import { AuthProvider } from './src/contexts/AuthContext';
import CreatePage from './src/routes/CreatePage';
import PrivateRoute from './src/contexts/PrivateRoute';
import Discuss from './src/routes/Discuss';
import PostComments from './src/components/PostComments';
import PostView from './src/components/PostView';
import UserPage from './src/routes/UserPage';
export const router = createBrowserRouter([
  {
    path: '/posts/:postId',
    element: <PostComments />,
  },
  {
    path: '/PostView',
    element: <PostView />,
  },
  {
    path: '/posts/:postId',
    element: (
      <AuthProvider>
        <PostComments />
      </AuthProvider>
    ),
  },
  {
    path: '/discuss',
    element: (
      <AuthProvider>
        <Discuss />
      </AuthProvider>
    ),
  },
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
    path: '/',
    element: (
      <AuthProvider>
        <UserSignup />
      </AuthProvider>
    ),
  },
  // {
  //   path: '/signup',
  //   element: (
  //     <AuthProvider>
  //       <UserSignup />
  //     </AuthProvider>
  //   ),
  // },
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
