import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { useDispatch } from "react-redux";
import createWebStorage from "redux-persist/es/storage/createWebStorage";
import authReducer from "@/app/slices/authSlice";
import cartReducer from "@/app/slices/cartSlice";

// reason: We need to use Promise because React Redux API is asynchronous.
const createNoopStorage = () => {
    return {
       
        getItem() {
          // get the fake data
          return Promise.resolve(null);
        },
        setItem(value: string) {
          // set the fake data
          return Promise.resolve(value);
        },
        removeItem() {
          // remove the fake data
          return Promise.resolve();
        }
    }
}

const storage = 
  typeof window !== 'undefined' 
    ? createWebStorage("local") 
    : createNoopStorage(); // Where can I store these items?
                           // createNoopStorage() -> a fake storage that does not store anything
                           // purpose: prevent crashes when running under the server

const persistConfig = {
    key: 'root', // -> key: the storage key name
    storage, // -> save the key in localstorage
    whitelist: [], // -> the list of reducers that should be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
}) // an object: the mapping of state keys -> functions
   // key: the name of slice in Redux store
   // value: the reducer function that handles the state of the slice 

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    // middleware: a piece of code that runs between dispatching and action
    // a pipeline or a filter
    // The reducer needs to take the action to perform the task
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
    }),
});

// the type of store that we dispatch
// send actions and use store.dispatch to extract specific Typescript types
export type AppDispatch = typeof store.dispatch; 

// save the selected slices in localstorage and store when the app is reloaded
export const persistor = persistStore(store); 

export const useAppDispatch = () => useDispatch<AppDispatch>()

// the full shape of Redux
// the type of the root state, which is the return type of the getState function of the store
export type IRootState = ReturnType<typeof store.getState>; 