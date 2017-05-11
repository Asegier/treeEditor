import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tree from 'react-ui-tree'
import { flatten } from './utils';
import EditingForm from './EditingForm'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardText, CardTitle } from 'material-ui/Card'
import injectTapEventPlugin from 'react-tap-event-plugin';

import MenuItem from 'material-ui/MenuItem';
import Drawer from 'material-ui/Drawer';
import Chip from 'material-ui/Chip';

import TextField from 'material-ui/TextField'


import IconButton from 'material-ui/IconButton';

const axios = require('axios');

const uuidV1 = require('uuid/v1');

injectTapEventPlugin();

class BoxForm extends Component {



    constructor(props){
        super(props);
        this.state = {
            errors: [],
            current: "",
            editing: "",
            branchTree: {},
            isTreeDisplay: true,
            newListeners: [{}],
            value: 10,
            drawerOpen: false,
            adding: false
        }



    }

    arrayToTree = (flatArray) => {

        var idToNodeMap = {}; //Keeps track of nodes using id as key, for fast lookup
        var root = null; //Initially set our loop to null

        flatArray.forEach(function(item) {
            if(typeof item !== 'object'){ return; }
            item.children = [];
            idToNodeMap[item.id] = item;
            if(!item.parentID || item.parentID===item.id ) {
                root = idToNodeMap[item.id];
            }
        });

        for(let key in idToNodeMap) {
            let parentID = idToNodeMap[key].parentID;
            if( idToNodeMap[parentID] && parentID!==idToNodeMap[key].id ){
                idToNodeMap[parentID].children.push(idToNodeMap[key]);
            }
        }

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

        if (element.children != null){ // If there are children
            let i, result = null;
            for(i=0; i < element.children.length; i++){  // Loops through all the Children

                // if each childs ID is equal to ID specified to delete
                if(element.children[i].id === itemToDelete.id) {
                    element.children.splice(i, 1); // Delete the child
                    // console.log('DELETED', element)
                } else {
                    // Reiterate over Children of Children
                    this.deleteItem(element.children[i], itemToDelete);
                }
            }
        }

        // console.log('[deleteItem]', element)
        this.updateBackEnd(element)
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
        ];
        // this.setState({branchTree: this.arrayToTree(branches)});


        // axios({
        //     method: 'POST',
        //     url: 'http://localhost:3002/api/script.create',
        //     data: {script: JSON.stringify(branches), title: "botthing"},
        //     headers:{
        //         'Content-Type': 'application/json'
        //
        //     }
        // })
        //     .then((response) => {
        //         console.log("response from axios put: ", response);
        //     })
        //     .catch((error) => {
        //         console.log("response from axios put error: ", error)
        //     });
        //
        // console.log("flatten(branches)", branches);

        //var self = this;

        // axios.get('http://localhost:3002/api/script.get') // personal
        axios.get('http://192.168.100.105:3003/api/script.get')
            .then( response => {
                console.log("AXIOSSSS!!!", response.data[0].script);
                var branchTree = this.arrayToTree(JSON.parse(response.data[0].script));
                //console.log("response.data[0].script:", JSON.parse(response.data[0].script).length)

                console.log("correct data branchTree", branchTree);
                this.setState({branchTree})
            })
            .catch( error => {
                console.log("AXIOSSSSS ERRORR :(", error);
            });

        // axios({
        //     method: 'PUT',
        //     url: 'http://192.168.88.101:3000/api/script.update',
        //     data: {script: JSON.stringify(branches)},
        //     headers:{
        //         'Content-Type': 'application/json',
        //         '_id': '59070b1b44b9957e8f15f9ce',
        //     }
        // })
        //     .then((response) => {
        //         console.log("response from axios put: ", response);
        //     })
        //     .catch((error) => {
        //     console.log("response from axios put error: ", error)
        //     });
    };

    componentDidMount = () => {
        console.log("componentDidMount state.branchTree: ", this.state.branchTree);

        if(!this.keyupListener) {
            window.document.addEventListener('keyup', this.handleKeyup, false);
        }
        this.keyupListener = true;
    }

    componentWillUnmount = () => {
        window.document.removeEventListener('keyup', this.handleKeyup, false);
        this.keyupListener = false;
    }

    handleKeyup = e => {
        if(e.which===27){ // ESC
            this.setState({drawerOpen: !this.state.drawerOpen});
        }
    }



    // add new item
    onSubmit = (e) => {
        e.preventDefault();
        console.log('onsubmit')

        let errors = [];
        if(!this.rootNameEl.value){
            errors.push("Please fill in the Label Field");
        }
        // if(!this.rootfromEl.value){
        //     errors.push("Please fill the From Element");
        // }
        // if(!this.rootlistentoStateEl.value){
        //     errors.push("Please fill the Listener toState Element");
        // }
        if(!this.rootbotMsgEl.value){
            errors.push("Please fill in the Message to the User");
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
        console.log('Actually submit');

        let newBranch = {
            id: uuidV1(),
            name: this.rootNameEl.value,
            // from: this.rootfromEl.value,
            botMsg: this.rootbotMsgEl.value,
            options: this.rootoptionsEl.value,
            listener: []
        };

        // this.state.newListeners.map((listener, i) => {
        //     newBranch.listener.push({
        //         toState: this[`rootlistentoStateEl_${i}`].value,
        //         usrResponse: this[`rootlistenusrResponseEl_${i}`].value
        //     })
        // });


        let branchTree = Object.assign({}, this.state.branchTree);
        branchTree.children.push(newBranch);


        this.setState({branchTree});

        // UPDATE THE DATABASE WITH THE NEW BRANCH
        this.updateBackEnd(branchTree)

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
        let iconStyle={ fontSize: '14px'}
        let iconButtonStyle = {width:25, height: 20, padding: '0 5px', lineHeight: 15};
        return (
            <div style={{display: 'flex', alignItems: 'center'}}>
            <Chip style={{margin: 2}}>
                <span style={{paddingRight: 10}}
                    onClick={this.handleCurrent.bind(this, item)}>{item.name}</span>
                <IconButton
                    style={iconButtonStyle}
                    iconStyle={iconStyle}
                    onClick={this.handleEdit.bind(this, item)}
                    iconClassName="fa fa-pencil"
                />
                <IconButton
                    style={iconButtonStyle}
                    iconStyle={iconStyle}
                    onClick={this.handleDelete.bind(this, item)}
                    iconClassName="fa fa-times-circle"
                />
                {/*<CardHeader title={item.name} />*/}

                {/*<CardActions>
                    <IconButton
                        onClick={this.handleEdit.bind(this, item)}
                        iconClassName="fa fa-pencil"
                    />
                    <IconButton
                        onClick={this.handleDelete.bind(this, item)}
                        iconClassName="fa fa-times-circle"
                    />
                </CardActions>*/}
                {/*<button className="btn btn-default" onClick={this.handleEdit.bind(this, item)}>
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button className="btn btn-default" onClick={this.handleDelete.bind(this, item)}>
                    <i className="fa fa-times-circle" aria-hidden="true"></i>
                </button>*/}

            </Chip>
                <i className="fa fa-bars" />
            </div>
        )
    };

    handleDropdown = (e) => {


    }

    handleEdit = (item, e) => {
        console.log('Editing', item);
        this.setState({editing: item, drawerOpen: true, adding: false});


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
        this.setState({current: item, drawerOpen: true, editing: '', adding: false})
    }

    handleChange = treeObject => {
        console.log(treeObject);

        this.updateBackEnd(treeObject)

    };

    onEditSubmit = (e) => {

        e.preventDefault();

        let editNode = Object.assign({}, this.state.editing);

        editNode.name = this.rootEditNameEl.value;
        // editNode.from = this.rootEditfromEl.value;
        editNode.botMsg = this.rootEditbotMsgEl.value;
        editNode.options = this.rootEditoptionsEl.value;


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

    updateBackEnd = (tree) => {

        let flat = flatten(tree);


        console.log('POST PAYLOAD', flat);


        // TEMP fix the payload
        let arr = []
        flat.forEach( item => {
            for(let prop in item){
                if(prop=='id'){
                    arr.push(item);
                    return;
                }
            }
            for(let prop in item){
                //return item[prop];
                arr.push(item[prop])
            }
        });
        flat = arr;

        console.log('CORRECT POST PAYLOAD', flat);

        let payload = JSON.stringify(flat);

        //return; // STOP HERE


        // UPDATE THE DATABASE WITH THE NEW BRANCH
        axios({
            method: 'PUT',
            url: 'http://192.168.100.105:3003/api/script.update', // UFO mongo
            // url: 'http://localhost:3002/api/script.update', // my own backend
            data: {script: payload},
            headers:{
                'Content-Type': 'application/json',
                // '_id': '5909d28615567b055ca56599', // my own ID
                '_id': '59083916220e11b48b44b174' // UFO ID
            }
        })
            .then((response) => {
                console.log("response from axios put: ", response);
            })
            .catch((error) => {
                console.log("response from axios put error: ", error)
            });
    }

    // Update Database when Edit Form is submitted

    onEditingFormSubmit = (editNode) => {
        // save the date with setState etc.

        let branchTree = Object.assign({}, this.state.branchTree);

        branchTree = this.updateItemById(branchTree, editNode);

        console.log('UPDATED TREE', branchTree);
        this.setState({branchTree, editing: '', current: ''});

        this.updateBackEnd(branchTree);

    }

    handleAddNewListener = (e) => {
        e.preventDefault();
        let newListeners = this.state.newListeners.slice(0);
        newListeners.push({});
        this.setState({      newListeners     })
    }

    handleToggle = () => this.setState({open: !this.state.open});


    render() {

        console.log("this.state.", this.state.branchTree);

        const items = [];
        for (let i = 0; i < 100; i++ ) {
            items.push(<MenuItem value={i} key={i} primaryText={`Item ${i}`} />);
        }

        return (

            <MuiThemeProvider>
                <div>
                    <AppBar title="Chatbot Editor"
                            iconElementRight={<IconButton

                                onClick={()=> this.setState({adding: true, editing: '', drawerOpen: true})}
                                iconClassName="fa fa-plus"
                            />

                                }
                        />

                { !!this.state.isTreeDisplay && !!this.state.branchTree && (
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
                <div className="everythingelse">
                    <Drawer
                        width={400}
                        openSecondary={true}
                        open={this.state.drawerOpen}
                        style={{background: "black"}}
                        >
                        <IconButton
                            className="pull-left"
                            onClick={()=> this.setState({adding: true, editing: ''})}
                            iconClassName="fa fa-plus"
                            />
                        <IconButton
                            className="pull-right"
                            onClick={()=>this.setState({drawerOpen:false})}
                            iconClassName="fa fa-times-circle"
                        />

                        <div>{ this.state.errors.length > 0 ? this.state.errors.map( error => {
                            return <div key={error} className="error">{error}</div>
                        }) : '' }</div>

                        <Card>{ this.state.current != "" ? <div>
                                <CardTitle onClick={() => {this.setState({current: ""})}} title="Current Branch"/>
                                <CardText>
                                    {/*ID: {this.state.current.id} <br/>*/}
                                    Label: {this.state.current.name} <br/> <br/>
                                Options: {this.state.current.options} <br/> <br/>
                                {/*<div>Parent Branch: {this.state.current.parentID}</div>*/}
                                Message: {this.state.current.botMsg} <br/><br/>

                                Listen For: {this.state.current.listener.map( (listener,i) => {
                                    let branch = this.findItemById(this.state.branchTree, listener.toState);
                                    return branch ? <CardText key={i}>To State: {branch.name}<br/> User Response: {listener.usrResponse}</CardText> : '';
                                })}

                                </CardText>

                            </div>

                            : ''}
                        </Card>

                        { this.state.editing ? <EditingForm
                            onSubmit={this.onEditingFormSubmit}
                            allBranches={this.state.branchTree}
                            editing={this.state.editing}
                        /> : '' }
                            { this.state.adding ? (

                                <form className="addForm"
                                      onSubmit={this.onSubmit}
                                ><h3>Add New Branch:</h3>

                                        <TextField
                                            ref={el => { this.rootNameEl = el&&el.input }}
                                            floatingLabelText="Branch Name"
                                        />

                                    {/*<div>From:*/}
                                        {/*<input*/}
                                            {/*ref={el => this.rootfromEl = el}*/}
                                        {/*/>*/}
                                    {/*</div>*/}
                                    <TextField
                                        ref={el => {this.rootbotMsgEl = el&&el.input}}
                                        floatingLabelText="Message to the User"
                                        />

                                    {/*<div>Message:*/}
                                        {/*<input*/}
                                            {/*ref={el => this.rootbotMsgEl = el}*/}

                                        {/*/>*/}
                                    {/*</div>*/}

                                    <TextField
                                        ref={el => {this.rootoptionsEl = el&&el.input}}
                                        floatingLabelText="Options (wiki/solr)"
                                    />
                                    {/*<div>Options:*/}
                                        {/*<input*/}
                                            {/*ref={el => this.rootoptionsEl = el}*/}

                                        {/*/>*/}
                                    {/*</div>*/}

                                {/*{ this.state.newListeners.map( (listener,i )=> {*/}
                                    {/*return (*/}
                                        {/*<div key={i}>Listen For:*/}
                                            {/*<div> To State:*/}
                                                {/*<input*/}
                                                    {/*ref={el => this[`rootlistentoStateEl_${i}`] = el}*/}
                                                {/*/>*/}
                                            {/*</div>*/}
                                            {/*<div> User Response:*/}
                                                {/*<input*/}
                                                    {/*ref={el => this[`rootlistenusrResponseEl_${i}`] = el}*/}
                                                {/*/>*/}
                                            {/*</div>*/}
                                        {/*</div>*/}
                                    {/*)*/}
                                {/*} )}*/}



                                    {/*<a className="btn btn-default" onClick={this.handleAddNewListener}>Add New Listener</a>*/}
                                    <div><input className="submitButton" type="submit"/></div>
                                </form>
                            ) : '' }
                    </Drawer>
                </div>
            </div>
            </MuiThemeProvider>

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