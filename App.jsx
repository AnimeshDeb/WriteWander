import { createBrowserRouter } from 'react-router-dom';
import AiChat from './src/routes/AiChat';
import UserLogin from './src/components/UserLogin';
import UserSignup from './src/components/UserSignup';
import { AuthProvider } from './src/contexts/AuthContext';
import Discuss from './src/routes/Discuss'; // Corrected the name and assuming it's a default export
import PostComments from './src/routes/PostComments';
import PostView from './src/routes/PostView';
import UserPage from './src/routes/UserPage';
import SearchPage from './src/routes/SearchPage';
import HomePage from './src/routes/HomePage';

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
    path:'/discuss',
    element:(
      <Discuss/>
    ),
  },
  {
    path:'/posts/:postId',
    element:(
      <PostComments/>
    ),
  },
  {
    path:'/PostView',
    element:(
      <PostView/>
    ),
  },
  {
    path:'/userpage',
    element:(
      <AuthProvider>
      <UserPage />
    </AuthProvider>
    ),
  },
  {
    path:'/',
    element:(
      <AuthProvider>
        <UserSignup />
      </AuthProvider>
    ),
  },
  {
    path:'/Search',
    element:(
      <SearchPage/>
    ),
  },
  {
    path:'/Home',
    element:(
      <HomePage/>
    ),
  },
  

]);
