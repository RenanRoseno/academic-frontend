import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
// import Button from '@mui/material/Button';
import axios from "axios";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

const columns = [
  { field: "id", headerName: "#", width: 90 },
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


export default function Home() {
  const [professors, setProfessors]=useState([])

  useEffect(() => {
    loadProfessors();
  }, []);


  const [checkboxSelection, setCheckboxSelection] = React.useState(true);
  
  let selectedParam = null

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => professors.find((row) => row.id === id));
    if(selectedRowsData){
      selectedParam = selectedRowsData[0];
    } else {
      selectedParam = null;
    }
    
    console.log(selectedRowsData);
  };
  
  const loadProfessors= async () => {
    const result = await axios.get("http://localhost:8080/professors/")
    setProfessors(result.data)
    console.log(result.data);

  }
  const teste = (params) => {
    console.log(selectedParam);
    return selectedParam ? params.row.id === selectedParam.id : true;
    
  }
  
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="container">
          
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
      <div class="d-flex justify-content-end mt-5">
     <div class="row ">
     <div class="col-md-3 ml-md-auto">  <Button variant="btn btn-light" onClick={handleShow}>
        <AddIcon />
      </Button></div>
      <div class="col-md-3 ml-md-auto"><Button variant="btn btn-light" onClick={handleShow}>
        <EditIcon />
      </Button></div>
      <div class="col-md-3 ml-md-auto"><Button variant="btn btn-light" onClick={handleShow}>
        <DeleteForeverIcon />
      </Button></div>
      </div>
    
      {/* &nbsp;
      <Button variant="btn btn-light" onClick={handleShow}>
        <SaveIcon />
      </Button> */}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
    </div>
  );
}
