import React, { Component } from 'react';
import './filters.css';

class Filters extends Component {
    constructor(props) {
        super(props);

        this.state = {
            display: 'none'
        };

        this.setSearchFilter = this.setSearchFilter.bind(this);
    }
    
    render() {
        return (
            <form id="filters" style={{display: "visible"}}>
                <span>Search Filters</span>
                <label className="filter-container" htmlFor="albuns">
                    Albuns
                    <input id="albuns" name="filter" type="radio" value="albuns"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container" htmlFor="genre">
                    Genre
                    <input id="genre" name="filter" type="radio" value="genre"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container" htmlFor="awards">
                    Awards
                    <input id="awards" name="filter" type="radio" value="awards"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container" htmlFor="members">
                    Members
                    <input id="members" name="filter" type="radio" value="members"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container" htmlFor="singles">
                    Singles
                    <input id="singles" name="filter" type="radio" value="singles"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container" htmlFor="related-artitsts">
                    Related Artists
                    <input id="related-artitsts" name="filter" type="radio" value="related-artitsts"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container" htmlFor="upcoming-projects">
                    Upcoming Projects
                    <input id="upcoming-projects" name="filter" type="radio" value="upcoming-projects"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container" htmlFor="misc">
                    Miscellaneous
                    <input id="misc" name="filter" type="radio" value="misc"/>
                    <span className="filter-btn"></span>
                </label>
            </form>
        );
    }

    setSearchFilter(event) {
    }
}

export default Filters;