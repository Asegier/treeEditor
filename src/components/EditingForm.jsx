import React, { Component } from 'react';
import BoxForm from './BoxForm'
import { connect } from 'react-redux';
import { createBranch } from '../actions/actions'
import { initStore } from '../store/store'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { flatten } from './utils';

import TextField from 'material-ui/TextField'


const store = initStore();



class EditingForm  extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newListeners: [],
            value: 0
        }
    }
    componentWillMount = () => {
        if(this.props.editing.listener && this.props.editing.listener.length) {
            this.setState({
             newListeners: this.props.editing.listener.slice(0)
             })

        }

        console.log("componentWillMount props.editing.listener: ", this.props)
    }

    componentDidUpdate = (prevProps) => {

        if( prevProps.editing.id != this.props.editing.id) {
            // Update UI when the Editing Branch was changed

            if (this.props.editing.listener && this.props.editing.listener.length) {
                this.setState({newListeners: this.props.editing.listener.slice(0)})
            } else {
                this.setState({newListeners: []})
            }
            //console.log("componentDidUpdate props.editing.listener: ", this.props)
            this.rootEditNameEl && (this.rootEditNameEl.value = this.props.editing.name);
            // this.rootEditfromEl && (this.rootEditfromEl.value = this.props.editing.from);
            this.props.editing.listener && (this.props.editing.listener.forEach((listener, i) => {
                this[`rootlistenusrResponseEl_${i}`] && (this[`rootlistenusrResponseEl_${i}`].value = listener.usrResponse);
            }));
            // this.rootEditfEl && (this.rootEditfromEl.value = this.props.editing.from);
            this.rootEditoptionsEl && (this.rootEditoptionsEl.value = this.props.editing.options);
            this.rootEditbotMsgEl && (this.rootEditbotMsgEl.value = this.props.editing.botMsg);
        }
    }

    onEditSubmit = e => {
        //let data = {};
        // get the data, this.rootEditNameEl.value etc.

        e.preventDefault();

        let editNode = Object.assign({}, this.props.editing);

        editNode.name = this.rootEditNameEl.value;
        editNode.options = this.rootEditoptionsEl.value;
        editNode.botMsg = this.rootEditbotMsgEl.value;
        if(!editNode.listener){ editNode.listener = []; }
        this.state.newListeners.forEach( (newListener,i )=> {
            if( !editNode.listener[i] ) {
                editNode.listener[i] = {};
            }
            editNode.listener[i].toState = this.state.newListeners[i].toState;
            editNode.listener[i].usrResponse = this[`rootlistenusrResponseEl_${i}`].value;
        })

        editNode.listener = editNode.listener.filter( listener => listener.usrResponse && listener.toState )


        console.log('[onEditSubmit]', editNode)


        this.props.onSubmit(editNode);
    }


    handleAddNewListener = (e) => {
        e.preventDefault();
        let newListeners = this.state.newListeners.slice(0);
        newListeners.push({});
        this.setState({ newListeners })
    }






    render() {

        //const items = [];
        console.log('this.state.newListeners',this.state.newListeners)
        let items = flatten(this.props.allBranches).map( (branch,i) => {
            //console.log('Branch ITEM', item, i)
            return <MenuItem value={branch.id} key={branch.id} primaryText={branch.name} />;
        });
        items.unshift(<MenuItem value={null} key="" primaryText="" />)

        console.log("This is the state newLIsteners from Edit: ", this.state.newListeners)

        return(
            <div className="wrapper">

                {/*EDITING FORM */}
                <div>
                    { this.props.editing != "" ? (
                        <form className="editForm"
                              onSubmit={this.onEditSubmit}
                        ><h3>Edit:</h3>

                            <TextField
                                ref={el => {this.rootEditNameEl = el&&el.input}}
                                floatingLabelText="Label"
                                defaultValue={this.props.editing.name}
                            />

                            {/*<div className="form-group">Name:*/}
                                {/*<input className="form-control"*/}
                                       {/*ref={el => this.rootEditNameEl = el}*/}
                                       {/*defaultValue={this.props.editing.name}*/}
                                {/*/>*/}
                            {/*</div>*/}

                            {/*<div className="form-group">From:*/}
                                {/*<input className="form-control"*/}
                                       {/*ref={el => this.rootEditfromEl = el}*/}
                                       {/*defaultValue={this.props.editing.from}*/}
                                {/*/>*/}
                            {/*</div>*/}

                            <TextField
                                ref={el => {this.rootEditbotMsgEl = el&&el.input}}
                                floatingLabelText="Message"
                                defaultValue={this.props.editing.botMsg}
                            />

                            {/*<div className="form-group">Message:*/}
                                {/*<input className="form-control"*/}
                                       {/*ref={el => this.rootEditbotMsgEl = el}*/}
                                       {/*defaultValue={this.props.editing.botMsg}*/}
                                {/*/>*/}
                            {/*</div>*/}

                            <TextField
                                ref={el => {this.rootEditoptionsEl = el&&el.input}}
                                floatingLabelText="Options"
                                defaultValue={this.props.editing.options}
                            />

                            {/*<div className="form-group">Options:*/}
                                {/*<input className="form-control"*/}
                                       {/*ref={el => this.rootEditoptionsEl = el}*/}
                                       {/*defaultValue={this.props.editing.options}*/}
                                {/*/>*/}
                            {/*</div>*/}

                            { this.state.newListeners.map( (listener,i )=> {
                                return (
                                    <div key={i}>
                                        {/*<p>Listen For:</p>*/}

                                        <SelectField
                                            floatingLabelText="To State"
                                            maxHeight={200}
                                            value={listener.toState}
                                            onChange={(e, index, val)=>{
                                                let newListeners = this.state.newListeners.slice(0);
                                                newListeners[i].toState = val; // val is a branch id
                                                this.setState({newListeners});
                                            }}
                                        >
                                            {items}
                                        </SelectField>

                                        <TextField
                                            defaultValue={this.state.newListeners[i].usrResponse}
                                            ref={el => this[`rootlistenusrResponseEl_${i}`] = el&&el.input }
                                            floatingLabelText="User Response"
                                        />
                                    </div>
                                )
                            } )}


                            <a className="btn btn-default submitButton" onClick={this.handleAddNewListener}>Add New Listener</a>
                            <div><input className="submitButton" type="submit"/></div>
                        </form> ) : ''
                    }
                </div>
            </div>
        )
    }
}

export default connect()(EditingForm);
