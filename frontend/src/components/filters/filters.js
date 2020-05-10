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
            <div id="filters" style={{display: "visible"}}>
                <span>Search Filters</span>
                <label className="filter-container">
                    Albuns
                    <input id="albuns" name="filter" type="checkbox" value="albuns" onClick={(event) => this.props.callback(event.target)}/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container">
                    Genre
                    <input id="genre" name="filter" type="checkbox" value="genre"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container">
                    Awards
                    <input id="awards" name="filter" type="checkbox" value="awards"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container">
                    Members
                    <input id="members" name="filter" type="checkbox" value="members"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container">
                    Singles
                    <input id="singles" name="filter" type="checkbox" value="singles"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container">
                    Related Artists
                    <input id="related-artitsts" name="filter" type="checkbox" value="related-artitsts"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container">
                    Upcoming Projects
                    <input id="upcoming-projects" name="filter" type="checkbox" value="upcoming-projects"/>
                    <span className="filter-btn"></span>
                </label>
                <div className="filter-vertical-div"></div>
                <label className="filter-container">
                    Miscellaneous
                    <input id="misc" name="filter" type="checkbox" value="misc"/>
                    <span className="filter-btn"></span>
                </label>
            </div>
        );
    }

    setSearchFilter(event) {
    }
}

export default Filters;