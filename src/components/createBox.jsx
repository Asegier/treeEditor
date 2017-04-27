import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { getLink } from '../api/api';
// import { idURL } from '../actions/actions';
// import fire from '../fire'

class createBox extends Component {

    constructor(props){
        super(props);
        this.state = {
            name: "",
            from: "",
            to: "",
            options: {},
            message: "",
            listen: ""
        }
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




    render() {

        return (

            <div>
                <div className="createBox">
                    <div>Branch:
                        <input
                            id="rootbranch"
                        />
                    </div>
                    <div>From:
                        <input id=""/>
                    </div>
                    <div>To:
                        <input id=""/>
                    </div>
                    <div>Options:
                        <input id=""/>
                    </div>
                    <div>Message:
                        <input id=""/>
                    </div>
                    <div>Listen For:
                        <input id=""/>
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

export default createBox