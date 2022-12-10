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
import { showAlertSuccess, showAlertError } from "../layout/Alerts";
import { ERROR, SUCCESS, SUCCESS_MESSAGE } from "../utils/messages";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";


const columns = [
  {
    field: "courseDesc",
    headerName: "Curso",
    width: 250,
    editable: true,
  },
  {
    field: "name",
    headerName: "Nome",
    width: 250,
    editable: true,
  },
];
export default function Class() {
  const [classRooms, setClassRooms] = useState([]);
  const [disciplinesBD, setDisciplinesBD] = useState([]);
  const [courses, setCourses] = useState([]);
  const [disciplinesForm, setDisciplinesForm] = useState([]);
  const [classRoom, setClassRoom] = useState({
    name: "",
    disciplines: "",
    course: "",
  });
  const [selectedClassRoom, setSelectedClassRoom] = useState({});
  const { name, disciplines, course } = classRoom;
  const [courseForm, setCourseForm] = useState({});
  const [disable, setDisable] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    loadClassrooms();
  }, []);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      classRooms.find((row) => row.id === id)
    );
    if (selectedRowsData.length > 0) {
      setSelectedClassRoom(selectedRowsData[0]);
      setDisable(false);
    } else {
      setSelectedClassRoom({});
      clear();
      setDisable(true);
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => {
    clear();
    loadCourses();
    loadDisciplines();
    setShow(true);
  };

  const handleShowEdit = () => {
    handleShow();
    loadCourses();
    loadDisciplines();
    loadSelectedCurriculumMatrix();
  };

  const onInputChange = (e) => {
    setClassRoom({
      ...classRoom,
      [e.target.name]: e.target.value,
    });
  };

  const loadClassrooms = async () => {
    const result = await axios.get("http://localhost:8080/classes/");
    setClassRooms(result.data);
  };

  const loadCourses = async () => {
    const result = await axios.get("http://localhost:8080/courses/");
    setCourses(result.data);
  };

  const loadDisciplines = async () => {
    const result = await axios.get("http://localhost:8080/disciplines/");
    setDisciplinesBD(result.data);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const discipl = [];
    discipl.push(disciplinesForm);
    classRoom.disciplines = discipl;
    classRoom.course = courseForm;

    if (selectedClassRoom.id) {
      await axios
        .put(`http://localhost:8080/classes/${selectedClassRoom.id}`, classRoom)
        .then(function (response) {
          handleClose();
          loadClassrooms();
          showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
        })
        .catch(function (error) {
          showAlertError(ERROR, error.response.data.message);
        });
    } else {
      await axios
        .post("http://localhost:8080/classes/", classRoom)
        .then(function (response) {
          handleClose();
          loadClassrooms();
          showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
        })
        .catch(function (error) {
          showAlertError(ERROR, error.response.data.message);
        });
    }
  };

  const deleteClassroom = async () => {
    await axios
      .delete(`http://localhost:8080/classes/${selectedClassRoom.id}`)
      .then(function (response) {
        loadClassrooms();
        showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
      })
      .catch(function (error) {
        showAlertError(ERROR, error.response.data.message);
      });
  };

  const clear = () => {
    setClassRoom({
      name: "",
      disciplines: "",
      course: "",
    });
    setCourseForm({});
    setDisciplinesForm([]);
  };

  const loadSelectedCurriculumMatrix = async () => {
    const result = await axios.get(
      `http://localhost:8080/classes/${selectedClassRoom.id}`
    );
    const classRoomDB = result.data;
    setClassRoom(classRoomDB);
    setCourseForm(classRoomDB.course);
    setDisciplinesForm(classRoomDB.disciplines[0]);
  };

  return (
    <div className="container mt-4">
      <Box sx={{ height: 550, width: "100%" }}>
        <h3>Gerenciamento de turmas</h3>
        <DataGrid
          rows={classRooms}
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
              onClick={() => deleteClassroom(classRoom.id)}
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
            {selectedClassRoom.id ? "Editar" : "Cadastrar"} turma
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

              <div className="col-md-6">
                <label htmlFor="rg" className="required">
                  Curso
                </label>
                <Autocomplete
                  id="tags-outlined"
                  size="small"
                  options={courses}
                  value={courseForm || ""}
                  getOptionLabel={(option) => option.name || ""}
                  freeSolo
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(event, val) => setCourseForm(val)}
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="rg" className="required">
                  Disciplina
                </label>
                <Autocomplete
                  id="tags-outlined"
                  options={disciplinesBD}
                  getOptionLabel={(option) => option.name || ""}
                  name="disciplines"
                  value={disciplinesForm || ""}
                  onChange={(event, val) => setDisciplinesForm(val)}
                  renderInput={(params) => <TextField {...params} />}
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
