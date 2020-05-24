import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./components/navbar/navbar";
import Settings from "./components/settings/settings";
import Graph from "./components/graph/graph";
import ghost from "./resources/icons/ghost.svg"
import { StageSpinner } from "react-spinners-kit";
import "./App.css";

const requests = require("./components/requests/requests");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: 0,
      graphData: { nodes: [], links: [] },
      selectedNode: { type: "none", id: "", activeFilters: [] }, //when type = none, navbar is selected
      initialSearchFilter: "artist",
      groupIndex: 1,
      abstract: null,
      nodeInfo: undefined,
      loading: false,
      error: false,
    };

    this.toggleSettings = this.toggleSettings.bind(this);
    this.setSelectedNode = this.setSelectedNode.bind(this);
    this.search = this.search.bind(this);
    this.setInitialSearchFilter = this.setInitialSearchFilter.bind(this);
    this.addFilterNodes = this.addFilterNodes.bind(this);
    this.removeFilterNodes = this.removeFilterNodes.bind(this);
    this.changeAbstract = this.changeAbstract.bind(this);
  }

  render() {
    return (
      <div id="content">
        <Navbar search={this.search} setSelectedNode={this.setSelectedNode} />
        <Row className="additionalSection align-items-center">
          {this.state.loading ? (
            <React.Fragment>
              <Col className="justify-content-center">
                <StageSpinner
                  id="spinner"
                  size={30}
                  color="white"
                  loading={this.state.loading}
                />
              </Col>
              <Col xs={19}>
                <span className="logs">Searching, please wait</span>
              </Col>
            </React.Fragment>
          ) : (
            ""
          )}
          {this.state.error ? (
            <React.Fragment>
              <Col>
                <img
                  style={{ float: "right" }}
                  src={ghost}
                  height={55}
                  width={55}
                />
              </Col>
              <Col xs={7}>
                <span id="noResults">
                  <p id="bold">Whoops, no matches!</p>
                  <p>
                    We couldn't find any search results. Search something else.
                  </p>{" "}
                </span>
              </Col>
            </React.Fragment>
          ) : (
            ""
          )}
        </Row>
        <Row>
          <Col id="filterSection" md={2}>
            <Row className="settingsSection align-items-center">
              <Col md={2}>
                <FontAwesomeIcon
                  id="settings-icon"
                  icon={faCog}
                  onClick={this.toggleSettings}
                />
              </Col>
              <Col md={10}>
                <span
                  id="settings-span"
                  style={{ opacity: this.state.settings }}
                >
                  Settings
                </span>
              </Col>
            </Row>
            <Settings
              selectedNode={this.state.selectedNode}
              opacity={this.state.settings}
              nodeInfo={this.state.nodeInfo}
              initialSearchFilter={this.state.initialSearchFilter}
              setInitialSearchFilter={this.setInitialSearchFilter}
              setSelectedNode={this.setSelectedNode}
              addFilterNodes={this.addFilterNodes}
              removeFilterNodes={this.removeFilterNodes}
            />
          </Col>
          <Col md={10} className="justify-content-center">
            <Graph
              id="graph"
              graphData={this.state.graphData}
              selectedNode={this.state.selectedNode}
              setSelectedNode={this.setSelectedNode}
            />
          </Col>
        </Row>
        <Row className="align-items-center">
        {this.state.selectedNode.abstract !== undefined ? (
          <Col
            md={{ span: 8, offset: 2 }}
            className="descriptionSection justify-content-center pl-6"
          >
           
              <div id="descriptionDiv">
                <span className="description">{this.state.abstract}</span>
              </div> 
          </Col>) : (
              ""
           )}
           {this.state.selectedNode.image !== undefined ?
           <Col>
           <img id="nodeImage" src={this.state.selectedNode.image} />
           </Col> : ""
           }
        </Row>
      </div>
    );
  }

  componentDidMount() {
    requests.get("nodeInfo", undefined, (result) => {
      this.setState({ nodeInfo: result });
    });
  }

  changeAbstract(abstract) {
    let minimizedAbs = abstract.substr(0, abstract.indexOf(".", 300));
    minimizedAbs += ".";
    this.setState({ abstract: minimizedAbs });
  }

  search(searchString) {
    const nodes = this.state.graphData.nodes;
    const links = this.state.graphData.links;
    this.state.loading = true;
    nodes.splice(0, nodes.length);
    links.splice(0, links.length);

    this.setState({ graphData: { nodes: nodes, links: links } });

    requests.get(
      "search",
      { filter: this.state.initialSearchFilter, queryStr: searchString },
      (res, status) => {
        console.log(res);

        if (status === 200) {
          this.state.loading = false;
          this.addNode(res.id, res.type);
        }
      }
    );
  }

  addNode(id, type, filterName) {
    const parsedId = this.parseNodeId(id);

    let newNode = { id: parsedId, type: type, searchId: id };

    for (let i = 0; i < this.state.graphData.nodes.length; i++) {
      if (this.state.graphData.nodes[i].id === newNode.id) return;
    }

    if (this.state.selectedNode.type !== "none")
      newNode.parent = this.state.selectedNode;

    if (filterName !== undefined) {
      newNode.filterName = filterName;
    }

    this.setState({
      graphData: {
        nodes: this.state.graphData.nodes.concat([newNode]),
        links: this.state.graphData.links,
      },
    });
  }

  addLink(parentId, targetId) {
    targetId = this.parseNodeId(targetId);

    let link = { source: parentId, target: targetId, value: 1 };

    for (let i = 0; i < this.state.graphData.links.length; i++) {
      if (
        (this.state.graphData.links[i].source === parentId &&
          this.state.graphData.links[i].target === targetId) ||
        (this.state.graphData.links[i].target === parentId &&
          this.state.graphData.links[i].source === targetId)
      )
        return;
    }

    this.setState({
      graphData: {
        nodes: this.state.graphData.nodes,
        links: this.state.graphData.links.concat([link]),
      },
    });
  }

  addNodeChildren(parentId, childId, childType, filterName) {
    this.addNode(childId, childType, filterName);
    this.addLink(parentId, childId);
  }

  addFilterNodes(filter) {
    let filters = this.state.nodeInfo[this.state.selectedNode.type].filters;

    for (let i = 0; i < filters.length; i++) {
      if (filters[i].name.toUpperCase() === filter.toUpperCase()) {
        const originalFilter = filter;
        filter = filters[i];

        console.log(filter);

        if (!filter.reverse) {
          requests.get(
            "values",
            {
              entities: this.state.selectedNode.searchId,
              properties: filter.property,
            },
            (result, status, state) => {
              const { passedFilter, originalFilter } = state;
              let bindings = result.results.bindings;
              const sn = this.state.selectedNode;
              let nodeChildren =
                sn.childrenNo === undefined ? 0 : sn.childrenNo;

              for (const binding of bindings) {
                let link =
                  binding[passedFilter.property.replace(":", "")]?.value;

                if (link !== undefined) {
                  this.addNodeChildren(
                    this.state.selectedNode.id,
                    link.substr(link.lastIndexOf("/") + 1),
                    originalFilter.slice(0, originalFilter.length - 1),
                    passedFilter.name
                  );
                  nodeChildren++;
                }
              }

              sn.childrenNo = nodeChildren;
              this.setState({ selectedNode: sn });
            },
            { passedFilter: filter, originalFilter: originalFilter }
          );
        } else {
          requests.get(
            "entities",
            {
              value: `${this.state.selectedNode.searchId},${filter.property}`,
              ofilter: filter.validationKey,
            },
            (result, status, state) => {
              const { passedFilter, originalFilter } = state;
              let bindings = result.results.bindings;
              let added = [];
              const sn = this.state.selectedNode;
              let nodeChildren =
                sn.childrenNo === undefined ? 0 : sn.childrenNo;

              for (const binding of bindings) {
                let entityName = binding["entities"].value;
                entityName = entityName.substr(entityName.lastIndexOf("/") + 1);
                let link =
                  binding[passedFilter.validationKey.replace(":", "")]?.value;

                if (
                  !added.includes(entityName) &&
                  link !== undefined &&
                  link
                    .toUpperCase()
                    .includes(passedFilter.validationValue.toUpperCase())
                ) {
                  added.push(entityName);

                  this.addNodeChildren(
                    this.state.selectedNode.id,
                    entityName,
                    originalFilter.slice(0, originalFilter.length - 1),
                    passedFilter.name
                  );
                  nodeChildren++;
                }
              }

              sn.childrenNo = nodeChildren;
              this.setState({ selectedNode: sn });
            },
            { passedFilter: filter, originalFilter: originalFilter }
          );
        }

        return;
      }
    }
  }

  removeFilterNodes(filter) {
    let filterName = filter;
    let links = this.state.graphData.links;
    let selectedNode = this.state.selectedNode;

    const sn = this.state.selectedNode;
    let nodeChildren = sn.childrenNo;

    for (let i = 0; i < links.length; i++) {
      let link = links[i];

      if (
        link.source.id === selectedNode.id &&
        link.target.filterName.toUpperCase() === filterName.toUpperCase()
      ) {
        this.removeNode(link.target.id);

        links.splice(i, 1);
        i--;
        nodeChildren--;
      }
    }

    sn.childrenNo = nodeChildren;
    this.setState({ selectedNode: sn });

    this.setState({
      graphData: {
        nodes: this.state.graphData.nodes,
        links: links,
      },
    });
  }

  removeNode(id) {
    let nodes = this.state.graphData.nodes;

    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) {
        nodes.splice(i, 1);

        this.setState({
          graphData: {
            nodes: nodes,
            links: this.state.graphData.links,
          },
        });

        return;
      }
    }
  }

  parseNodeId(nodeId) {
    nodeId = nodeId.replace(/\([^)]+\)/g, "");
    nodeId = nodeId.replace(/_/g, " ");

    return nodeId;
  }

  setInitialSearchFilter(filter) {
    this.setState({ initialSearchFilter: filter });
  }

  setSelectedNode(node) {
    this.setState({ selectedNode: node });
    console.log(this.state.graphData.nodes);

    if (node.type !== "none" && this.state.selectedNode.abstract !== undefined)
      this.changeAbstract(this.state.selectedNode.abstract);
  }

  setSelectedNodeFilters(filters) {
    const sn = this.state.selectedNode;

    sn.filters = filters;

    this.setState({ selectedNode: sn });
  }

  toggleSettings() {
    this.setState({ settings: 1 - this.state.settings });
  }
}

export default App;
