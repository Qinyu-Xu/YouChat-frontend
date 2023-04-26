import { legacy_createStore as createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export const isBrowser = typeof(window) !== 'undefined';

const defaultState = {
    webSocket: null,
    userId: 0,
    csrf: '',
    imgMap: new Map<number, Map<number,string>>()
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
          case 'addImage':
              const { key, value } = action.data;
              const newMap = new Map(state.imgMap);
              newMap.set(key, value);
              return { ...state, imgMap: newMap };
          default:
              return state;
      }
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
export {store, persistor};