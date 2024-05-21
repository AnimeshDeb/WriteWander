import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styling/UserPage.css'; // Add any additional styling you need
import Header from '../components/Header';
const UserPage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!currentUser) return;

            const postsRef = collection(db, 'Posts');
            const q = query(postsRef, where('userID', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);

            const userPosts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setPosts(userPosts);
        };

        const fetchUserData = async () => {
            if (!currentUser) return;

            const userDocRef = doc(db, 'Users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            }
        };

        fetchUserPosts();
        fetchUserData();
    }, [currentUser]);

    return (
        <div>
            <Header/>
            <div className="profile-root">
                <h1>User Profile Page</h1>
                {currentUser && userData && (
                    <>
                        <div className="profile-image-container">
                            {userData.pictureURL && (
                                <img src={userData.pictureURL} alt="Profile" className="profile-image" />
                            )}
                            <div className="user-info">
                                <p>Name: {currentUser.displayName}</p>
                                <p>Email: {currentUser.email}</p>
                            </div>
                        </div>
                    </>
                )}
                <h2>Your Posts</h2>
                <div className="user-posts">
                    {posts.map(post => (
                        <div key={post.id} className="post">
                            {post.imageUrl && (
                                <img src={post.imageUrl} alt={post.title} className="post-image" />
                            )}
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <small>Views: {post.views}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserPage;