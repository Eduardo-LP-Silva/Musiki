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
            maxBranches: 10, //Maybe pass this to selectedNode as well
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
        if(this.props.selectedNode.type === 'none') {
            this.setState({filters: ['artist', 'band', 'genre', 'album', 'single', 'song']}); //Initial search filters

            this.state.filters.forEach(filter => {
                if(filter === this.props.initialSearchFilter) {
                    document.getElementById(filter).checked = true;
                    return;
                }
            });
                     
            return;
        }
        
        if (this.props.nodeInfo !== undefined) {
            if (this.props.nodeInfo.hasOwnProperty(this.props.selectedNode.type)) {
                this.setState({ filters: this.props.nodeInfo[this.props.selectedNode.type] 
                    ? this.props.nodeInfo[this.props.selectedNode.type].filters.map(x => x.name) : [] });
                
                this.state.filters.forEach(filter => {
                    if(this.props.selectedNode.activeFilters.includes(filter))
                        document.getElementById(filter).checked = true;
                });                    
            }               
        }
    }

    renderFilters() {

        const filters = [];

        if (this.state.filters.length > 0)
            filters.push(<span className="filterBanner" key="filters-banner">Search Filters</span>);

        for (let i = 0; i < this.state.filters.length; i++) {
            const filter = this.state.filters[i][0].toUpperCase() + this.state.filters[i].slice(1);
            const hue = 206 + (i* (56/(this.state.filters.length)));

            filters.push(
                <label className="filter-container" key={this.state.filters[i]}>
                    {filter}
                    <input
                        id={this.state.filters[i]} 
                        name="filter" //name must be the same for radio buttons to work
                        type={this.props.selectedNode.type === 'none' ? 'radio' : 'checkbox'} //Initial search can only have one filter
                        value={this.state.filters[i]}
                        onChange={this.changeFilter}/>
                    <span className="filter-btn" style={{ backgroundColor : `hsl(${hue}, 90%, 61%)`}}></span>
                </label>
            );

            if (i !== this.state.filters.length - 1){
                filters.push(<div className="filter-vertical-div" key={`div#${i}`} style={{ backgroundColor : `hsl(${hue}, 90%, 61%)`}}></div>);
            }
            
        }

        return filters;
    }

    changeFilter(event) {
        if(event.target.checked === true) {
            if(this.props.selectedNode.type === 'none')
                this.props.setInitialSearchFilter(event.target.id);
            else
                this.addNodeFilter(event.target.id);
        }
        else
            if(this.props.selectedNode.type !== 'none') //Can't unselect radio button, can only select new one, so the condition above has already changed the initialSearch filter
                this.removeNodeFilter(event.target.id);
    }

    addNodeFilter(filter) {
        const sn = this.props.selectedNode;

        if(!sn.activeFilters.includes(filter)) {
            sn.activeFilters.push(filter);
            this.props.setSelectedNode(sn);

            this.props.addFilterNodes(filter);
        }
    }

    removeNodeFilter(filter) {
        const sn = this.props.selectedNode;

        if(sn.activeFilters.includes(filter)) {
            sn.activeFilters.splice(sn.activeFilters.indexOf(filter), 1);
            this.props.setSelectedNode(sn);

            this.props.removeFilterNodes(filter);
        }
    }

    setMaxBranches(event) {
        this.setState({ maxBranches: event.target.value });
    }
}

export default Settings;