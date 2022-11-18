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
  const [disable, setDisable] = useState(true);
  const [checkboxSelection, setCheckboxSelection] = React.useState(true);
  let selectedParam = null;

  useEffect(() => {
    loadProfessors();
  }, []);

  const disableEdit = () => !!selectedParam;
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      professors.find((row) => row.id === id)
    );
    if (selectedRowsData.length > 0) {
      selectedParam = selectedRowsData[0];
      setDisable(false);
    } else {
      selectedParam = null;
      setDisable(true);
    }

    console.log(selectedRowsData);
  };

  const loadProfessors = async () => {
    const result = await axios.get("http://localhost:8080/professors/");
    setProfessors(result.data);
    console.log(result.data);
  };

  const teste = (params) => {
    console.log(selectedParam);
    return selectedParam ? params.row.id === selectedParam.id : true;
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container mt-4">
      <Box sx={{ height: 400, width: "100%" }}>
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
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={checkboxSelection}
          experimentalFeatures={{ newEditingApi: true }}
          onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
          // isRowSelectable={(params) => teste(params)}
        />
      </Box>
      <div className="d-flex justify-content-end mt-5">
        <div className="row ">
          <div className="col-md-3 ml-md-auto">
            {" "}
            <Button variant="btn btn-light" onClick={handleShow}>
              <AddIcon />
            </Button>
          </div>
          <div className="col-md-3 ml-md-auto">
            <Button
              variant="btn btn-light"
              onClick={handleShow}
              disabled={disable}
            >
              <EditIcon />
            </Button>
          </div>
          <div className="col-md-3 ml-md-auto">
            <Button variant="btn btn-light" onClick={handleShow}>
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
          <Modal.Title>Cadastrar/Editar Professor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Woohoo, you're reading this text in a modal! */}
          <form>
            {/* <div className="form-row"> */}
            <div className="row">
              <div className="col-md-6">
                <label for="inputEmail4">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="inputEmail4"
                  placeholder="Email"
                />
              </div>
              <div className=" col-md-6">
                <label for="inputPassword4">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="inputPassword4"
                  placeholder="Password"
                />
              </div>
            </div>
            {/* </div> */}
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="btn btn-light" onClick={handleClose}>
            <CleaningServicesIcon />
          </Button>
          <Button name="aaa" variant="btn btn-light" onClick={handleClose}>
            <SaveIcon />
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
