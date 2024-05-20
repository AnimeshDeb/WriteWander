import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './components/LogoutBtn';
import { useAuth } from './contexts/AuthContext';

export default function Discuss() {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsLoading(true);
        fetch('/discuss', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);  // Log the fetched data
            setPosts(data);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            setError("Failed to load posts.");
            setIsLoading(false);
        });
    }, []);

    console.log('Posts state:', posts);

    return (
        <div id="discuss-container">
            <div className="navbar">
                <Link to="/search">Search</Link>
                <Link to="/discuss">Discuss</Link>
                <Link to="/Home">Home</Link>
                <Link to="/create">Create</Link>
                <Link to="/manage">Manage</Link>
                <Link to="/login">Profile</Link>
                {currentUser ? (
                <LogoutButton className="logout" iconSize="yourIconSize" />
                ) : (
                <Link to="/login">Login</Link>
                )}
            </div>

            <div id="discuss-content">
                <div className="posts-column">
                    <h2>Blog Posts</h2>
                    {isLoading ? <p>Loading posts...</p> : error ? <p>{error}</p> : posts.map(post => (
                        <div key={post.id} className="post">
                            <Link to={`/posts/${post.id}`} className="post-link">
                                <h3>{post.title}</h3>
                            </Link>
                            <p>Author: {post.author}</p>
                            <p>Content: {post.content}</p>
                            <small>Views: {post.views}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
