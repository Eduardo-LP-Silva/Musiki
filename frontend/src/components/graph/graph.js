import React, { Component } from "react";
import { ForceGraph2D } from "react-force-graph";
import "./graph.css";

const requests = require("../requests/requests");

class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredNode: null,
      nodeRelSize: 10,
      maxRadius: 30,
    };

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onNodeHover = this.onNodeHover.bind(this);
    this.onBackgroundClick = this.onBackgroundClick.bind(this);
    this.clickAnimation = this.clickAnimation.bind(this);
    this.styleNodes = this.styleNodes.bind(this);
    this.getNodeSize = this.getNodeSize.bind(this);
    this.getAbstract = this.getAbstract.bind(this);
    this.getImage = this.getImage.bind(this);
  }

  render() {
    return (
      <ForceGraph2D
        graphData={this.props.graphData}
        nodeLabel="id"
        nodeVal={(node) => this.getNodeSize(node) / this.state.nodeRelSize}
        nodeRelSize={this.state.nodeRelSize}
        linkColor={() => "rgba(255,255,255,0.7)"}
        linkLabel="link"
        width={window.innerWidth * 0.8}
        height={window.innerHeight * 0.7}
        onNodeClick={this.onNodeClick}
        onBackgroundClick={this.onBackgroundClick}
        onNodeHover={this.onNodeHover}
        nodeCanvasObject={this.styleNodes}
      />
    );
  }

  styleNodes(node, ctx, globalScale) {
    const label = node.id;
    const nodeSize = this.getNodeSize(node);
    const fontSize = Math.max(3, nodeSize / globalScale);
    const size =
      node === (this.state.hoveredNode || this.props.selectedNode) ? 0.75 : 0.7;
    const height =
      node === this.props.selectedNode
        ? node.y + nodeSize + 5
        : node.y + nodeSize;

    //Node design properties
    ctx.font = `${fontSize}px arial`;
    ctx.fillStyle =
      node === (this.state.hoveredNode || this.props.selectedNode)
        ? "white"
        : "rgba(255,255,255, 1)";
    ctx.shadowBlur = "1";
    ctx.shadowColor = "rgba(0, 0 ,0 , 0.25)";
    ctx.shadowOffsetX = "4";
    ctx.shadowOffsetY = "4";

    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeSize * size, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.shadowColor = "rgba(0, 0, 0, 0)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, node.x, height);

    ctx.save();

    //Click Animation
    this.clickAnimation(node, ctx, globalScale, nodeSize);
    window.requestAnimationFrame(this.clickAnimation);
  }

  getNodeSize(node) {
    if (node.parent === undefined || node.parent.childrenNo < 5)
      return this.state.nodeRelSize;
    else
      return Math.max(2, (this.state.nodeRelSize * 5) / node.parent.childrenNo);
  }

  clickAnimation(node, ctx, globalScale, nodeSize) {
    var time = new Date();
    const circle = 2 * Math.PI;
    let lineLength = (circle * nodeSize) / 5;
    let linesDistance = (circle * nodeSize - lineLength) / 5;

    if (node === this.props.selectedNode) {
      ctx.strokeStyle = "white";
      ctx.shadowColor = "rgba(0, 0, 0, 0)";
      ctx.shadowBlur = "1";
      ctx.shadowColor = "rgba(0, 0 ,0 , 0.25)";
      ctx.shadowOffsetX = "4";
      ctx.shadowOffsetY = "4";
      ctx.lineWidth = 3 / globalScale;

      ctx.setLineDash([lineLength, linesDistance]);
      ctx.translate(node.x, node.y);
      ctx.rotate(
        (circle / 6) * time.getSeconds() +
          (circle / 6000) * time.getMilliseconds()
      );
      ctx.translate(-node.x, -node.y);
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize + 1, 0, circle, false);
      ctx.stroke();
      window.requestAnimationFrame(this.clickAnimation);
      ctx.restore();
    }
  }

  getAbstract(node) {
    if (node && this.props.selectedNode !== node) {
      if (!node.hasOwnProperty("activeFilters")) node.activeFilters = [];

      requests.get(
        "values",
        {
          entities: node.searchId,
          properties: "dbo:abstract",
        },

        (result, status, state) => {
          if (status === 200) {
            let bindings = result.results.bindings;

            for (const binding of bindings) {
              let value = binding["dboabstract"]?.value;
              let lang =
                binding["dboabstract"] !== undefined
                  ? binding["dboabstract"]["xml:lang"]
                  : undefined;

              if (value !== undefined && lang !== undefined && lang === "en") {
                node.abstract = value;
                break;
              }
            }

            this.props.setSelectedNode(node);
          }
        }
      );
    }
  }

  getImage(node) {
    if (node && this.props.selectedNode !== node) {
      if (!node.hasOwnProperty("activeFilters")) node.activeFilters = [];

      requests.get(
        "values",
        {
          entities: node.id,
          properties: "dbo:thumbnail",
        },

        (result, status, state) => {
          if (status === 200) {
            let bindings = result.results.bindings;

            for (const binding of bindings) {
              let img = binding["dbothumbnail"]?.value;

              if (img !== undefined) {
                node.image = img;
                break;
              }
            }

            this.props.setSelectedNode(node);
          } else {
            node.image = undefined;
          }
        }
      );
    }
  }

  onNodeClick(node) {
    this.getAbstract(node);
    this.getImage(node);
  }

  onBackgroundClick() {
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
