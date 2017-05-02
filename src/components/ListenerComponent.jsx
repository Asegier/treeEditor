import React, { Component } from 'react';
import BoxForm from './BoxForm'
import { connect } from 'react-redux';
import { createBranch } from '../actions/actions'
import { initStore } from '../store/store'

const store = initStore();


class ListenerComponent  extends Component {
    addBoxDetails = (details) => {
        store.dispatch(createBranch(details))
    };

    render() {
        return(
            <div>Listen For:
                <div> To State:
                    <input
                        ref={el => this.rootlistentoStateEl = el}
                    />
                </div>
                <div> User Response:
                    <input
                        ref={el => this.rootlistenusrResponseEl = el}
                    />
                </div>
            </div>
        )
    }
}

export default connect()(ListenerComponent);
