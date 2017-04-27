import React, { Component } from 'react';
import BoxForm from './BoxForm'
import { connect } from 'react-redux';
import { createBranch } from '../actions/actions'
import { initStore } from '../store/store'

const store = initStore();


class Tree  extends Component {
    addBoxDetails = (details) => {
        store.dispatch(createBranch(details))
    };

    render() {
        return(
            <div className="wrapper">
                <BoxForm addBoxDetails={this.addBoxDetails.bind(this)}/>
            </div>
        )
    }
}

export default connect()(Tree);
