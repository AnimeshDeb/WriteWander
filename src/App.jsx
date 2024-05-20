import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./App.css";
import HomePage from "./HomePage";
import CreatePage from "./CreatePage";
import Discuss from "./Discuss";
import SearchPage from "./SearchPage";
import ManagePage from "./ManagePage";
import PostView from './PostView';
import PostComments from './PostComments';
import AiChat from './AiChat';
import { AuthProvider } from './contexts/AuthContext';
import UserLogin from './UserLogin';
import UserSignup from './UserSignup';
import UserPage from './UserPage';

// requires user login to access
function ProtectedRoutes() {
  return (
    <Switch>
      <Route path="/create" component={CreatePage} />
      <Route path="/discuss" component={Discuss} />
      <Route path="/manage" component={ManagePage} />
      <Route path="/id/:post_id/Comments" component={PostComments} />
      <Route path="/userpage" component={UserPage} />
    </Switch>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router> {/* Wrap your components with Router */}
        <div className="App">
          <div className="root">
            <Switch> {/* Use Switch to render only one route */}
              <AuthProvider>
                <ProtectedRoutes />
              </AuthProvider>
              <Route path="/" exact component={HomePage} />
              <Route path="/search" component={SearchPage} />
              <Route path="/id/:post_id" component={PostView} />
              <Route path="/id/:post_id/Comments" component={PostComments} />
              <Route path="/signup" component={UserSignup} />
              <Route path="/login" component={UserLogin} />
              <Route path="/AiChat" component={AiChat} />
            </Switch>
          </div>
        </div>
      </Router>
  </React.StrictMode>
);