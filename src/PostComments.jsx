import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from './firebase'; // Correct path to firebase.js
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import LogoutButton from './components/LogoutBtn';
import { useAuth } from './contexts/AuthContext';

export default function PostComments() {
    const { currentUser } = useAuth();
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = useAuth();

    useEffect(() => {
        const fetchPostAndComments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const postDoc = await getDoc(doc(db, 'Posts', postId));
                if (postDoc.exists()) {
                    setPost({ id: postDoc.id, ...postDoc.data() });

                    const commentsSnapshot = await getDocs(collection(db, `Posts/${postId}/Comments`));
                    const commentsData = commentsSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setComments(commentsData);
                } else {
                    setError('Post not found.');
                }
            } catch (error) {
                console.error("Error fetching post and comments:", error);
                setError("Failed to load post and comments.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPostAndComments();
    }, [postId]);

    const handleCommentChange = (event) => {
        setCommentText(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!user) {
            setError("You must be logged in to post comments.");
            return;
        }
        if (!commentText.trim()) return;
        setIsLoading(true);
        setTimeout(() => {
            setComments([...comments, { id: comments.length + 1, text: commentText }]);
            setCommentText("");
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="post-comments-container">
            <div className="navbar">
                <Link to="/search">Search</Link>
                <Link to="/discuss">Discuss</Link>
                <Link to="/Home">Home</Link>
                <Link to="/create">Create</Link>
                <Link to="/manage">Manage</Link>
                {currentUser ? (
                    <LogoutButton className="yourClassName" iconSize="yourIconSize" />
                ) : (
                    <Link to="/login">Login</Link> 
                )}
            </div>
            {isLoading ? <p>Loading...</p> : error ? <p className="error-message">{error}</p> : (
                <>
                    {post && (
                        <div className="post">
                            <h2>{post.title}</h2>
                            <p>Author: {post.author}</p>
                            <p>{post.content}</p>
                            <small>Views: {post.views}</small>
                        </div>
                    )}
                    <div className="comments-section">
                        <h2>Comments</h2>
                        <ul className="comments-list">
                            {comments.map(comment => (
                                <li key={comment.id} className="comment-item">{comment.text}</li>
                            ))}
                        </ul>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                className="input-field"
                                value={commentText}
                                onChange={handleCommentChange}
                                placeholder="Add a comment"
                            />
                            <button type="submit" className="submit-button">Post Comment</button>
                        </form>
                        {!user && <p className="logged-out-message">You must be logged in to comment.</p>}
                    </div>
                </>
            )}
        </div>
    );
}
