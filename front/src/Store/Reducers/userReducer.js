export const initalState = {}

const reducer = (state = initalState, action) => {
    let nextState
    switch(action.type){
        case 'user':
            nextState= { user: action.value}
            return nextState
        default:
            return state
    }
}

export default reducer