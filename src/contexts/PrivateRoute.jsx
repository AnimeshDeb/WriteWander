import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
//We dont want the users to be able to come back to any of the web pages after they log out.
// Basically the below function checks if a user is logged in using useAuth. If the user
//is logged in, then the user will be able to have access to the website. However
// if the user isn't logged in, then they will be navigated to the login page,, even if they try to go
// back to the web pages.
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/signup" />;
}

export default PrivateRoute;
