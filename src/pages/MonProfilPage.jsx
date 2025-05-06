// src/pages/MonProfilPage.jsx
import React, { useState, useEffect } from "react";
import SideBar from "../components/SideBar.jsx";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import {
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { useAuth } from "../contexts/AuthContext.jsx";
import { fakeGetProfile } from "../api/fakeAuthApi.js";

export default function MonProfilPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    nom: "",
    prenom: "",
    username: "",
    cin: "",
    email_pro: "",
    email_perso: "",
    adresse: "",
    ville: "",
    telephone: "",
    date_naissance: "",
    lieu_naissance: "",
    genre: "",
    nationalite: "",
    situation_familiale: "",
    enfants_a_charge: "",
    permis_conduire: false,
    mobilite_geographique: "",
    langues_parlees: "",
    contact_urgence: "",
    etat_compte: "",
    date_creation: "",
    date_modification: "",
  });

  useEffect(() => {
    fakeGetProfile(user.id).then((data) => setProfile(data));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log("Enregistrer ce profil :", profile);
    // ici tu appelleras ton API pour sauvegarder
  };

  const handleCancel = () => {
    // si tu veux réinitialiser les valeurs ou naviguer ailleurs
    fakeGetProfile(user.id).then((data) => setProfile(data));
  };

  return (
    <div className="d-flex">
      <SideBar />

      <div style={{ marginLeft: "240px", width: "100%" }}>
        <MDBContainer className="mt-4">
          <h3>Mon profil</h3>

          <MDBRow className="gy-3">
            <MDBCol md="4">
              <MDBInput
                label="Nom de famille"
                name="nom"
                value={profile.nom}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Prénom"
                name="prenom"
                value={profile.prenom}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Identifiant"
                name="username"
                value={profile.username}
                onChange={handleChange}
              />
            </MDBCol>

            <MDBCol md="4">
              <MDBInput
                label="CIN"
                name="cin"
                value={profile.cin}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Email pro"
                type="email"
                name="email_pro"
                value={profile.email_pro}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Email perso"
                type="email"
                name="email_perso"
                value={profile.email_perso}
                onChange={handleChange}
              />
            </MDBCol>

            <MDBCol md="4">
              <MDBInput
                label="Adresse"
                name="adresse"
                value={profile.adresse}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Ville"
                name="ville"
                value={profile.ville}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Téléphone"
                name="telephone"
                value={profile.telephone}
                onChange={handleChange}
              />
            </MDBCol>

            <MDBCol md="4">
              <MDBInput
                label="Date de naissance"
                type="date"
                name="date_naissance"
                value={profile.date_naissance}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Lieu de naissance"
                name="lieu_naissance"
                value={profile.lieu_naissance}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Genre (M/F/Autre)"
                name="genre"
                value={profile.genre}
                onChange={handleChange}
              />
            </MDBCol>

            <MDBCol md="4">
              <MDBInput
                label="Nationalité"
                name="nationalite"
                value={profile.nationalite}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Situation familiale"
                name="situation_familiale"
                value={profile.situation_familiale}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Enfants à charge"
                type="number"
                name="enfants_a_charge"
                value={profile.enfants_a_charge}
                onChange={handleChange}
              />
            </MDBCol>

            <MDBCol md="4" className="d-flex align-items-center">
              <MDBCheckbox
                label="Permis de conduire"
                name="permis_conduire"
                checked={profile.permis_conduire}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Mobilité géographique"
                name="mobilite_geographique"
                value={profile.mobilite_geographique}
                onChange={handleChange}
              />
            </MDBCol>

            <MDBCol md="8">
              <MDBInput
                label="Langues parlées"
                name="langues_parlees"
                value={profile.langues_parlees}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="8">
              <MDBInput
                label="Contact d’urgence"
                name="contact_urgence"
                value={profile.contact_urgence}
                onChange={handleChange}
              />
            </MDBCol>

            <MDBCol md="4">
              <MDBInput
                label="État du compte"
                name="etat_compte"
                value={profile.etat_compte}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Date création"
                type="date"
                name="date_creation"
                value={profile.date_creation}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                label="Date modification"
                type="date"
                name="date_modification"
                value={profile.date_modification}
                onChange={handleChange}
              />
            </MDBCol>
          </MDBRow>

          <div className="d-flex justify-content-end mt-4">
            <MDBBtn outline className="me-2" onClick={handleCancel}>
              Annuler
            </MDBBtn>
            <MDBBtn onClick={handleSave}>Enregistrer</MDBBtn>
          </div>
        </MDBContainer>
      </div>
    </div>
  );
}
