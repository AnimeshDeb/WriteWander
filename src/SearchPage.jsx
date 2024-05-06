import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [searchParams, setSearchParams] = useState({ author: '', title: '', id: '', by_views: false, by_date: false });

    const handleInputChange = (event) => {
      setSearchParams({
          ...searchParams,
          [event.target.id]: event.target.value
      });
    };

    const handleCheckboxChange = (event) => {
      setSearchParams({
          ...searchParams,
          by_views: event.target.checked
      });
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      const response = await fetch(`/search?author=${encodeURIComponent(searchParams.author)}&title=${encodeURIComponent(searchParams.title)}&id=${encodeURIComponent(searchParams.id)}&by_views=${encodeURIComponent(searchParams.by_views)}&by_date=${encodeURIComponent(searchParams.by_date)}`);
      if (!response.ok) {
        console.error('Error fetching posts:', response.status);
        return;
      }
      const data = await response.json();
      setAllPosts(data.posts);
    };

    useEffect(() => {
      const fetchPosts = async () => {
        const response = await fetch('/search');
        if (!response.ok) {
            console.error('Error fetching posts:', response.status);
            return;
        }
        const data = await response.json();
        setAllPosts(data.posts);
      };
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
            <Link to="/login">Login</Link>
            </div>
            <div id="search-root">
                <form id="searchForm" method="GET" onSubmit={handleSubmit}>
                    <label>Author:<input type="text" id="author" name="author" placeholder="Enter author" onChange={handleInputChange} /></label>
                    <label>Title:<input type="text" id="title" name="title" placeholder="Enter title" onChange={handleInputChange} /></label>
                    <label>Post ID:<input type="text" id="id" name="id" placeholder="Enter Post #" onChange={handleInputChange} /></label>
                    <label>By Popularity? <input type="checkbox" id="by_views" name="by_views" onChange={handleCheckboxChange} /></label>
                    <label>By Date? <input type="checkbox" id="by_date" name="by_date" /></label>
                    <input type="submit" value="Search"></input>
                </form>
            </div>
            <div id="all-posts">
                {allPosts.map((post) => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </div>
        </div>
        );
    };


export default SearchPage;