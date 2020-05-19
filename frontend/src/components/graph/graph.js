import React, { Component } from "react";
import { ForceGraph2D } from "react-force-graph";
import "./graph.css";

class Graph extends Component {
  render() {
    return (
      <ForceGraph2D
        graphData={this.props.graphData}
        onNodeClick={this.props.onNodeClick}
        onNodeHover={this.props.onNodeHover}
        nodeLabel="id"
        linkColor={() => "rgba(255,255,255,0.7)"}
        linkLabel="link"
        width={window.innerWidth * 0.8}
        nodeCanvasObject={({ id, x, y }, ctx, globalScale) => {
          const label = id;
          const fontSize = 15 / globalScale;
          ctx.font = `${fontSize}px arial`;
          ctx.fillStyle = "rgba(255,255,255, 1)";
          ctx.shadowBlur = "1";
          ctx.shadowColor = "rgba(0, 0 ,0 , 0.25)";
          ctx.shadowOffsetX = "4";
          ctx.shadowOffsetY = "4";
          ctx.beginPath();
          ctx.arc(
            x,
            y,
            ctx.measureText(label).width * 0.6,
            0,
            2 * Math.PI,
            false
          );
          ctx.fill();
          ctx.fillStyle = "#808080";
          ctx.shadowColor = "rgba(0, 0, 0, 0)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(label, x, y);
        }}
      />
    );
  }
}

export default Graph;
