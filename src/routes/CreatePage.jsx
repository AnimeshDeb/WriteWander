import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Discuss'; // Corrected the import path

const CreatePage = () => {
    const [post, setPost] = useState({
        userID: '', // user ID to replace with authentication
        title: '',
        content: '',
        font: 'monospace'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // auth_token? implement authorization & authentication
                },
                body: JSON.stringify(post)
            });
            const data = await response.json();
            if (data.error) {
                console.error('Error creating post:', data.error);
            } else {
                console.log('Post created successfully:', data);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div>
            <div className="header"><h2>CREATE HTML</h2></div>
            <div className="navbar">
                <Link to="/search">Search</Link>
                <Link to="/discuss">Discuss</Link>
                <Link to="/">Home</Link>
                <Link to="/create">Create</Link>
                <Link to="/manage">Manage</Link>
                <Link to="/login">Login</Link>
            </div>
            <div className="create-root">
                <form onSubmit={handleSubmit} className="create-form">
                    <input type="text" name="title" placeholder="Enter title" value={post.title} onChange={handleChange} required />
                    <textarea name="content" placeholder="Enter content" value={post.content} onChange={handleChange} required></textarea>
                    <select name="font" value={post.font} onChange={handleChange}>
                        <option value="monospace">Monospace</option>
                        <option value="serif">Serif</option>
                        <option value="sans-serif">Sans-serif</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Century Gothic">Century Gothic</option>
                        <option value="Candara">Candara</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Lucida Sans">Lucida Sans</option>
                        <option value="Lucida Console">Lucida Console</option>
                        <option value="Arial">Arial</option>
                        <option value="Cambria">Cambria</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Tahoma">Tahoma</option>
                        <option value="Geneva">Geneva</option>
                        <option value="Impact">Impact</option>
                        <option value="fantasy">fantasy</option>
                    </select>
                    <input type="submit" value="Create Post" />
                </form>
            </div>
        </div>
    );
};

export default CreatePage;
