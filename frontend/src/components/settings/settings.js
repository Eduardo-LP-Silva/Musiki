import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './settings.css';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: [],
            maxBranches: 10
        };

        this.setMaxBranches = this.setMaxBranches.bind(this);
        this.setFilters = this.setFilters.bind(this);
        this.renderFilters = this.renderFilters.bind(this);
    }

    render() {
        return (
            <Form id="settings" style={{ opacity: this.props.opacity }}>
                <div id="filters">
                    {this.renderFilters()}
                </div>
                <Form.Group style={{ marginTop: "1.5em" }}>
                    {this.props.selectedNodeType !== "none" && this.props.selectedNodeType != null ?
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
        if (this.props.selectedNodeType !== prevProps.selectedNodeType)
            this.setFilters();
    }

    setFilters() {
        switch (this.props.selectedNodeType) {
            case "none":
                this.setState({ filters: ['artist'] });
                break;

            default:
                console.log(`Unknow node type selected: ${this.props.selectedNodeType}`);
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
                    <input id={filter} name={filter} type="checkbox" value={filter} />
                    <span className="filter-btn"></span>
                </label>
            );

            if (i !== this.state.filters.length - 1)
                filters.push(<div className="filter-vertical-div" key={`div#${i}`}></div>);
        }

        return filters;
    }

    setMaxBranches(event) {
        this.setState({ maxBranches: event.target.value });
    }
}

export default Settings;