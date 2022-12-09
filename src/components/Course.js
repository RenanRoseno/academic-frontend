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
    field: "kindCourseDescription",
    headerName: "Tipo de curso",
    width: 250,
    editable: true,
  },
];

export default function Course() {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState({
    name: "",
    kindCourse: "",
    kindCourseDescription: "",
  });
  const [selectedCourse, setSelectedCourse] = useState({});
  const { name, kindCourse } = course;
  const [num, setNum] = useState("");
  const [disable, setDisable] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) =>
      courses.find((row) => row.id === id)
    );
    console.log(selectedRowsData)
    if (selectedRowsData.length > 0) {

      setSelectedCourse(selectedRowsData[0]);
      setDisable(false);
    } else {
      setSelectedCourse({});
      clear();
      setDisable(true);
    }
  };

  const handleClose = () => setShow(false);

  const handleShow = () => {
    clear();
    setShow(true);
  };

  const handleShowEdit = () => {
    handleShow();
    loadCourse();
  };

  const handleNumChange = (event) => {
    const limit = 3;
    setNum(event.target.value.slice(0, limit));
  };

  const onInputChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value.toUpperCase() });
  };

  const loadCourses = async () => {
    const result = await axios.get("http://localhost:8080/courses/");
    setCourses(result.data);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // discipline.workLoad = num;
    if (selectedCourse.id) {
      await axios
        .put(`http://localhost:8080/courses/${selectedCourse.id}`, course)
        .then(function (response) {
          handleClose();
          loadCourses();
          showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
        })
        .catch(function (error) {
          showAlertError(ERROR, error.response.data.message);
        });
    } else {
      await axios
        .post("http://localhost:8080/courses/", course)
        .then(function (response) {
          handleClose();
          loadCourses();
          showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
        })
        .catch(function (error) {
          showAlertError(ERROR, error.response.data.message);
        });
    }
  };

  const deleteCourse = async () => {
    await axios
      .delete(`http://localhost:8080/courses/${selectedCourse.id}`)
      .then(function (response) {
        loadCourses();
        showAlertSuccess(SUCCESS, SUCCESS_MESSAGE);
      })
      .catch(function (error) {
        showAlertError(ERROR, error.response.data.message);
      });
  };

  const clear = () => {
    setCourse({
      name: "",
      kindCourse: "",
    });
    setNum("");
  };

  const loadCourse = async () => {
    const result = await axios.get(
      `http://localhost:8080/courses/${selectedCourse.id}`
    );
    setCourse(result.data);
    //setNum(result.data.workLoad);
  };

  return (
    <div className="container mt-4">
      <Box sx={{ height: 550, width: "100%" }}>
        <h3>Gerenciamento de cursos</h3>
        <DataGrid
          rows={courses}
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
              onClick={() => deleteCourse(course.id)}
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
            {selectedCourse.id ? "Editar" : "Cadastrar"} curso
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
                  Tipo de curso
                </label>
                <select name="kindCourse" value={course.kindCourse || 1} className="form-control" onChange={(e) => onInputChange(e)}>
                  <option value="1">BACHARELADO</option>
                  <option value="2">LICENCIATURA</option>
                  <option value="3">TÉCNICO</option>
                </select>
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
