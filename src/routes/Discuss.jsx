import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Correct path to firebase.js
import { collection, getDocs } from 'firebase/firestore';
import '../styling/Discuss.css';
import Header from '../components/Header'

const useAuth = () => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        // Simulate user authentication
        setTimeout(() => setUser({ name: "User123" }), 1000);
    }, []);
    return user;
};

export default function Discuss() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const querySnapshot = await getDocs(collection(db, 'Posts'));
                if (querySnapshot.empty) {
                    setError('No posts found.');
                } else {
                    const postsData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setPosts(postsData);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setError("Failed to load posts.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="discuss-container">
            <Header/>
            <div className="content">
                <div className="posts-column">
                    <h2>Blog Posts</h2>
                    {isLoading ? <p>Loading posts...</p> : error ? <p>{error}</p> : posts.map(post => (
                        <div key={post.id} className="post">
                            {post.imageUrl && (
                                <img src={post.imageUrl} alt={post.title} className="post-image" />
                            )}
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