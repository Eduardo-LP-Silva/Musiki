import React, { Component } from 'react';
import { Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '../../resources/icons/music.svg';
import { ReactComponent as Wikipedia } from '../../resources/icons/symbol.svg';
import './navbar.css';

class Navbar extends Component {
    constructor(props) {
        super(props);

        this.selectNavbar = this.selectNavbar.bind(this);
        this.search = this.search.bind(this);
    }

    render() {
        return (
            <nav id="navbar">
                <div id="search" >
                    <Logo className="Logo" height="50" width="50" />
                    <span id="musiki">Musiki</span>
                    <Row id="search-bar" onClick={this.selectNavbar}>
                        <FontAwesomeIcon onClick={this.search} className="search-icon" icon={faSearch}/>
                        <input type="text" placeholder="Search ..." required/>
                    </Row>
                </div>
                <div id="wikipedia">
                    <span id="poweredWikipedia">Powered By <p><b>Wikipedia</b></p></span>
                    <Wikipedia className="wikiLogo" height="45" width="45" />
                </div>
            </nav>
        );
    }

    selectNavbar() {
        this.props.setSelectedNode({type: "none", id: "navbar", activeFilters: []});
    }

    search() {
        const searchString = document.querySelector('#search-bar > input').value;

        this.props.search(searchString);
    }

}

export default Navbar;