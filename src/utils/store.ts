import { legacy_createStore as createStore } from "redux";

export const isBrowser = typeof(window) !== 'undefined';

const defaultState = {
    webSocket: isBrowser ? new WebSocket("wss://st-im-django-swimtogether.app.secoder.net/ws/message/") : null,
    userId: 0,
    csrf: '',
}

const reducer = (state = defaultState, action: any) => {
      switch(action.type) {
          case 'socketConnect':
              return {...state, webSocket: action.data};
          case 'getId':
              return {...state, userId: action.data};
          case 'csrf':
              return {...state, csrf: action.data};
          default:
              return state;
      }
};

export default createStore(reducer);