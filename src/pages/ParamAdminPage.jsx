// src/pages/ParamAdminPage.jsx
import React, { useState, useEffect } from "react";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBBtn,
  MDBInput,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/ConfigurateurSidebar.jsx";
import { getAll, deleteOne } from "../api/fakeParamAdminApi.js";

export default function ParamAdminPage() {
  const [activeTab, setActiveTab] = useState("societe");
  const [search, setSearch] = useState("");
  const [data, setData] = useState({
    societe: [],
    contrat: [],
    categorie: [],
    statut: [],
    unite: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const refreshData = async () => {
    const list = await getAll(activeTab);
    setData((prev) => ({ ...prev, [activeTab]: list }));
  };

  const tabs = [
    { key: "societe", label: "Société", icon: "building" },
    { key: "contrat", label: "Contrat", icon: "file-contract" },
    { key: "categorie", label: "Catégorie", icon: "list" },
    { key: "statut", label: "Statut", icon: "id-badge" },
    { key: "unite", label: "Unité", icon: "sitemap" },
  ];

  const columns = {
    societe: [
      "ID",
      "Nom",
      "Ville",
      "ID Fiscal",
      "CNSS",
      "ICE",
      "RC",
      "Date Début",
      "Date Fin",
      "Actions",
    ],
    contrat: [
      "ID",
      "Code",
      "Nom",
      "Période d’essai",
      "Conditions",
      "Date Début",
      "Date Fin",
      "Actions",
    ],
    categorie: ["ID", "Code", "Nom", "Actions"],
    statut: ["ID", "Code", "Nom", "Actions"],
    unite: ["ID", "Code", "Nom", "Actions"],
  };

  const fieldKeys = {
    societe: [
      "id",
      "nom",
      "ville",
      "identFiscal",
      "cnss",
      "ice",
      "rc",
      "debut",
      "fin",
    ],
    contrat: ["id", "code", "nom", "essai", "conditions", "debut", "fin"],
    categorie: ["id", "code", "nom"],
    statut: ["id", "code", "nom"],
    unite: ["id", "code", "nom"],
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
    setSearch("");
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const filtered = data[activeTab].filter((row) =>
    Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleCreateClick = () => {
    navigate(`/configurateur/param-admin/${activeTab}/create`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet enregistrement ?")) {
      await deleteOne(activeTab, id);
      refreshData();
    }
  };

  return (
    <div className="d-flex">
      <SideBar />
      <div style={{ marginLeft: "240px", width: "100%" }}>
        <MDBContainer className="mt-4">
          <h2>Paramétrage des données administratives</h2>

          <MDBRow className="my-4 align-items-center">
            <MDBCol md="8">
              <MDBTabs className="flex-nowrap">
                {tabs.map(({ key, label, icon }) => (
                  <MDBTabsItem key={key} style={{ flex: "0 0 auto" }}>
                    <MDBTabsLink
                      onClick={() => toggleTab(key)}
                      active={activeTab === key}
                      className="d-flex align-items-center me-3"
                      style={{ padding: "0.5rem 1rem" }}
                    >
                      <MDBIcon fas icon={icon} className="me-1" />
                      {label}
                    </MDBTabsLink>
                  </MDBTabsItem>
                ))}
              </MDBTabs>
            </MDBCol>
            <MDBCol
              md="4"
              className="d-flex justify-content-end align-items-center"
            >
              <MDBInput
                placeholder="Rechercher..."
                value={search}
                onChange={handleSearch}
                style={{ width: "140px", fontSize: "0.85rem" }}
              />
              <MDBBtn
                className="ms-2"
                color="primary"
                onClick={handleCreateClick}
                style={{ height: "36px", padding: "0 1rem" }}
              >
                <MDBIcon fas icon="plus" className="me-1" />
                Créer
              </MDBBtn>
            </MDBCol>
          </MDBRow>

          <MDBTable>
            <MDBTableHead>
              <tr>
                {columns[activeTab].map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  {fieldKeys[activeTab].map((field, i) => (
                    <td key={i}>{row[field]}</td>
                  ))}
                  <td>
                    <MDBIcon
                      fas
                      icon="edit"
                      className="me-2"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(
                          `/configurateur/param-admin/edit/${activeTab}/${row.id}`
                        )
                      }
                    />
                    <MDBIcon
                      fas
                      icon="trash"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(row.id)}
                    />
                  </td>
                </tr>
              ))}
            </MDBTableBody>
          </MDBTable>
        </MDBContainer>
      </div>
    </div>
  );
}
