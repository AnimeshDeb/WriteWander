import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import '../styling/CreatePage.css';
import Header from '../components/Header';
import AiChat from './AiChat';
const IMAGE_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

const fetchRandomImages = async () => {
    const response = await fetch(`https://api.unsplash.com/photos/random?count=2&client_id=${UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();
    return data;
};

const searchImages = async (query) => {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();
    return data.results.slice(0, 2); // Get only the first 2 results
};

const CreatePage = () => {
    const { currentUser } = useAuth();
    const [post, setPost] = useState({
        userID: currentUser ? currentUser.uid : '',
        title: '',
        content: '',
        font: 'monospace',
        author: '',
        imageUrl: '' // New field for selected image URL
    });
    const [randomImages, setRandomImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const images = await fetchRandomImages();
            setRandomImages(images);
        };

        fetchImages();
    }, []);

    const handleSearch = async () => {
        if (searchQuery.trim() === '') return;
        const results = await searchImages(searchQuery);
        setSearchResults(results);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPost({ ...post, [name]: value });
    };

    const handleImageSelect = (imageUrl) => {
        setSelectedImage(imageUrl);
        setPost({ ...post, imageUrl });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'Posts'), {
                ...post,
                userID: currentUser.uid,
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
                    <div className="image-selection">
                        <h3>Select an Image</h3>
                        <input 
                            type="text" 
                            placeholder="Search for images..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                        />
                        <button type="button" onClick={handleSearch}>Search</button>
                        <div className="image-grid">
                            {searchResults.length > 0 ? (
                                searchResults.map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.urls.small}
                                        alt={image.description}
                                        className={`image-thumbnail ${selectedImage === image.urls.small ? 'selected' : ''}`}
                                        onClick={() => handleImageSelect(image.urls.small)}
                                    />
                                ))
                            ) : (
                                randomImages.map((image) => (
                                    <img
                                        key={image.id}
                                        src={image.urls.small}
                                        alt={image.description}
                                        className={`image-thumbnail ${selectedImage === image.urls.small ? 'selected' : ''}`}
                                        onClick={() => handleImageSelect(image.urls.small)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                    <AiChat/>
                    <input type="submit" value="Create Post" />
                </form>
            </div>
        </div>
    );
};

export default CreatePage;