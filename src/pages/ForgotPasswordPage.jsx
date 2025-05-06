// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { MDBContainer, MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { fakeForgotPassword } from "../api/fakeAuthApi";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { message } = await fakeForgotPassword({ email });
    setMessage(message);
    setLoading(false);
  };

  return (
    <MDBContainer
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh", background: "#f8f9fa" }}
    >
      <div
        style={{
          width: "360px",
          padding: "2rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        {!message ? (
          <>
            <h5 className="text-center mb-4">Mot de passe oublié</h5>
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="mb-4"
                label="Adresse e-mail"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBBtn className="w-100" type="submit" disabled={loading}>
                {loading ? <MDBSpinner size="sm" /> : "Envoyer le lien"}
              </MDBBtn>
            </form>
          </>
        ) : (
          <div className="text-center">
            <p>{message}</p>
          </div>
        )}
        <div className="text-center mt-3">
          <Link to="/login">← Retour à la connexion</Link>
        </div>
      </div>
    </MDBContainer>
  );
}
