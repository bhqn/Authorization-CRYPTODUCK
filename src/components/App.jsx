import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import "./styles/App.css";
import ProtectedRoute from "./protectedRoute";
import * as auth from "../utils/auth";
import { setToken, getToken } from "../utils/token";
import * as api from "../utils/api"

function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false); //boleando para autenticacao
  const navigate = useNavigate();

   // Invoque o hook. É preciso fazer isso em ambos
  // os componentes.

  const location = useLocation();



  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth
        .register(username, password, email)
        .then(() => {
          console.log("registro bem sucedido");
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  // handleLogin aceita um parâmetro: um objeto com duas propriedades.
  const handleLogin = ({ username, password }) => {
    if (!username || !password) {
      return;
    }
    auth
      .authorize(username, password)
      .then((data) => {
        if (data.jwt) {
          setToken(data.jwt);
          setUserData(data.user);
          setIsLoggedIn(true);
            // Depois do login, em vez de sempre acessar /ducks, 
          // navegue até o local armazenado no estado. Se
          // não houver um local armazenado, vamos redirecionar 
          // para /ducks por padrão.
          const redirectPath = location.state?.from?.pathname || "/ducks";


          navigate(redirectPath);
        }
        console.log(data);
      })
      .catch(console.error);
  };

    useEffect(() => {
    const jwt = getToken();
    console.log("Token encontrado:", jwt); // ← Adicione isso

    if(!jwt){
      return;
    }

    // Chame a função, passando-a para o JWT.
    
    api.getUserInfo(jwt).then(({username, email}) => {
       // Se a resposta for bem-sucedida, permita o login do usuário, salve seus
            // dados no estado e mande ele para /ducks.
            console.log("Dados do usuário:", {username, email}); 
            setIsLoggedIn(true);
            setUserData({username, email});
         

    }).catch(console.error)
  
// TODO - manipular JWT
  }, []);

  return (
    <Routes>
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            {" "}
            <Ducks />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData} />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
        }
      />
      <Route
        path="*"
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <Navigate to="/login" replace />
          ) //ternario de redirecionamento
        }
      />
    </Routes>
  );
}

export default App;
