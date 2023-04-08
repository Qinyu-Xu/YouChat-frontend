import { legacy_createStore as createStore } from "redux"

const defaultState = {
    webSocket: '',
}

const reducer = (state = defaultState, action: any) => {
    switch (action.type) {
        case 'socketConnect':
            return {...state, webSocket: action.data}
        default:
            return {...state};
    }
}

export default createStore(reducer);