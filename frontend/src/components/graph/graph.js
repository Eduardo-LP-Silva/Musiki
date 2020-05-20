import React, { Component } from "react";
import { ForceGraph2D } from "react-force-graph";
import "./graph.css";

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredNode: null,
      radius: null
    };

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onNodeHover = this.onNodeHover.bind(this);
    this.styleNodes = this.styleNodes.bind(this);
  }

  render() {
    return (
      <ForceGraph2D
        graphData={this.props.graphData}
        nodeLabel="id"
        linkColor={() => "rgba(255,255,255,0.7)"}
        linkLabel="link"
        nodeRelSize = {this.radius}
        width={window.innerWidth * 0.8}
        onNodeClick={this.onNodeClick}
        onNodeHover={this.onNodeHover}
        nodeCanvasObject={this.styleNodes}
      />
    );
  }

  styleNodes(node, ctx, globalScale) {
    
    const label = node.id;
    const fontSize = 15 / globalScale;
    const size = node == (this.state.hoveredNode || this.props.selectedNode) ? 0.65 : 0.6;
   
    ctx.font = `${fontSize}px arial`;
    ctx.fillStyle = node == (this.state.hoveredNode || this.props.selectedNode) ? 'white' : 'rgba(255,255,255,0.8)';
    ctx.shadowBlur = "1";
    ctx.shadowColor = "rgba(0, 0 ,0 , 0.25)";
    ctx.shadowOffsetX = "4";
    ctx.shadowOffsetY = "4";

    this.radius = ctx.measureText(label).width * size;
    ctx.beginPath();
    ctx.arc(
      node.x,
      node.y,
      ctx.measureText(label).width * size,
      0,
      2 * Math.PI,
      false
    );
    ctx.fill();
    ctx.fillStyle = node === this.props.selectedNode ? '#595959' : "#808080";
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, node.x, node.y);
  }

  onNodeClick(node) {
    console.log(node);
    if(node && this.props.selectedNode !== node) {
      if(!node.hasOwnProperty('activeFilters'))
        node.activeFilters = [];
    }
      this.props.setSelectedNode(node);
    //else maybe ?
  }

  onNodeHover(node) {

    if(node) {
      this.setState({hoveredNode: node});
    }
    else
      this.setState({hoveredNode: null});
      
  }
}

export default Graph;
