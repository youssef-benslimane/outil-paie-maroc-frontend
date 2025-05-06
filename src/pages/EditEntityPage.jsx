// src/pages/EditEntityPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { getOne, updateOne } from "../api/fakeParamAdminApi.js";
import SideBar from "../components/ConfigurateurSidebar.jsx";

export default function EditEntityPage() {
  const { entity, id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getOne(entity, parseInt(id));
      setForm(data);
    }
    fetchData();
  }, [entity, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    await updateOne(entity, parseInt(id), form);
    navigate("/configurateur/param-admin");
  };

  if (!form) return null;

  return (
    <div style={{ display: "flex" }}>
      <SideBar />
      <div style={{ marginLeft: "240px", width: "100%" }}>
        <MDBContainer
          className="mt-5 d-flex flex-column align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div style={{ maxWidth: "800px", width: "100%" }}>
            <h3 className="mb-4 text-center">
              Modifier l’enregistrement : {entity}
            </h3>

            {entity === "societe" && (
              <>
                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Nom de la société"
                      name="nom"
                      value={form.nom || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Adresse"
                      name="adresse"
                      value={form.adresse || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Ville"
                      name="ville"
                      value={form.ville || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Identifiant fiscal"
                      name="identFiscal"
                      value={form.identFiscal || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Numéro CNSS"
                      name="cnss"
                      value={form.cnss || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Numéro ICE"
                      name="ice"
                      value={form.ice || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBInput
                  label="Numéro RC"
                  name="rc"
                  wrapperClass="mb-3"
                  value={form.rc || ""}
                  onChange={handleChange}
                />

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Date début"
                      type="date"
                      name="debut"
                      value={form.debut || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Date fin"
                      type="date"
                      name="fin"
                      value={form.fin || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>
              </>
            )}

            {entity === "contrat" && (
              <>
                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Code du contrat"
                      name="code"
                      value={form.code || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Nom du contrat"
                      name="nom"
                      value={form.nom || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Période d’essai"
                      name="essai"
                      value={form.essai || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput
                      label="Date début"
                      type="date"
                      name="debut"
                      value={form.debut || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBRow className="mb-3">
                  <MDBCol>
                    <MDBInput
                      label="Date fin"
                      type="date"
                      name="fin"
                      value={form.fin || ""}
                      onChange={handleChange}
                    />
                  </MDBCol>
                </MDBRow>

                <MDBTextArea
                  label="Conditions spécifiques"
                  name="conditions"
                  rows={3}
                  value={form.conditions || ""}
                  onChange={handleChange}
                />
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
              <MDBBtn color="success" onClick={handleSubmit}>
                Sauvegarder les modifications
              </MDBBtn>
            </div>
          </div>
        </MDBContainer>
      </div>
    </div>
  );
}
