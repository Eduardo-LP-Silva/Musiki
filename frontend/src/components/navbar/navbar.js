import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './navbar.css';

class Navbar extends Component {
    render() {
        return (
            <nav id="navbar">
                <div id="search">
                    <FontAwesomeIcon className="music-icon" icon={faMusic}/>
                    <span id="musiki">Musiki</span>
                    <div id="search-bar">
                        <FontAwesomeIcon className="search-icon" icon={faSearch}/>
                        <input type="text" placeholder="Search" required/>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;