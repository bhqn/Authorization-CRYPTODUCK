import { useContext } from "react";
import { Navigate } from 'react-router-dom';
import AppContext from '../contexts/AppContext';

function ProtectedRoute({ children, anonymous = false }) {
    const { isLoggedIn } = useContext(AppContext);
    
    if (!isLoggedIn && !anonymous) {
        return <Navigate to='/login' replace/>;
    }
    
    if (isLoggedIn && anonymous) {
        return <Navigate to='/ducks' replace/>;
    }
    
    return children;
}

export default ProtectedRoute;