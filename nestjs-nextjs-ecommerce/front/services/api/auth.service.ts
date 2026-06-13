import { apiClient } from "./axios.config";
export const authService = {
  
  logout: async (): Promise<void> => {
    try {
       // Inside this function, I need to call apiClient.post
       await apiClient.post('/auth/logout'); // call the logout API to log the user out on the backend
    } catch (error) {
       // throw the error
       console.error("Logout failed", error);
    }
  },
  refreshToken: async (refreshToken: string): Promise<string | null> => {
    
    if (!refreshToken) return null;

    try {
      const response = await apiClient.post<{accessToken: string}>(
        '/auth/refresh-token',
        { refreshToken },
       );
       
       const { accessToken } = response.data; // get the new access token from the response data
       return accessToken; // return the new access token
    
    } catch (error) {
       console.error("Token refresh failed", error);
       return null;
    }

    
  },

}