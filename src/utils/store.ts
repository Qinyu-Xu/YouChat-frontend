import { legacy_createStore as createStore } from "redux"
import {io} from "socket.io-client";
import {DefaultEventsMap} from "@socket.io/component-emitter";

const defaultState = {
    socket: io(),
}

const reducer = (state = defaultState, action: any) => {
    switch (action.type) {
        case 'socketConnect':
            return {...state, socket: action.data}
        default:
            return {...state};
    }
}

export default createStore(reducer);