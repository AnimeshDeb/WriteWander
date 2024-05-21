import React from 'react'
import {Link} from 'react-router-dom'
import LogoutButton from './LogoutBtn'
export default function Header(){
    return(
        <>
        <div className="navbar">
                <Link to="/discuss">Discuss</Link>
                <Link to="/create">Create</Link>
                <Link to="/userpage">Profile</Link>
                <LogoutButton/>
            </div>
        
        </>
    )
}