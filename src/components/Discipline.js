import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import "../App.css";
import InputMask from "react-input-mask";
import Form from "react-bootstrap/Form";
import { showAlertSuccess, showAlertError } from "../layout/Alerts";
import { ERROR, SUCCESS, SUCCESS_MESSAGE } from "../utils/messages";

const columns = [
  {
    field: "name",
    headerName: "Nome",
    width: 250,
    editable: true,
  },
  {
    field: "workLoad",
    headerName: "Carga Horária",
    width: 250,
    editable: true,
  },
  {
    field: "abbreviation",
    headerName: "Sigla",
    width: 250,
    editable: true,
  },
];

export default function Discipline() {
  const [disciplines, setDisciplines] = useState([]);
  const [discipline, setDiscipline] = useState({
    name: "",
    workLoad: "",
    abbreviation: ""
  });
  const [selectedDiscipline, setSelectedDiscipline] = useState({});
  const { name, workLoad, abbreviation} = discipline;
  const [num, setNum] = useState("");
  const [disable, setDisable] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    loadDisciplines();
  }, []);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      disciplines.find((row) => row.id === id)
    );
    if (selectedRowsData.length > 0) {
      setSelectedDiscipline(selectedRowsData[0]);
      setDisable(false);
    } else {
      setSelectedDiscipline({});
      clear();
      setDisable(true);
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => {
    clear();
    setShow(true)
  };

  const handleShowEdit = () => {
    handleShow();
    loadDiscipline();
  };

  const handleNumChange = (event) => {
    const limit = 3;
    setNum(event.target.value.slice(0, limit));
  };

  const onInputChange = (e) => {
    setDiscipline({ ...discipline, [e.target.name]: e.target.value.toUpperCase() });
  };

  const loadDisciplines = async () => {
    const result = await axios.get("http://localhost:8080/disciplines/");
    setDisciplines(result.data);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    discipline.workLoad = num;
    if (selectedDiscipline.id) {
      await axios
        .put(
          `http://localhost:8080/disciplines/${selectedDiscipline.id}`,
          discipline
        )
        .then(function (response) {
          handleClose();
          loadDisciplines();
          showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
        })
        .catch(function (error) {
          showAlertError(ERROR, error.response.data.message);
        });
    } else {
      await axios
        .post("http://localhost:8080/disciplines/", discipline)
        .then(function (response) {
          handleClose();
          loadDisciplines();
          showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
        })
        .catch(function (error) {
          showAlertError(ERROR, error.response.data.message);
        });
    }
  };

  const deleteDiscipline  = async () => {
    await axios
      .delete(`http://localhost:8080/disciplines/${selectedDiscipline.id}`)
      .then(function (response) {
        loadDisciplines();
        showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
      })
      .catch(function (error) {
        showAlertError(ERROR, error.response.data.message);
      });
  };

  const clear = () => {
    setDiscipline({
      name: "",
      workLoad: "",
      abbreviation:"",
    });
    setNum("");
  };

  const loadDiscipline = async () => {
    const result = await axios.get(
      `http://localhost:8080/disciplines/${selectedDiscipline.id}`
    );
    setDiscipline(result.data);
    setNum(result.data.workLoad);
  };

  return (
    <div className="container mt-4">
      <Box sx={{ height: 550, width: "100%" }}>
        <h3>Gerenciamento de disciplinas</h3>
        <DataGrid
          rows={disciplines}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          experimentalFeatures={{ newEditingApi: true }}
          onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
        />
      </Box>
      <div className="d-flex justify-content-end mt-5">
        <div className="row ">
          <div className="col-md-3 ml-md-auto">
            <Button variant="btn btn-light" onClick={handleShow}>
              <AddIcon />
            </Button>
          </div>
          <div className="col-md-3 ml-md-auto">
            <Button
              variant="btn btn-light"
              onClick={handleShowEdit}
              disabled={disable}
            >
              <EditIcon />
            </Button>
          </div>
          <div className="col-md-3 ml-md-auto">
            <Button
              variant="btn btn-light"
              disabled={disable}
              onClick={() => deleteDiscipline(discipline.id)}
            >
              <DeleteForeverIcon />
            </Button>
          </div>
        </div>
      </div>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedDiscipline.id ? "Editar" : "Cadastrar"} Disciplina
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={(e) => onSubmit(e)}>
          <Modal.Body>
            <div className="row form">
              <div className="col-md-6">
                <label htmlFor="name" className="required">
                  Nome
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  name="name"
                  value={name || ""}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="rg" className="required">
                  Carga horária
                </label>
                <input
                  maxLength={9}
                  type="number"
                  className="form-control"
                  onChange={handleNumChange}
                  name="register"
                  value={num || ""}
                  id="rg"
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="rg" className="required">
                  Sigla
                </label>
                <input
                  maxLength={5}
                  type="text"
                  className="form-control"
                  id="abbreviation"
                  required
                  name="abbreviation"
                  value={abbreviation || ""}
                  onChange={(e) => onInputChange(e)}
                />
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="btn btn-light" onClick={clear}>
              <CleaningServicesIcon />
            </Button>
            <Button type="submit" name="aaa" variant="btn btn-light">
              <SaveIcon />
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
