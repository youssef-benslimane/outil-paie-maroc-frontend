import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";
import { createOne } from "../api/fakeParamAdminApi.js";
import SideBar from "../components/ConfigurateurSidebar.jsx";

export default function CreateEntityPage() {
  const { entity } = useParams(); // "societe", "contrat", …
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    await createOne(entity, form);
    navigate("/configurateur/param-admin");
  };

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <div style={{ marginLeft: "240px", width: "100%" }}>
        <MDBContainer
          className="mt-5 d-flex flex-column align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div style={{ maxWidth: "800px", width: "100%" }}>
            <h3 className="mb-4 text-center">Créer une nouvelle {entity}</h3>

            {entity === "societe" && (
              <>
                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Nom de la société"
                      name="nom"
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Adresse"
                      name="adresse"
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Ville"
                      name="ville"
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Identifiant fiscal"
                      name="identFiscal"
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Numéro CNSS"
                      name="cnss"
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Numéro ICE"
                      name="ice"
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Numéro RC"
                      name="rc"
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Date début"
                      name="debut"
                      type="date"
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Date fin"
                      name="fin"
                      type="date"
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
              </>
            )}

            <div className="mt-4 d-flex justify-content-end">
              <MDBBtn
                color="secondary"
                onClick={() => navigate(-1)}
                className="me-2"
              >
                Annuler
              </MDBBtn>
              <MDBBtn color="primary" onClick={handleSubmit}>
                Enregistrer
              </MDBBtn>
            </div>
          </div>
        </MDBContainer>
      </div>
    </div>
  );
}
