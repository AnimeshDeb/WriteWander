import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Inside your main React script in index.html
const App = () => {
  const [page, setPage] = React.useState('home');

  let content;
  if (page === 'create') {
    content = <CreatePage />;
  } else {
    // Your home page content or other components
    content = (
      <div>
        <h1>Welcome to Our WriteWander</h1>
        <p>This is a simple Blogging site!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h2>WriteWander</h2>
      </div>
      <div className="navbar">
        <a href="#home" onClick={() => setPage('home')}>Home</a>
        <a href="#create" onClick={() => setPage('create')}>Create</a>
        {/* ... other links */}
      </div>
      {content}
      {/* ... rest of your layout */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));