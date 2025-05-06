import React from "react";
import { Link } from "react-router-dom";
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
} from "mdb-react-ui-kit";

export default function NavBar() {
  return (
    <MDBNavbar light bgColor="light">
      <MDBContainer fluid>
        <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
          <MDBNavbarItem>
            <MDBNavbarLink tag={Link} to="/profil">
              Mon profil
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink tag={Link} to="/demande-document">
              Demande des documents
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink tag={Link} to="/demande-conges">
              Demande des congés
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink tag={Link} to="/fiches-paie">
              Mes fiches de paie
            </MDBNavbarLink>
          </MDBNavbarItem>
          <MDBNavbarItem>
            <MDBNavbarLink tag={Link} to="/mot-de-passe-oublie">
              Modifier mot de passe
            </MDBNavbarLink>
          </MDBNavbarItem>
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
}
