import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoutButton from './components/LogoutBtn';
import { useAuth } from './contexts/AuthContext';

const ManagePage = () => {
  const { currentUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/manage');
      if (!response.ok) {
        console.error('Error fetching posts:', response.status);
        return [];
      }
      const data = await response.json();
      setUserPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await fetch(`/delete/${postId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Refresh the posts after deleting
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="navbar">
        <Link to="/search">Search</Link>
        <Link to="/discuss">Discuss</Link>
        <Link to="/">Home</Link>
        <Link to="/create">Create</Link>
        <Link to="/manage">Manage</Link>
        {currentUser ? (
          <LogoutButton className="yourClassName" iconSize="yourIconSize" />
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      <div id="manage-root">
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post.id}>
              <div>{post.title}</div>
              <button onClick={() => deletePost(post.id)}>Delete</button>
              <Link to={`/edit/${post.id}`}>Edit</Link>
            </div>
        ))) : ( <p>No posts found.</p> )}
      </div>
    </div>
  );
};

export default ManagePage;