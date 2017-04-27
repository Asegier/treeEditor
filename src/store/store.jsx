import { createStore, compose, combineReducers } from 'redux';
import { branchReducer } from '../reducers/reducers'

export let initStore = () => {

    const reducer = combineReducers({
        createBranch: branchReducer
    });

    const store = createStore( reducer, compose(
        window.devToolsExtension ? window.devToolsExtension() : f => f
    ));

    return store
};
