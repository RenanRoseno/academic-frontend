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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { format } from "date-fns";

const columns = [
  {
    field: "courseDesc",
    headerName: "Curso",
    width: 250,
    editable: true,
  },
  {
    field: "dateDesc",
    headerName: "Data de vigência",
    width: 250,
    editable: true,
  },
];
export default function CurriculumMatrices() {
  const [curriculumMatrices, setCurriculumMatrices] = useState([]);
  const [disciplinesBD, setDisciplinesBD] = useState([]);
  const [courses, setCourses] = useState([]);
  const [disciplinesForm, setDisciplinesForm] = useState([]);
  const [curriculumMatrix, setCurriculumMatrix] = useState({
    vigencyDate: "",
    disciplines: "",
    course: "",
  });
  const [selectedCurriculumMatrix, setSelectedCurriculumMatrix] = useState({});
  const { vigencyDate, disciplines, course } = curriculumMatrix;
  const [courseForm, setCourseForm] = useState({});
  const [num, setNum] = useState("");
  const [disable, setDisable] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    loadCurriculumMatrices();
  }, []);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      curriculumMatrices.find((row) => row.id === id)
    );

    if (selectedRowsData.length > 0) {
      setSelectedCurriculumMatrix(selectedRowsData[0]);
      setDisable(false);
    } else {
      setSelectedCurriculumMatrix({});
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
    setCurriculumMatrix({
      ...curriculumMatrix,
      [e.target.name]: e.target.value,
    });
  };

  const loadCurriculumMatrices = async () => {
    const result = await axios.get(
      "http://localhost:8080/curriculum-matrices/"
    );
    setCurriculumMatrices(result.data);
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
    curriculumMatrix.disciplines = disciplinesForm;
    curriculumMatrix.course = courseForm;
    if (selectedCurriculumMatrix.id) {
      await axios
        .put(
          `http://localhost:8080/curriculum-matrices/${selectedCurriculumMatrix.id}`,
          curriculumMatrix
        )
        .then(function (response) {
          handleClose();
          loadCurriculumMatrices();
          showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
        })
        .catch(function (error) {
          showAlertError(ERROR, error.response.data.message);
        });
    } else {
      await axios
        .post("http://localhost:8080/curriculum-matrices/", curriculumMatrix)
        .then(function (response) {
          handleClose();
          loadCurriculumMatrices();
          showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
        })
        .catch(function (error) {
          showAlertError(ERROR, error.response.data.message);
        });
    }
  };

  const deleteCurriculumMatrix = async () => {
    await axios
      .delete(
        `http://localhost:8080/curriculum-matrices/${selectedCurriculumMatrix.id}`
      )
      .then(function (response) {
        loadCurriculumMatrices();
        showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
      })
      .catch(function (error) {
        showAlertError(ERROR, error.response.data.message);
      });
  };

  const clear = () => {
    setCurriculumMatrix({
      vigencyDate: "",
      disciplines: "",
      course: "",
    });
    setCourseForm({});
    setDisciplinesForm([]);
  };

  const loadSelectedCurriculumMatrix = async () => {
    const result = await axios.get(
      `http://localhost:8080/curriculum-matrices/${selectedCurriculumMatrix.id}`
    );
    const curriculumMatrixDB = result.data;
    curriculumMatrixDB.vigencyDate = format(
      new Date(result.data.vigencyDate),
      "yyyy-MM-dd"
    );
    setCurriculumMatrix(curriculumMatrixDB);
    setCourseForm(curriculumMatrixDB.course);
    setDisciplinesForm(curriculumMatrixDB.disciplines);
  };

  return (
    <div className="container mt-4">
      <Box sx={{ height: 550, width: "100%" }}>
        <h3>Gerenciamento de matrizes curriculares</h3>
        <DataGrid
          rows={curriculumMatrices}
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
              onClick={() => deleteCurriculumMatrix(curriculumMatrix.id)}
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
            {selectedCurriculumMatrix.id ? "Editar" : "Cadastrar"} matriz
            curricular
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={(e) => onSubmit(e)}>
          <Modal.Body>
            <div className="row form">
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
              <div className="col-md-6">
                <label htmlFor="date" className="required">
                  Vigência
                </label>
                <br />
                <TextField
                  id="date"
                  type="date"
                  name="vigencyDate"
                  onChange={onInputChange}
                  size="small"
                  value={vigencyDate || null}
                />
              </div>
              <div className="col-md-12">
                <label htmlFor="rg" className="required">
                  Disciplinas
                </label>
                <Autocomplete
                  id="tags-outlined"
                  multiple
                  options={disciplinesBD}
                  getOptionLabel={(option) => option.name}
                  name="disciplines"
                  value={disciplinesForm || []}
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
