import { legacy_createStore as createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const isBrowser = typeof(window) !== 'undefined';

const defaultState = {
    webSocket: null,
    userId: 0,
    csrf: '',
}

const persistConfig = {
    key: 'root',
    storage,
};

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

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
export {store, persistor};

if(store.getState().webSocket ) store.getState().webSocket.addEventListener('close', ()=>console.log(1));