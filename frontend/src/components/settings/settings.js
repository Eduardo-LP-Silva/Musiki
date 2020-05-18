import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './settings.css';

const requests = require('../requests/requests');

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: [],
            maxBranches: 10,
        };


        this.setMaxBranches = this.setMaxBranches.bind(this);
        this.setFilters = this.setFilters.bind(this);
        this.renderFilters = this.renderFilters.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
    }

    render() {
        return (
            <Form id="settings" style={{ opacity: this.props.opacity }}>
                <div id="filters">
                    {this.renderFilters()}
                </div>
                <Form.Group style={{ marginTop: "1.5em" }}>
                    {this.props.selectedNode.type !== "none" && this.props.selectedNode.type != null ?
                        <div>
                            <Form.Label style={{ fontWeight: "bold" }}>
                                Maximum Branch Number
                            </Form.Label>
                            <br />
                            <RangeSlider
                                min={1}
                                max={50}
                                variant="info"
                                value={this.state.maxBranches}
                                onChange={this.setMaxBranches}>
                            </RangeSlider>
                        </div> : ''}
                </Form.Group>
            </Form>
        );
    }

    componentDidMount() {
        this.setFilters();
    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedNode.type !== prevProps.selectedNode.type)
            this.setFilters();
    }

    setFilters() {
       
        console.log("Setting filters");

        if (this.props.nodeInfo !== undefined) {
            if (this.props.nodeInfo.hasOwnProperty(this.props.selectedNode.type)) {
                this.setState({ filters: this.props.nodeInfo[this.props.selectedNode.type] ? this.props.nodeInfo[this.props.selectedNode.type].filters.map(x => x.name) : [] });
            }
            else {
                console.log(`Unknow node type selected: ${this.props.selectedNode.type}`);
            }
        }
    }

    renderFilters() {
        const filters = [];

        if (this.state.filters.length > 0)
            filters.push(<span key="filters-banner">Search Filters</span>);

        for (let i = 0; i < this.state.filters.length; i++) {
            const filter = this.state.filters[i][0].toUpperCase() + this.state.filters[i].slice(1);

            filters.push(
                <label className="filter-container" key={this.state.filters[i]}>
                    {filter}
                    <input 
                        id={filter} 
                        name={filter} 
                        type="checkbox" 
                        value={filter}
                        checked={this.props.filters.has(this.props.selectedNode.id) 
                            && this.props.filters.get(this.props.selectedNode.id).includes(filter)} 
                        onChange={this.changeFilter} />
                    <span className="filter-btn"></span>
                </label>
            );

            if (i !== this.state.filters.length - 1)
                filters.push(<div className="filter-vertical-div" key={`div#${i}`}></div>);
        }

        return filters;
    }

    changeFilter(event) {
        if(event.target.checked === true)
            this.props.addFilter(event.target.name);
        else
            this.props.removeFilter(event.target.name);
    }

    setMaxBranches(event) {
        this.setState({ maxBranches: event.target.value });
    }
}

export default Settings;