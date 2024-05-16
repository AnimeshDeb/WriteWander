import { createBrowserRouter } from 'react-router-dom';
import AiChat from './src/routes/AiChat';
import UserLogin from './src/components/UserLogin';
import UserSignup from './src/components/UserSignup';
import { AuthProvider } from './src/contexts/AuthContext';
import HomePage from './src/routes/HomePage'
import UserPage from './src/routes/UserPage'; // Assuming UserPage is default export
import CreatePage from "./CreatePage";
import Discuss from './src/routes/Discuss'; // Corrected the name and assuming it's a default export
import PostComments from './src/routes/PostComments'; // Assuming PostComments is default export
import PostView from './src/routes/PostView';

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
    element: <UserPage />,
  },
  {
    path: '/discuss',
    element: <Discuss />,
  },
  {
    path: '/posts/:postId',
    element: <PostComments />, // Add the route for post comments
  },
  {
    path: '/Create',
    element: <CreatePage />,
  },
  {
    path: '/Home',
    element: <HomePage />,
  },
  {
    path: '/PostView',
    element: <PostView />,
  },
]);
