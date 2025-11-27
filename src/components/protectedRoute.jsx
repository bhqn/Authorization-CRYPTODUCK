import { Navigate } from 'react-router-dom';

function ProtectedRoute ({isloggedIn, children}) {
    if(!isloggedIn){
        return <Navigate to='/login' replace/> 
    }
    return children;

}
export default ProtectedRoute;