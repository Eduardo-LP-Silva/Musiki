import React, { Component } from 'react';
import Filters from '../filters/filters';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './settings.css';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
          maxBranches: 10
        };

        this.setMaxBranches = this.setMaxBranches.bind(this);
    }

    render() {
        return (
            <Form id="settings" style={{opacity: this.props.opacity}}>
                <Filters callback={this.props.callback}/>
                <Form.Group style={{marginTop: "1.5em"}}>
                    <Form.Label style={{fontWeight: "bold"}}>
                        Maximum Branch Number
                    </Form.Label>
                    <br/>
                    <RangeSlider 
                        min={1}
                        max={50}
                        variant="info"
                        value={this.state.maxBranches}
                        onChange={this.setMaxBranches}>
                </RangeSlider>
                </Form.Group>
            </Form>
        );
    }

    setMaxBranches(event) {
        this.setState({maxBranches: event.target.value});
    }
}

export default Settings;