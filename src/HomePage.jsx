import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [recentPosts, setRecentPosts] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    
    useEffect(() => {
        const fetchPosts = async (endpoint) => {
            try {
                const response = await fetch(endpoint);
                if (!response.ok) {
                    console.error('Error fetching posts:', response.status);
                    return [];
                }
                const data = await response.json();
                console.log(data)
                return data;
            } catch (error) {
                console.error('Error fetching posts:', error);
                return [];
            }
        };

        const fetchRecent = async () => {
            const posts = await fetchPosts('/recent');
            setRecentPosts(posts);
            console.log(recentPosts)
        };

        const fetchPopular = async () => {
            const posts = await fetchPosts('/popular');
            setPopularPosts(posts);
            console.log(popularPosts)
        };

        fetchRecent();
        fetchPopular();

    }, [recentPosts, popularPosts]);
        
    return (
        <div>
            <div className="navbar">
            <Link to="/search">Search</Link>
            <Link to="/discuss">Discuss</Link>
            <Link to="/">Home</Link>
            <Link to="/create">Create</Link>
            <Link to="/manage">Manage</Link>
            <Link to="/login">Login</Link>
            </div>

            <div id="recent-posts">
                {recentPosts.map((post) => (
                <li key={post.id}>{post.title}</li>
                ))}
            </div>

            <div id="popular-posts">
                {popularPosts.map((post) => (
                <li key={post.id}></li>
                ))}
            </div>
        </div>
        );
    };
        

export default HomePage;