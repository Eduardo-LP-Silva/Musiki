import React, { Component } from 'react';
import { Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '../../resources/icons/music.svg';
import { ReactComponent as Wikipedia } from '../../resources/icons/symbol.svg';
import './navbar.css';

/**
 *  Represents the top navbar component
 */
class Navbar extends Component {
    constructor(props) {
        super(props);

        this.selectNavbar = this.selectNavbar.bind(this);
        this.search = this.search.bind(this);
        this.checkEnter = this.checkEnter.bind(this);
    }

    render() {
        return (
            <nav id="navbar">
                <div id="search" >
                    <Logo className="Logo" height="50" width="50" />
                    <span id="musiki">Musiki</span>
                    <Row id="search-bar" onClick={this.selectNavbar} onKeyDown={this.checkEnter}>
                        <FontAwesomeIcon onClick={this.search} className="search-icon" icon={faSearch}/>
                        <input type="text" placeholder="Search ..." required/>
                    </Row>
                </div>
                <div id="wikipedia">
                    <span id="poweredWikipedia">Powered By <p><b>DBpedia</b></p></span>
                    <Wikipedia className="wikiLogo" height="45" width="45" />
                </div>
            </nav>
        );
    }

    /**
     *  Selects the search box
     */
    selectNavbar() {
        this.props.setSelectedNode({type: "none", id: "navbar", activeFilters: []});
    }
    
    /**
     *  Searches for the string in the search box
     */
    search() {
        const searchString = document.querySelector('#search-bar > input').value;

        this.props.search(searchString);
    }
   
    /**
     *  Checks for the enter key when writing
     */
    checkEnter(event) {
        if (event.keyCode === 13) {
            this.search();
        }
    }

}

export default Navbar;