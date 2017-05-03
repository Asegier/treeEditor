import React, { Component } from 'react';
import BoxForm from './BoxForm'
import { connect } from 'react-redux';
import { createBranch } from '../actions/actions'
import { initStore } from '../store/store'

const store = initStore();


class EditingForm  extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newListeners: []
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

        if( prevProps.editing.id != this.props.editing.id &&
                this.props.editing.listener && this.props.editing.listener.length) {

            this.setState({
                newListeners: this.props.editing.listener.slice(0)
            })
        }

        console.log("componentDidUpdate props.editing.listener: ", this.props)


        this.rootEditNameEl && (this.rootEditNameEl.value = this.props.editing.name);
        this.rootEditfromEl && (this.rootEditfromEl.value = this.props.editing.from);
        this.props.editing.listener && (this.props.editing.listener.forEach((listener, i) => {
            this[`rootlistentoStateEl_${i}`] && (this[`rootlistentoStateEl_${i}`].value = listener.toState);
            this[`rootlistenusrResponseEl_${i}`] && (this[`rootlistenusrResponseEl_${i}`].value = listener.usrResponse);
        }));
        this.rootEditfEl && (this.rootEditfromEl.value = this.props.editing.from);
        this.rootEditoptionsEl && (this.rootEditoptionsEl.value = this.props.editing.options);
        this.rootEditbotMsgEl && (this.rootEditbotMsgEl.value = this.props.editing.botMsg);
    }

    onEditSubmit = e => {
        //let data = {};
        // get the data, this.rootEditNameEl.value etc.

        e.preventDefault();

        let editNode = Object.assign({}, this.props.editing);

        editNode.name = this.rootEditNameEl.value;
        editNode.options = this.rootEditoptionsEl.value;
        editNode.botMsg = this.rootEditbotMsgEl.value;
        this.state.newListeners.map( (listener,i )=> {
            editNode.listener[i].toState = this[`rootlistentoStateEl_${i}`].value;
            editNode.listener[i].usrResponse = this[`rootlistenusrResponseEl_${i}`].value;
        })
        console.log('[onEditSubmit]', editNode)


        this.props.onSubmit(editNode);
    }


    handleAddNewListener = (e) => {
        e.preventDefault();
        let newListeners = this.state.newListeners.slice(0);
        newListeners.push({});
        this.setState({      newListeners     })
    }



    render() {

        console.log("This is the state newLIsteners from Edit: ", this.state.newListeners)

        return(
            <div className="wrapper">
                {/*EDITING FORM */}
                <div className="col-md-4"><h3>Edit:</h3>
                    { this.props.editing != "" ? (
                        <form className="boxForm"
                              onSubmit={this.onEditSubmit}
                        >
                            <div className="form-group">Name:
                                <input className="form-control"
                                       ref={el => this.rootEditNameEl = el}
                                       defaultValue={this.props.editing.name}
                                />
                            </div>
                            <div className="form-group">From:
                                <input className="form-control"
                                       ref={el => this.rootEditfromEl = el}
                                       defaultValue={this.props.editing.from}
                                />
                            </div>
                            <div className="form-group">Message:
                                <input className="form-control"
                                       ref={el => this.rootEditbotMsgEl = el}
                                       defaultValue={this.props.editing.botMsg}
                                />
                            </div>
                            <div className="form-group">Options:
                                <input className="form-control"
                                       ref={el => this.rootEditoptionsEl = el}
                                       defaultValue={this.props.editing.options}
                                />
                            </div>
                            { this.state.newListeners.map( (listener,i )=> {
                                return (
                                    <div key={i}>Listen For:
                                        <div> To State:
                                            <input
                                                ref={el => this[`rootlistentoStateEl_${i}`] = el}
                                                defaultValue={this.state.newListeners[i].toState}
                                            />
                                        </div>
                                        <div> User Response:
                                            <input
                                                ref={el => this[`rootlistenusrResponseEl_${i}`] = el}
                                                defaultValue={this.state.newListeners[i].usrResponse}
                                            />
                                        </div>
                                    </div>
                                )
                            } )}


                            <a className="btn btn-default" onClick={this.handleAddNewListener}>Add New Listener</a>
                            <div><input type="submit"/></div>
                        </form> ) : ''
                    }
                </div>
            </div>
        )
    }
}

export default connect()(EditingForm);
