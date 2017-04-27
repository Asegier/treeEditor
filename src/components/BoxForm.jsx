import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { getLink } from '../api/api';
// import { idURL } from '../actions/actions';
// import fire from '../fire'
import Tree from 'react-ui-tree'
import { flatten } from './utils';

class BoxForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            errors: [],
            branchTree: [],
            branches: [{
                id: "1",
                parentID: "",
                name: "ONE",
                from: "left",
                to: "right",
                message: "",
                listen: ""
            },{
                id: "2",
                parentID: "1",
                name: "TWO",
                from: "right",
                to: "right",
                message: "",
                listen: ""

            },{
                id: "3",
                parentID: "2",
                name: "THREE",
                from: "",
                to: "",
                message: "",
                listen: ""
            },{
                id: "4",
                parentID: "1",
                name: "FOUR",
                from: "",
                to: "",
                message: "",
                listen: ""
            }]


        }



    }

    componentWillMount = () => {


        var idToNodeMap = {}; //Keeps track of nodes using id as key, for fast lookup
        var root = null; //Initially set our loop to null

        //loop over data
        this.state.branches.forEach(function(datum) {

            //each node will have children, so let's give it a "children" poperty
            datum.children = [];

            //add an entry for this node to the map so that any future children can
            //lookup the parent
            idToNodeMap[datum.id] = datum;

            //Does this node have a parent?
            if(!datum.parentID) {
                //Doesn't look like it, so this node is the root of the tree
                root = datum;
            } else {
                //This node has a parent, so let's look it up using the id
                let parentNode = idToNodeMap[datum.parentID];

                //We don't need this property, so let's delete it.
                //delete datum.parentAreaRef;

                //Let's add the current node as a child of the parent node.
                parentNode.children.push(datum);
            }
        });

        console.log('Tree:', root);
        this.setState({branchTree: root});

    }



    handleName = (e) => {



    };
    handleFrom = (e) => {


    };
    handleTo = (e) => {


    };

    handleOptions = (e) => {


    };
    handleMessage = (e) => {


    };
    handleListen = (e) => {


    };

    onSubmit = (e) => {
        e.preventDefault();
        console.log('onsubmit')

        let errors = [];
        if(!this.rootbranchEl.value){
            errors.push("Please fill the Branch Element");
        }
        if(!this.rootfromEl.value){
            errors.push("Please fill the From Element");
        }

        if(errors.length){
            this.setState({errors});
            return;
        }
        this.setState({errors:[]});

        // SUBMIT
        console.log('Actually submit')

        let newBranch = {
            id: "1",
            parentID: "",
            name: this.rootbranchEl.value,
            from: this.rootfromEl.value,
            to: "right",
            message: "",
            listen: ""
        }

        let branches = this.state.branches.slice(0);
        branches.push(newBranch);
        this.setState({branches});

        axios.post('/tree', this.state.branches).then(function(response){

        }).catch(function(error){
            //Some error occurred
        });


    };



    // Template for an item of the tree
    renderNode = item => {
        //console.log('ITEM', item )
        return <div>{item.id} NODE ({item.name})</div>
    }

    handleChange = treeObject => {
        console.log(treeObject)
        this.setState({branchTree: treeObject})

        let flatTree = flatten(treeObject);
        console.log('Flat tree:', flatTree)


        axios.post('/tree', flatTree).then(function(response){

        }).catch(function(error){
            //Some error occurred
        });

    }


    render() {


        return (

            <div>
                <div>{ this.state.errors.length > 0 ? this.state.errors.map( error => {
                    return <div key={error} className="error">{error}</div>
                }) : '' }</div>

                <Tree
                    paddingLeft={40}              // left padding for children nodes in pixels
                    tree={this.state.branchTree}        // tree object
                    onChange={this.handleChange}  // onChange(tree) tree object changed
                    renderNode={this.renderNode}  // renderNode(node) return react element
                />

                <form className="boxForm"
                      onSubmit={this.onSubmit}
                >
                    <div>Branch:
                        <input
                            ref={el => this.rootbranchEl = el}
                        />
                    </div>
                    <div>From:
                        <input
                            ref={el => this.rootfromEl = el}
                        />
                    </div>
                    <div>To:
                        <input
                            ref={el => this.roottoEl = el}

                        />
                    </div>
                    <div>Parent Branch:
                        <input
                            ref={el => this.rootParentEl = el}

                        />
                    </div>
                    <div>Message:
                        <input
                            ref={el => this.rootmessageEl = el}

                        />
                    </div>
                    <div>Listen For:
                        <input
                            ref={el => this.rootlistenEl = el}

                        />
                    </div>
                    <div><input type="submit"/></div>
                </form>
            </div>

        )

    }

}
//
// function mapStateToProps(state, ownProps){
//     return {
//         user: state.user,
//         foodInstructions: state.foodInstructions
//     }
// }
//
// export default connect(mapStateToProps)(Recipe);

export default connect()(BoxForm)