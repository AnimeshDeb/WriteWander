import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import '../styling/CreatePage.css';
import { Header } from '../components/Header';
const CreatePage = () => {
    const { currentUser } = useAuth();
    const [post, setPost] = useState({
        userID: currentUser ? currentUser.uid : '', // Set user ID from authentication context
        title: '',
        content: '',
        font: 'monospace',
        author: '' // Add author field
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'Posts'), {
                ...post,
                userID: currentUser.uid, // Ensure the user ID is included
                date: new Date().toISOString(),
                views: 0
            });
            console.log('Post created successfully');
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <Header/>
            <div className="create-root">
                <form className="create-form" onSubmit={handleSubmit}>
                    <input type="text" name="author" placeholder="Enter author name" value={post.author} onChange={handleChange} />
                    <input type="text" name="title" placeholder="Enter title" value={post.title} onChange={handleChange} />
                    <textarea name="content" placeholder="Enter content" value={post.content} onChange={handleChange}></textarea>
                    <select name="font" value={post.font} onChange={handleChange}>
                        <option value="monospace">Monospace</option>
                        <option value="serif">Serif</option>
                        <option value="sans-serif">Sans-serif</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Arial">Arial</option>
                        <option value="Cambria">Cambria</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Geneva">Geneva</option>
                        <option value="Impact">Impact</option>
                        <option value="fantasy">fantasy</option>
                        <option value="cursive">cursive</option>
                    </select>
                    <input type="submit" value="Create Post" />
                </form>
            </div>
        </div>
    );
};

export default CreatePage;