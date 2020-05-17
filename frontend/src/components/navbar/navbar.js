import React, { Component } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '../../resources/icons/music.svg';
import { ReactComponent as Wikipedia } from '../../resources/icons/symbol.svg';
import './navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.search = this.search.bind(this);
    }

    render() {
        return (
            <nav id="navbar">
                <div id="search" >
                    <Logo className="Logo" height="50" width="50" />
                    <span id="musiki">Musiki</span>
                    <div id="search-bar">
                        <FontAwesomeIcon onClick={this.search} className="search-icon" icon={faSearch}/>
                        <input type="text" placeholder="Search ..." required/>
                    </div>
                </div>
                <div id="wikipedia">
                    <span id="poweredWikipedia">Powered By <p><b>Wikipedia</b></p></span>
                    <Wikipedia className="wikiLogo" height="45" width="45" />
                </div>
            </nav>
        );
    }

    search() {
        const searchString = document.querySelector('#search-bar > input').value;

        this.props.search(searchString);
    }

}

export default Navbar;