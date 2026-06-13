// hook: a React function that lets you hook into React features
//       -> state, context, lifecycle, etc.
//       -> You do not need to use class components
//       -> take a method and returns actions and state
import { IRootState } from "@/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { authService } from "@/services/api/auth.service";
export function useAuth() {
  
  // Step 1: create authState using useSelector hook
  //         register auth reducer in the store
  const authState = useSelector((state: IRootState) => state.auth); // get the auth state from the redux store
  const [isLoading, setIsLoading] = useState(false); // load the result
  const [error, setError] = useState<string | null>(null); // handle the authentication error

  const logout = async() => {
    setIsLoading(true);
    setError(null);

    // The User Interface (UI) can show the spinner
    try {
      await authService.logout();  // call the logout API to log the user out on the backend
                                   // Meaning: sends the request to the backend to log the user out
    } catch(error) {
      console.error("Logout failed", error); // The logout failed
    }

  }

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading,
    error,
    logout,
  };
}