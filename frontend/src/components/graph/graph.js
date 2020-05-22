import React, { Component } from "react";
import { ForceGraph2D } from "react-force-graph";
import "./graph.css";

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredNode: null,
      radius: null,
    };

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onNodeHover = this.onNodeHover.bind(this);
    this.onBackgroundClick = this.onBackgroundClick.bind(this);
    this.clickAnimation = this.clickAnimation.bind(this);
    this.styleNodes = this.styleNodes.bind(this);

  }

  render() {
    return (
      <ForceGraph2D
        graphData={this.props.graphData}
        nodeLabel="id"
        linkColor={() => "rgba(255,255,255,0.7)"}
        linkLabel="link"
        nodeRelSize={this.radius}
        width={window.innerWidth * 0.8}
        height= {window.innerHeight * 0.75}
        onNodeClick={this.onNodeClick}
        onBackgroundClick={this.onBackgroundClick}
        onNodeHover={this.onNodeHover}
        nodeCanvasObject={this.styleNodes}
      />
    );
  }

  

  styleNodes(node, ctx, globalScale) {

    const label = node.id;
    const fontSize = 15 / globalScale;
    const size =
      node === (this.state.hoveredNode || this.props.selectedNode) ? 0.75 : 0.7;
    
    const  rad = ctx.measureText(label).width;

    //Node design properties
    ctx.font = `${fontSize}px arial`;
    ctx.fillStyle =
      node === (this.state.hoveredNode || this.props.selectedNode)
        ? "white"
        : "rgba(255,255,255,0.8)";
    ctx.shadowBlur = "1";
    ctx.shadowColor = "rgba(0, 0 ,0 , 0.25)";
    ctx.shadowOffsetX = "4";
    ctx.shadowOffsetY = "4";

    this.radius = ctx.measureText(label).width * size;
    let commonRad = 10 * size;
  
    ctx.beginPath();
        
    if(rad > 30){
      ctx.arc(
        node.x,
        node.y,
        commonRad,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
  
      ctx.fillStyle = node === this.props.selectedNode ? "white" : "rgba(255,255,255,0.8)";
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, node.x, node.y + 16);
      ctx.save();
    }

    else {
      ctx.arc(
        node.x,
        node.y,
        this.radius,
        0,
        2 * Math.PI,
        false
      );
      ctx.fill();
  
      ctx.fillStyle = node === this.props.selectedNode ? "#595959" : "#808080";
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, node.x, node.y);
      ctx.save();
     
    }
   
    //Click Animation
    this.clickAnimation(node, ctx, label, size);
    window.requestAnimationFrame(this.clickAnimation);

  }

  clickAnimation(node, ctx, label, size) {

    var time = new Date();
   
    if (node === this.props.selectedNode) {
      ctx.strokeStyle = "white";
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.shadowBlur = "1";
      ctx.shadowColor = "rgba(0, 0 ,0 , 0.25)";
      ctx.shadowOffsetX = "4";
      ctx.shadowOffsetY = "4";
      ctx.lineWidth = 1;
      const  rad = ctx.measureText(label).width > 25 ? 10 : ctx.measureText(label).width * size;

      ctx.setLineDash([((2* Math.PI * rad)/5), ((2* Math.PI * rad)/5)]);
      ctx.translate(node.x, node.y);
      ctx.rotate(
        ((2 * Math.PI) / 6) * time.getSeconds() +
          ((2 * Math.PI) / 6000) * time.getMilliseconds()
      );
      ctx.translate(-node.x, -node.y);
      ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          rad + 2,
          0,
          2 * Math.PI,
          false
        );     
      ctx.stroke();
      window.requestAnimationFrame(this.clickAnimation);
      ctx.restore();
    }
  }

  onNodeClick(node) {
    console.log(node);
    if (node && this.props.selectedNode !== node) {
      if (!node.hasOwnProperty("activeFilters")) node.activeFilters = [];
    }
    this.props.setSelectedNode(node);
    //else maybe ?
  }

  onBackgroundClick(){

    let nullNode = { type: "none", id: "" };

    this.props.setSelectedNode(nullNode);
  }

  onNodeHover(node) {
    if (node) {
      this.setState({ hoveredNode: node });
    } else this.setState({ hoveredNode: null });
  }
}

export default Graph;
