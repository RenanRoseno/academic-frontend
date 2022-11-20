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
import CloseIcon from "@mui/icons-material/Close";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import "../App.css";
import InputMask from "react-input-mask";
import Form from "react-bootstrap/Form";
import { showAlertSuccess, showAlertError } from "../layout/Alerts";
import { ERROR, SUCCESS, SUCCESS_MESSAGE } from "../utils/messages";

const columns = [
  { field: "id", headerName: "#", width: 50 },
  {
    field: "name",
    headerName: "Nome",
    width: 250,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
    editable: true,
  },
  {
    field: "register",
    headerName: "Identificação",
    width: 250,
    editable: true,
  },
  {
    field: "phone",
    headerName: "Telefone",
    width: 200,
    editable: true,
  },
  // {
  //   field: "fullName",
  //   headerName: "Full name",
  //   description: "This column has a value getter and is not sortable.",
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (params) =>
  //     `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  // },
];

export default function Professor() {
  const [professors, setProfessors] = useState([]);
  const [professor, setProfessor] = useState({
    name: "",
    email: "",
    cpf: "",
    register: "",
    phone: "",
  });
  const [selectedProfessor, setSelectedProfessor] = useState({});
  const { name, email, cpf, register, phone } = professor;
  const [num, setNum] = useState("");
  const [disable, setDisable] = useState(true);

  // let selectedProfessor = null;

  useEffect(() => {
    loadProfessors();
  }, []);

  const disableEdit = () => !!selectedProfessor;
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      professors.find((row) => row.id === id)
    );
    if (selectedRowsData.length > 0) {
      setSelectedProfessor(selectedRowsData[0]);
      console.log(selectedProfessor);
      setDisable(false);
    } else {
      setSelectedProfessor({});
      clear();
      setDisable(true);
    }
  };

  const loadProfessors = async () => {
    const result = await axios.get("http://localhost:8080/professors/");
    setProfessors(result.data);
    console.log(result.data);
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowEdit = () => {
    handleShow();
    loadUser();
  };
  const handleNumChange = (event) => {
    const limit = 13;
    setNum(event.target.value.slice(0, limit));
  };

  const onInputChange = (e) => {
    setProfessor({ ...professor, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    professor.register = num;
    console.log(professor);
    if(selectedProfessor.id){
      await axios
      .put(`http://localhost:8080/professors/${selectedProfessor.id}`, professor)
      .then(function (response) {
        handleClose();
        loadProfessors();
        showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
      })
      .catch(function (error) {
        console.log(error)
        showAlertError(ERROR, error.response.data.message);
      });
    } else {
      await axios
      .post("http://localhost:8080/professors/", professor)
      .then(function (response) {
        handleClose();
        loadProfessors();
        showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
      })
      .catch(function (error) {
        showAlertError(ERROR, error.response.data.message);
      });
    }
  };

  const deleteProfessor = async () => {
    await axios
      .delete(`http://localhost:8080/professors/${selectedProfessor.id}`)
      .then(function (response) {
        loadProfessors();
        showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
      })
      .catch(function (error) {
        showAlertError(ERROR, error.response.data.message);
      });
  };
  const clear = () => {
    setProfessor({
      name: "",
      email: "",
      cpf: "",
      register: "",
      phone: "",
    });

    setNum("");
  };

  const loadUser = async () => {
    console.log(selectedProfessor);
    const result = await axios.get(
      `http://localhost:8080/professors/${selectedProfessor.id}`
    );
    setProfessor(result.data);
    setNum(result.data.register);
  };

  
  return (
    <div className="container mt-4">
      <Box sx={{ height: 550, width: "100%" }}>
        <h3>Gerenciamento de professores</h3>
        {/* <Button
        sx={{ mb: 2 }}
        onClick={() => setCheckboxSelection(!checkboxSelection)}
      >
        Toggle checkbox selection
      </Button> */}
        <DataGrid
          rows={professors}
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
            <Button variant="btn btn-light" disabled={disable} onClick={()=> deleteProfessor(professor.id)}>
              <DeleteForeverIcon />
            </Button>
          </div>
        </div>

        {/* &nbsp;
      <Button variant="btn btn-light" onClick={handleShow}>
        <SaveIcon />
      </Button> */}
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
          <Modal.Title>{selectedProfessor.id ? 'Editar' : 'Cadastrar'} Professor</Modal.Title>
        </Modal.Header>
        <form onSubmit={(e) => onSubmit(e)}>
          <Modal.Body>
            {/* Woohoo, you're reading this text in a modal! */}

            {/* <div className="form-row"> */}
            <div className="row form">
              <div className="col-md-9">
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
                <label htmlFor="phone">Telefone</label>
                <Form.Control
                  as={InputMask}
                  mask="(99) 99999 9999"
                  name="phone"
                  value={phone || ""}
                  onChange={(e) => onInputChange(e)}
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="inputEmail4" className="required">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail4"
                  placeholder="Email"
                  name="email"
                  value={email || ""}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="phone" className="required">
                  CPF
                </label>
                <Form.Control
                  as={InputMask}
                  mask="999.999.999-99"
                  placeholder="Digite se CPF"
                  name="cpf"
                  value={cpf || ""}
                  onChange={(e) => onInputChange(e)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label htmlFor="rg" className="required">
                  RG
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
            </div>
            {/* </div> */}
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
