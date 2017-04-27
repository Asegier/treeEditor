export var branchReducer = (state = {}, action) => {
    switch (action.type) {
        case 'CREATE_BRANCH':
            return action.branch;
        default:
            return state;
    }
};

// export var recipeShowReducer = (
//     state = [], action) => {
//
//     switch (action.type) {
//         case 'SHOW_RECIPE':
//             return action.recipes;
//
//         default:
//             return state;
//
//     }
// }
//
// export var getURLReducer = (
//     state = {}, action) => {
//
//     switch (action.type) {
//         case 'GRAB_URL':
//             return action.id.sourceUrl;
//
//
//         default:
//             return state;
//
//     }

// }

