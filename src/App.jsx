import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import "./App.css";
import HomePage from "./HomePage";
import CreatePage from "./CreatePage";
import DiscussPage from "./DiscussPage";
import SearchPage from "./SearchPage";
import ManagePage from "./ManagePage";
import PostView from './PostView';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Router> {/* Wrap your components with Router */}
        <div className="App">
          <div className="root">
            <Switch> {/* Use Switch to render only one route */}
              <Route path="/" exact component={HomePage} />
              <Route path="/create" component={CreatePage} />
              <Route path="/discuss" component={DiscussPage} />
              <Route path="/search" component={SearchPage} />
              <Route path="/manage" component={ManagePage} />
              <Route path="/id/:post_id" component={PostView} />
            </Switch>
          </div>
        </div>
      </Router>
  </React.StrictMode>
);

