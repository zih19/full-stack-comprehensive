// configure the API client
import axios from 'axios';
import { store } from '@/store';
import { authService } from './auth.service';
import { setAccessToken, clearAuth } from '@/app/slices/authSlice';


export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // the base URL of the API, which is defined in the .env file
  headers: {
    "Content-Type": "application/json", // the content type of the request, which is JSON
  },
  timeout: 10000, // the timeout of the request, which is 5 seconds
})

// add a request interceptor to include the access token in the request headers
apiClient.interceptors.request.use(
    (config) => {
       const state = store.getState(); // get the redux state using store.getState function
       const token = state.auth.accessToken; // get the access token from the auth state in the Redux store

       if (token) {
          // If the token exists, it will be attached to Authorization header
          config.headers.Authorization = `Bearer ${token}`; 
       }
       return config; // get token from the request
    },
    (error) => {
      return Promise.reject(error); // reject the promise with the error if the request fails
    }
);

// add a request interceptor to handle the expired token using response
apiClient.interceptors.response.use(
    (response) => response,
     async (error) => {
         const originalRequest = error.config; // the original request that caused the error
         if (error.response?.status === 401 && !originalRequest._retry) {
            // I get 401 error, and the request cannot be tried.
            originalRequest._retry = true; // mark the original request as retrying to prevent the infinite loop

            const state = store.getState(); 
            const refreshToken = state.auth.refreshToken; // get the refresh token from the auth state in the Redux store

            if (refreshToken) {
                const newAccessToken = await authService.refreshToken(refreshToken); // call the refresh token API to get a new access token
                
                if (newAccessToken) {
                    // dispatch the new access token and retry the original request
                    // setAccessToken: authSlice.ts -> reducer
                    store.dispatch(setAccessToken(newAccessToken));
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // update the Authorization header of the original request with the new access token
                    return apiClient(originalRequest); // retry the original request with the new access token
                }
            }

            // clear the user role when the user logs out
            // clearAuth: authSlice.ts -> reducer
            store.dispatch(clearAuth()); // clear the auth state in the Redux store

            // If the refresh fails, we actually direct the user to the login page
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login'; // redirect the user to the login page
            }

        }

        return Promise.reject(error); // reject the promise with the error if the request fails
     }
);