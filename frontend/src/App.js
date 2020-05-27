import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./components/navbar/navbar";
import Settings from "./components/settings/settings";
import Graph from "./components/graph/graph";
import ghost from "./resources/icons/ghost.svg";
import { StageSpinner } from "react-spinners-kit";
import "./App.css";

const requests = require("./components/requests/requests");

const childLimit = 30;


/**
 *  Main component of react
 */
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

  
/**
 *  Display components
 */
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
                  alt="error"
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
            </Col>
          ) : (
            ""
          )}
          {this.state.selectedNode.image !== undefined ? (
            <Col>
              <img
                alt="node"
                id="nodeImage"
                src={this.state.selectedNode.image}
              />
            </Col>
          ) : (
            ""
          )}
        </Row>
      </div>
    );
  }

  /**
   *  Get nodeInfo object from back-end to identify nodes
   */ 
  componentDidMount() {
    requests.get("nodeInfo", undefined, (result) => {
      this.setState({ nodeInfo: result });
    });
  }

  /**
   *  Change current selected node's abstracc
   */ 
  changeAbstract(abstract) {
      let minimizedAbs = abstract.substr(0, abstract.indexOf(".", 300));
      minimizedAbs += ".";
      this.setState({ abstract: minimizedAbs });

  }

  /**
   *  Search for an entity from the search bar
   */   
  search(searchString) {
    const nodes = this.state.graphData.nodes;
    const links = this.state.graphData.links;
    this.setState({ loading: true });
    this.setState({ error: false});
    nodes.splice(0, nodes.length);
    links.splice(0, links.length);

    this.setState({ graphData: { nodes: nodes, links: links } });

    requests.get(
      "search",
      { filter: this.state.initialSearchFilter, queryStr: searchString },
      (res, status) => {
        if (status === 200) {
          this.setState({ loading: false });
          this.addNode(res.id, res.type);
        }

        if (status === 404) {
          this.setState({ loading: false});
          this.setState({ error : true});
        }
      }
    );
  }

  /**
   *  Adds a node to the graph
   */ 
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

  /**
   *  Adds a link/edge to the graph
   */ 
  addLink(parentId, targetId) {
    targetId = this.parseNodeId(targetId);

    let link = { source: parentId, target: targetId, value: 1 };

    for (let i = 0; i < this.state.graphData.links.length; i++) {
      if (
        (this.state.graphData.links[i].source.id === parentId &&
          this.state.graphData.links[i].target.id === targetId) ||
        (this.state.graphData.links[i].target.id === parentId &&
          this.state.graphData.links[i].source.id === targetId)
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

  /**
   *  Adds a child node to the graph
   */ 
  addNodeChildren(parentId, childId, childType, filterName) {
    this.addNode(childId, childType, filterName);
    this.addLink(parentId, childId);
  }

  /**
   *  Add node children from selected filter
   */ 
  addFilterNodes(filter) {
    let filters = this.state.nodeInfo[this.state.selectedNode.type].filters;
    this.setState({ error: false, loading: true});

    for (let i = 0; i < filters.length; i++) {
      if (filters[i].name.toUpperCase() === filter.toUpperCase()) {
        const originalFilter = filter;
        filter = filters[i];

        if (!filter.reverse) {

          requests.get(
            "values",
            {
              entities: this.state.selectedNode.searchId,
              properties: filter.property,
            },
            (result, status, state) => {

              if (status === 400) {
                this.setState({ loading: false});
                this.setState({ error : true});
                return;
              }

              if (result === undefined || result.results === undefined || result.results.bindings === undefined 
                || result.results.bindings.length < 1) {
                this.setState({ error: true});
                return;
              } 

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

                if (nodeChildren === childLimit)
                  break;
              }

              if(nodeChildren !== childLimit && !this.addedNodes(sn.childrenNo, nodeChildren))
                this.setState({ error: true});
              else {
                sn.childrenNo = nodeChildren;
                this.setState({ selectedNode: sn });
              }
            
              this.setState({ loading: false});

            },
            { passedFilter: filter, originalFilter: originalFilter }, () => {
              this.setState({ loading: false});
            }
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

              if (status === 400) {
                this.setState({ loading: false});
                this.setState({ error : true});
                return;
              }

              if (result === undefined || result.results === undefined || result.results.bindings === undefined 
                || result.results.bindings.length < 1) {
                this.setState({ error: true});
              } else {
                let bindings = result.results.bindings;
                let added = [];
                const sn = this.state.selectedNode;
                let nodeChildren =
                  sn.childrenNo === undefined ? 0 : sn.childrenNo;

                for (const binding of bindings) {
                  let entityName = binding["entities"].value;
                  entityName = entityName.substr(
                    entityName.lastIndexOf("/") + 1
                  );
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

                  if (nodeChildren === childLimit)
                    break;
                }

                if(nodeChildren !== childLimit && !this.addedNodes(sn.childrenNo, nodeChildren))
                  this.setState({ error: true});
                else {
                  sn.childrenNo = nodeChildren;
                  this.setState({ selectedNode: sn });
                }

                this.setState({ loading: false});
              }
            },
            { passedFilter: filter, originalFilter: originalFilter }, () => {
              this.setState({ loading: false});
            }
          );
        }

        return;
      }
    }
  }
 
  /**
   *  Checks if child nodes where added
   */ 
  addedNodes(previousChildrenNo, newChildrenNo) {
    return (previousChildrenNo === undefined && newChildrenNo > 0) || previousChildrenNo < newChildrenNo;
  }

  /**
   *  Removes a filter from a node
   */   
  removeFilterNodes(filter, origin) {
    // Variable depicting whether the function call is the entry point of the recursive call or not
    let topMostCall = false;

    let filterName = filter;
    let links = this.state.graphData.links;

    if (origin === undefined) {
      topMostCall = true;
      origin = this.state.selectedNode;
    }

    let nodeChildren = origin.childrenNo;

    for (let i = 0; i < links.length; i++) {
      let link = links[i];

      if (
        link.source.id === origin.id &&
        (filterName === undefined ||
          filterName === null ||
          (link.target.filterName !== undefined && link.target.filterName.toUpperCase() === filterName.toUpperCase()))
      ) {
        if (links.find((x) => x.source.id === link.target.id) !== undefined) {
          this.removeFilterNodes(undefined, link.target);
        } else {
          console.log("Didn't continue on " + link.target.id);
        }
        this.removeNode(link.target.id);

        nodeChildren--;
      }
    }

    origin.childrenNo = nodeChildren;
    if (topMostCall) this.setState({ selectedNode: origin });

    if (topMostCall) this.removeUselessLinks();

    if(this.state.error)
      this.setState({error: false});
  }
 
  /**
   *  Removes a node from the graph
   */ 
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

  /**
   *  Remove links from or to non-existent nodes
   */ 
  removeUselessLinks() {
    let links = this.state.graphData.links;
    let nodeNames = this.state.graphData.nodes.map((x) => x.id);

    for (let i = 0; i < links.length; i++) {
      let link = links[i];

      if (
        !nodeNames.includes(link.source.id) ||
        !nodeNames.includes(link.target.id)
      ) {
        links.splice(i, 1);
        i--;
      }
    }
  }
 
  /**
   *  Parses the node's id
   */ 
  parseNodeId(nodeId) {
    nodeId = nodeId.replace(/\([^)]+\)/g, "");
    nodeId = nodeId.replace(/_/g, " ");

    return nodeId;
  }

  /**
   *  Sets the inicial search's filter
   */ 
  setInitialSearchFilter(filter) {
    this.setState({ initialSearchFilter: filter });
  }

  /**
   *  Sets state to update the selected node
   */ 
  setSelectedNode(node) {
    this.setState({ selectedNode: node });

    if (node.type !== "none" && this.state.selectedNode.abstract !== undefined)
      this.changeAbstract(this.state.selectedNode.abstract);
  }

  /**
   *  Add filter to selectedNode object
   */ 
  setSelectedNodeFilters(filters) {
    const sn = this.state.selectedNode;

    sn.filters = filters;

    this.setState({ selectedNode: sn });
  }

  /**
   *  Toggles the settings sidebar
   */ 
  toggleSettings() {
    this.setState({ settings: 1 - this.state.settings });
  }
}

export default App;
