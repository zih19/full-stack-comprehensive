"use client";
import { persistor, store } from "@/store";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

interface ReduxProviderProps {
  children: React.ReactNode; // -> any valid React content
}

function StateProvider({children}: ReduxProviderProps) {
    // ReduxProviderProps: interface
    return (
        // collect redux from React and store in Provider
        <Provider store={store}>
            {/* acts as a controller to prevent the application from rendering until the state is ready */}
           <PersistGate loading={null} persistor={persistor}>{children}</PersistGate> 
       
        </Provider>
    );

}

export default StateProvider;