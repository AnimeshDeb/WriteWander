import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PostView = () => {
    const { post_id } = useParams();
    console.log('Post ID:', post_id); // Check if this logs the correct ID
    const [thePost, setThePost] = useState(null);
    
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/id/${post_id}`);
                if (!response.ok) {
                    console.error('Error fetching post:', response.status);
                    return;
                }
                const data = await response.json();
                setThePost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [post_id]);
        
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

            <div id="view-post">
                {thePost ? (
                    <div>
                        <h3>{thePost.title}</h3>
                        <p>{thePost.author}</p>
                        <p>{thePost.date}</p>
                        <p>{thePost.views}</p>
                        <p>{thePost.content}</p>
                    </div>
                ) : (
                    <p>Loading post...</p>
                )}
            </div>
        </div>
        );
    };
        
export default PostView;