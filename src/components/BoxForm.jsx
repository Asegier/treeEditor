import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { getLink } from '../api/api';
// import { idURL } from '../actions/actions';
// import fire from '../fire'
import Tree from 'react-ui-tree'
import { flatten } from './utils';
import EditingForm from './EditingForm'
import 

const uuidV1 = require('uuid/v1');

class BoxForm extends Component {



    constructor(props){
        super(props);
        this.state = {
            errors: [],
            current: "",
            editing: "",
            branchTree: [],
            isTreeDisplay: true,
            newListeners: [{}]
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
            listener: [{
                toState: "",
                usrResponse: ""
            }],
            type: "search"
        },{
            id: "2",
            parentID: "1",
            name: "TWO",
            from: "left",
            botMsg: "sfsdfasdf",
            listener: [{
                toState: "",
                usrResponse: ""
            }],
            type: ""
        },{
            id: "3",
            parentID: "2",
            name: "THREE",
            from: "left",
            botMsg: "",
            listener: [{
                toState: "",
                usrResponse: ""
            }],
            type: ""
        },{
            id: "4",
            parentID: "3",
            name: "FOUR",
            from: "left",
            botMsg: "",
            listener: [{
                toState: "",
                usrResponse: ""
            }],
            type: ""
        },{
            id: "5",
            parentID: "4",
            name: "Five",
            from: "left",
            botMsg: "",
            listener: [{
                toState: "",
                usrResponse: ""
            }],
            type: ""
        },{
            id: "6",
            parentID: "5",
            name: "Six",
            from: "left",
            botMsg: "",
            listener: [{
                toState: "",
                usrResponse: ""
            }],
            type: ""
        },{
            id: "7",
            parentID: "6",
            name: "Seven",
            from: "left",
            botMsg: "",
            listener: [{
                toState: "",
                usrResponse: ""
            }],
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
        // if(!this.rootlistentoStateEl.value){
        //     errors.push("Please fill the Listener toState Element");
        // }
        if(!this.rootbotMsgEl.value){
            errors.push("Please fill the Message Element");
        }
        // if(!this.rootlistenusrResponseEl.value){
        //     errors.push("Please fill the Listener usrResponse Element");
        // }

        if(errors.length){
            this.setState({errors});
            return;
        }
        this.setState({errors:[]});

        // SUBMIT
        console.log('Actually submit')

        let newBranch = {
            id: uuidV1(),
            name: this.rootNameEl.value,
            from: this.rootfromEl.value,
            botMsg: "",
            listener: []
        }

        this.state.newListeners.map((listener, i) => {
            newBranch.listener.push({
                toState: this[`rootlistentoStateEl_${i}`].value,
                usrResponse: this[`rootlistenusrResponseEl_${i}`].value
            })
        })


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

    handleDropdown = (e) => {



    }

    handleEdit = (item, e) => {
        console.log('Editing', item.name);
        this.setState({editing: item});


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



    };

    handleCurrent = (item, e) => {
        e.preventDefault();

        console.log('ITEM', item);
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

    };

    onEditSubmit = (e) => {

        e.preventDefault();

        let editNode = Object.assign({}, this.state.editing);

        editNode.name = this.rootEditNameEl.value;
        editNode.from = this.rootEditfromEl.value;
        editNode.botMsg = this.rootEditbotMsgEl.value;


        editNode.listener.forEach((listener, i) => {

            listener.toState = this[`rootlistentoStateEl_${i}`].value;
            listener.usrResponse = this[`rootlistenusrResponseEl_${i}`].value;
        });
        // editNode.listener[0].usrResponse = this.rootEditlistenValueEl.value
        console.log('[onEditSubmit]', editNode)

        let branchTree = Object.assign({}, this.state.branchTree);

        branchTree = this.updateItemById(branchTree, editNode);
        this.setState({branchTree, editing: ' '});

/*
        let branches =  this.state.branches.slice(0);

        let i=0, len = branches.length;
        for (;i < len;i++) if(branches[i].id==editNode.id) break;
        // i - the index of the element to be edited

        branches[i] = editNode;
        this.setState({branches});
*/


    }

    onEditingFormSubmit = (editNode) => {
        // save the date with setState etc.

        let branchTree = Object.assign({}, this.state.branchTree);

        branchTree = this.updateItemById(branchTree, editNode);

        console.log('UPDATED TREE', branchTree)
        this.setState({branchTree, editing: ''});
    }

    handleAddNewListener = (e) => {
        e.preventDefault();
        let newListeners = this.state.newListeners.slice(0);
        newListeners.push({});
        this.setState({      newListeners     })
    }

    render() {

        console.log("this.state.")

        return (

            <div>

                { !!this.state.isTreeDisplay && (
                    <div className="treewrapper">
                        <Tree
                            className="Tree"
                            paddingLeft={40}              // left padding for children nodes in pixels
                            tree={this.state.branchTree}        // tree object
                            onChange={this.handleChange}  // onChange(tree) tree object changed
                            renderNode={this.renderNode}  // renderNode(node) return react element
                        />
                    </div>
                ) }
                <div className="everythingelse row">
                    <div>{ this.state.errors.length > 0 ? this.state.errors.map( error => {
                        return <div key={error} className="error">{error}</div>
                    }) : '' }</div>

                    <div className="col-md-2">{ this.state.current != "" ? <div>
                            <div>Name: {this.state.current.name}</div>
                            <div>From: {this.state.current.from}</div>
                            <div>To: {this.state.current.to}</div>
                            {/*<div>Parent Branch: {this.state.current.parentID}</div>*/}
                            <div>Message: {this.state.current.botMsg}</div>
                            <div>Listen For: {this.state.current.listener.map( item => {
                                return <div key={item.toState}>{item.toState}</div>
                            })}</div>
                        </div>

                        : ''}
                    </div>

                    <EditingForm
                        onSubmit={this.onEditingFormSubmit}
                        editing={this.state.editing}
                    />

                    <div className="col-md-4"> <h3>Add:</h3>
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
                            <div>Message:
                                <input
                                    ref={el => this.rootbotMsgEl = el}

                                />
                            </div>

                        { this.state.newListeners.map( (listener,i )=> {
                            return (
                                <div key={i}>Listen For:
                                    <div> To State:
                                        <input
                                            ref={el => this[`rootlistentoStateEl_${i}`] = el}
                                        />
                                    </div>
                                    <div> User Response:
                                        <input
                                            ref={el => this[`rootlistenusrResponseEl_${i}`] = el}
                                        />
                                    </div>
                                </div>
                            )
                        } )}


                            <a className="btn btn-default" onClick={this.handleAddNewListener}>Add New Listener</a>
                            <div><input type="submit"/></div>
                        </form>
                    </div>
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