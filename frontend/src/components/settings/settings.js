import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import './settings.css';

/**
 *  Represents the settings sidebar component
 */ 
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

  /**
   *  Sets the filter when component has loaded
   */ 
    componentDidMount() {
        this.setFilters();
    }

    /**
     *  Sets the filters when component updates
     */
    componentDidUpdate(prevProps) {
        if (this.props.selectedNode.type !== prevProps.selectedNode.type)
            this.setFilters();
    }

    /**
     *  Updates the filters
     */    
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
        
        if (this.props.nodeFilters !== null) {
            if (this.props.nodeFilters.hasOwnProperty(this.props.selectedNode.type)) {
                this.setState({ filters: this.props.nodeFilters[this.props.selectedNode.type]});
                
                this.state.filters.forEach(filter => {
                    if(this.props.selectedNode.activeFilters.includes(filter))
                        document.getElementById(filter).checked = true;
                });  
            }
            else
                this.setState({filters: []});               
        }
    }

    /**
     *  Renders the filter's check box
     */
    renderFilters() {

        const filters = [];

        if (this.state.filters.length > 0)
            filters.push(<span className="filterBanner" key="filters-banner">Search Filters</span>);

        for (let i = 0; i < this.state.filters.length; i++) {
            const filter = this.state.filters[i][0].toUpperCase() + this.state.filters[i].slice(1);
            let color;

            switch(this.state.filters[i]) {
                case 'artist':
                case 'artists':
                    color = 'rgba(247, 45, 45, 1)';
                    break;
                
                case 'band':
                case 'bands':
                    color = 'rgba(255, 170, 79, 1)';
                    break;

                case 'genre':
                case 'genres':
                    color = 'rgba(168, 252, 98, 1)';
                    break;

                case 'album':
                case 'albums':
                    color = 'rgba(106, 0, 255, 1)';
                    break;

                case 'single':
                case 'singles':
                    color = 'rgba(156, 51, 255, 1)';
                    break;

                case 'song':
                case 'songs':
                    color = 'rgba(209, 40, 172, 1)';
                    break;

                default:
                    color = 'rgba(255, 255, 255, 1)';
            }

            filters.push(
                <label className="filter-container" key={this.state.filters[i]}>
                    {filter}
                    <input
                        id={this.state.filters[i]} 
                        name="filter" //name must be the same for radio buttons to work
                        type={this.props.selectedNode.type === 'none' ? 'radio' : 'checkbox'} //Initial search can only have one filter
                        value={this.state.filters[i]}
                        onChange={this.changeFilter}
                        checked={this.props.selectedNode.type === 'none' ? 
                            this.props.initialSearchFilter === this.state.filters[i] : 
                            this.props.selectedNode.activeFilters.includes(this.state.filters[i])}/>
                    <span className="filter-btn" style={{ backgroundColor : color}}></span>
                </label>
            );

            if (i !== this.state.filters.length - 1){
                filters.push(<div className="filter-vertical-div" key={`div#${i}`} style={{ backgroundColor : color}}></div>);
            }
            
        }

        return filters;
    }
    
    /**
     *  Edits a filter
     */
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

    /**
     *  Adds a filter to the selected node
     */
    addNodeFilter(filter) {
        const sn = this.props.selectedNode;

        if(!sn.activeFilters.includes(filter)) {
            sn.activeFilters.push(filter);
            this.props.setSelectedNode(sn);

            this.props.addFilterNodes(filter);
        }
    }
    
    /**
     *  Removes a filter from the selected node
     */
    removeNodeFilter(filter) {
        const sn = this.props.selectedNode;

        if(sn.activeFilters.includes(filter)) {
            sn.activeFilters.splice(sn.activeFilters.indexOf(filter), 1);
            this.props.setSelectedNode(sn);

            this.props.removeFilterNodes(filter);
        }
    }

    /**
     *  Sets the maximum amount of branches
     */
    setMaxBranches(event) {
        this.setState({ maxBranches: event.target.value });
    }
}

export default Settings;