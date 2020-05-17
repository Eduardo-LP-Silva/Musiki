import React, { Component } from "react";
import { ForceGraph2D } from "react-force-graph";
import "./graph.css";

class Graph extends Component {
  render() {
    return (
      <ForceGraph2D
        class="col-md-10"
        graphData={this.props.graphData}
        nodeLabel="id"
        linkLabel="link"
        width={1246}
        nodeCanvasObject={({ id, x, y }, ctx, globalScale) => {
          ctx.fillStyle = "rgba(255,255,255, 0.8)";
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
          ctx.fill();
        }}
      />
    );
  }
}

export default Graph;
