import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { getLink } from '../api/api';
// import { idURL } from '../actions/actions';
// import fire from '../fire'
import Tree from 'react-ui-tree'
import { flatten } from './utils';

const uuidV1 = require('uuid/v1');

class BoxForm extends Component {



    constructor(props){
        super(props);
        this.state = {
            errors: [],
            current: "",
            editing: "",
            branchTree: [],
            isTreeDisplay: true


        }



    }

    arrayToTree = (flatArray) => {

        var idToNodeMap = {}; //Keeps track of nodes using id as key, for fast lookup
        var root = null; //Initially set our loop to null

        //loop over data
        flatArray.forEach(function(datum) {

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

        return root;


    }


    findItemById = (element, id) => {
        if(element.id == id){
            return element;
        } else if (element.children != null){
            let i, result = null;
            for(i=0; result == null && i < element.children.length; i++){
                result = this.findItemById(element.children[i], id);
            }
            return result;
        }
        return null;
    }



    updateItemById = (element, updatedChild) => {
        console.log('[updateItemById] start', element, updatedChild)

        if(element.id == updatedChild.id){
            for(let prop in updatedChild){
                element[prop] = updatedChild[prop];
            }
            //return element;
        } else if (element.children != null){
            let i, result = null;
            for(i=0; i < element.children.length; i++){
                result = this.updateItemById(element.children[i], updatedChild);
            }
            //return result;
        }

        console.log('[updateItemById]', element)
        return element; // return the tree back
    }

    deleteItem = (element, itemToDelete) => {
        //console.log('[updateItemById] start', element, updatedChild)

        if (element.children != null){
            let i, result = null;
            for(i=0; i < element.children.length; i++){
                if(element.children[i].id === itemToDelete.id) {

                    element.children.splice(i, 1); // Delete element
                    console.log('DELETED', element)
                } else {
                    this.deleteItem(element.children[i], itemToDelete);
                }
            }
        }

        console.log('[deleteItem]', element)
        return element; // return the tree back
    }





    componentWillMount = () => {

        let branches = [{
            id: "1",
            parentID: "",
            name: "ONE",
            from: "left",
            botMsg: "How are you doing",
            listener: ["1", "2"],
            type: "search"
        },{
            id: "2",
            parentID: "1",
            name: "TWO",
            from: "left",
            botMsg: "sfsdfasdf",
            listener: [],
            type: ""
        },{
            id: "3",
            parentID: "2",
            name: "THREE",
            from: "left",
            botMsg: "",
            listener: [],
            type: ""
        }
        ]
        this.setState({branchTree: this.arrayToTree(branches)});

    };

    // add new item
    onSubmit = (e) => {
        e.preventDefault();
        console.log('onsubmit')

        let errors = [];
        if(!this.rootNameEl.value){
            errors.push("Please fill the Branch Element");
        }
        if(!this.rootfromEl.value){
            errors.push("Please fill the From Element");
        }
        if(!this.roottoEl.value){
            errors.push("Please fill the To Element");
        }
        if(!this.rootbotMsgEl.value){
            errors.push("Please fill the Message Element");
        }
        if(!this.rootlistenEl.value){
            errors.push("Please fill the Listen Element");
        }

        if(errors.length){
            this.setState({errors});
            return;
        }
        this.setState({errors:[]});

        // SUBMIT
        console.log('Actually submit')

        let newBranch = {
            id: uuidV1(),
            parentID: this.rootParentEl.value,
            name: this.rootNameEl.value,
            from: this.rootfromEl.value,
            botMsg: "",
            listener: []
        }


        let branchTree = Object.assign({}, this.state.branchTree);
        branchTree.children.push(newBranch);


        this.setState({branchTree});

        /*
        console.log("rootParentEl", this.rootParentEl.value)

        let branches = this.state.branches.slice(0);  // copy current branches state
        console.log("branches after slicing", branches)

        branches.push(newBranch);  // add new branch to copied branches
        console.log("branches after pushing", branches)
        this.setState({branches: branches});  // replace branches with new pushed branch

        var idToNodeMap = {}; //Keeps track of nodes using id as key, for fast lookup
        var root = null; //Initially set our loop to null

        //loop over data

        // console.log("this.state.branches: ", this.state.branches)
        branches.forEach(function(datum) {

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

        // axios.post('/tree', this.state.branches).then(function(response){
        //
        // }).catch(function(error){
        //     //Some error occurred
        // });
        */

    };



    // Template for an item of the tree
    renderNode = item => {
        //console.log('ITEM', item )
        return <div onClick={this.handleCurrent.bind(this, item)}>
            {item.id} ({item.name})
            <button className="btn btn-default" onClick={this.handleEdit.bind(this, item)}>
                <i className="fa fa-pencil" aria-hidden="true"></i>
            </button>
            <button className="btn btn-default" onClick={this.handleDelete.bind(this, item)}>
                <i className="fa fa-times-circle" aria-hidden="true"></i>
            </button>

        </div>
    };

    handleEdit = (item, e) => {
        console.log('Editing', item.name);
        this.setState({editing: item});

        this.rootEditNameEl && (this.rootEditNameEl.value = item.name);
        this.rootEditfromEl && (this.rootEditfromEl.value = item.from);


    };

    handleDelete = (item, e) => {
        console.log("handleDelete", item);
        let branchTree = Object.assign({}, this.state.branchTree);

        branchTree = this.deleteItem(branchTree, item);

        console.log('RESULT delete', branchTree);
        this.setState({branchTree, isTreeDisplay: false});
        setTimeout(()=>{
            this.setState({isTreeDisplay: true});
        }, 40)



    }

    handleCurrent = (item, e) => {
        e.preventDefault()

        console.log('ITEM', item)
        this.setState({current: item})
    }

    handleChange = treeObject => {
        console.log(treeObject);

        // persist to backend
        // let flatTree = flatten(this.state.branchTree);
        // axios.post('/tree', flatTree).then(function(response){
        //
        // }).catch(function(error){
        //     //Some error occurred
        // });

    }

    onEditSubmit = (e) => {

        e.preventDefault();

        let editNode = Object.assign({}, this.state.editing);

        editNode.name = this.rootEditNameEl.value;
        editNode.from = this.rootEditfromEl.value;
        editNode.to = this.rootEdittoEl.value;
        editNode.parentID = this.rootEditParentEl.value;
        editNode.botMsg = this.rootEditbotMsgEl.value;
        editNode.listener = this.rootEditlistenEl.value;
        console.log('[onEditSubmit]', editNode)


        let branchTree = Object.assign({}, this.state.branchTree);

        branchTree = this.updateItemById(branchTree, editNode);
        this.setState({branchTree, editing: ''});

/*
        let branches =  this.state.branches.slice(0);

        let i=0, len = branches.length;
        for (;i < len;i++) if(branches[i].id==editNode.id) break;
        // i - the index of the element to be edited

        branches[i] = editNode;
        this.setState({branches});
*/



    }


    render() {


        return (

            <div>

                { !!this.state.isTreeDisplay && <Tree
                    className="Tree treewrapper"
                    paddingLeft={40}              // left padding for children nodes in pixels
                    tree={this.state.branchTree}        // tree object
                    onChange={this.handleChange}  // onChange(tree) tree object changed
                    renderNode={this.renderNode}  // renderNode(node) return react element
                /> }
                <div className="everythingelse">
                    <div>{ this.state.errors.length > 0 ? this.state.errors.map( error => {
                        return <div key={error} className="error">{error}</div>
                    }) : '' }</div>

                    <div>{ this.state.current != "" ? <div>
                            <div>Name: {this.state.current.name}</div>
                            <div>From: {this.state.current.from}</div>
                            <div>To: {this.state.current.to}</div>
                            <div>Parent Branch: {this.state.current.parentID}</div>
                            <div>Message: {this.state.current.botMsg}</div>
                            <div>Listen For: {this.state.current.listener}</div>
                        </div>

                        : ''}
                    </div>


                    {/*EDITING FORM */}
                    { this.state.editing != "" ? (
                        <form className="boxForm"
                              onSubmit={this.onEditSubmit}
                        >
                            <div className="form-group">Name:
                                <input className="form-control"
                                    ref={el => this.rootEditNameEl = el}
                                    defaultValue={this.state.editing.name}
                                />hello
                            </div>
                            <div>From:
                                <input
                                    ref={el => this.rootEditfromEl = el}
                                    defaultValue={this.state.editing.from}
                                />
                            </div>
                            <div>To:
                                <input
                                    ref={el => this.rootEdittoEl = el}
                                    defaultValue={this.state.editing.to}

                                />
                            </div>
                            <div>Parent Branch:
                                <input
                                    ref={el => this.rootEditParentEl = el}
                                    defaultValue={this.state.editing.parentID}

                                />
                            </div>
                            <div>Message:
                                <input
                                    ref={el => this.rootEditbotMsgEl = el}
                                    defaultValue={this.state.editing.botMsg}

                                />
                            </div>
                            <div>Listen For:
                                <input
                                    ref={el => this.rootEditlistenEl = el}
                                    defaultValue={this.state.editing.listener}

                                /> Please input an array {uuidV1()}
                            </div>
                            <div><input type="submit"/></div>
                        </form> ) : ''
                    }

                    <form className="boxForm"
                          onSubmit={this.onSubmit}
                    >
                        <div>Name:
                            <input
                                ref={el => this.rootNameEl = el}
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
                                ref={el => this.rootbotMsgEl = el}

                            />
                        </div>
                        <div>Listen For:
                            <input
                                ref={el => this.rootlistenEl = el}

                            /> Please input an array {uuidV1()}
                        </div>
                        <div><input type="submit"/></div>
                    </form>
                </div>
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