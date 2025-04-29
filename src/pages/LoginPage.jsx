// src/pages/LoginPage.jsx
import React, { useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import { fakeLogin } from "../api/fakeAuthApi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { token, user } = await fakeLogin({ email, password });
      login(token, user);
      switch (user.role) {
        case "ADMIN":
          return navigate("/admin");
        case "RH":
          return navigate("/rh");
        case "EMPLOYE":
          return navigate("/employe");
        case "CONFIGURATEUR":
          return navigate("/configurateur");
        default:
          return navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    // wrapper flex full viewport
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f8f9fa" }}
    >
      {/* container avec bordure */}
      <form onSubmit={handleSubmit}>
        <MDBContainer
          className="p-5"
          style={{
            width: "360px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          {error && <div className="text-danger mb-3 text-center">{error}</div>}

          <h4 className="text-center mb-4">Connexion</h4>

          <MDBInput
            wrapperClass="mb-4"
            label="Adresse e-mail"
            id="form1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MDBInput
            wrapperClass="mb-4"
            label="Mot de passe"
            id="form2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="d-flex justify-content-between align-items-center mb-4">
            <MDBCheckbox
              labelClass="small"
              wrapperClass="me-5"
              name="flexCheck"
              id="flexCheckDefault"
              label="Se souvenir de moi"
            />
            <a href="#!" className="small">
              Mot de passe oublié ?
            </a>
          </div>

          <MDBBtn className="w-100 mb-4" type="submit">
            Se connecter
          </MDBBtn>

          <div className="text-center">
            <p className="small mb-1">
              Pas encore membre ? <a href="#!">Inscrivez-vous</a>
            </p>
          </div>
        </MDBContainer>
      </form>
    </div>
  );
}
