import React from 'react'
import {Link} from 'react-router-dom'
import LogoutButton from './LogoutBtn'
export const Header=()=>{
    return(
        <>
        <div className="navbar">
                <Link to="/search">Search</Link>
                <Link to="/discuss">Discuss</Link>
                <Link to="/">Home</Link>
                <Link to="/create">Create</Link>
                <Link to="/userpage">Profile</Link>
                <LogoutButton/>
            </div>
        
        </>
    )
}