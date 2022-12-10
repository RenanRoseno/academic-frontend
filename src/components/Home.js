import React from "react";
import Button from "react-bootstrap/Button";
import "../App.css";
import { Link } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import * as routes from "../constants/routes";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";

export default function Home() {
  return (
    <div class="container ">
      <div class="row mt-5">
        <div class="col p-1 row-custom">
          <Link to={routes.COURSES}>
            <Button variant="btn btn-dark" className="btn-lg botao">
              <div class="col">
                <SchoolIcon sx={{ fontSize: 100 }} />
              </div>
              Cursos
            </Button>
          </Link>
        </div>
        <div class="col p-1">
          <Link to={routes.DISCIPLINES}>
            <Button variant="btn btn-dark" className="btn-lg botao">
              <div class="col">
                <LibraryBooksIcon sx={{ fontSize: 100 }} />
              </div>
              Disciplinas
            </Button>
          </Link>
        </div>
        <div class="col p-1">
          <Link to={routes.CURRICULUM_MATRICES}>
            <Button variant="btn btn-dark" className="btn-lg botao">
              <div class="col">
                <MenuBookIcon sx={{ fontSize: 80 }} />
              </div>
              Matrizes curriculares
            </Button>
          </Link>
        </div>
      </div>
      <div class="row">
        <div class="col p-1 row-custom">
          <Link to={routes.PROFESSORS}>
            <Button variant="btn btn-dark" className="btn-lg botao">
              <div class="col">
                <SupervisorAccountIcon sx={{ fontSize: 80 }} />
              </div>
              Professores
            </Button>
          </Link>
        </div>
        <div class="col p-1">
          <Link to={routes.STUDENTS}>
            <Button variant="btn btn-dark" className="btn-lg botao">
              <div class="col">
                <PersonIcon sx={{ fontSize: 80 }} />
              </div>
              Alunos
            </Button>
          </Link>
        </div>
        <div class="col p-1">
          <Link to={routes.CLASSES}>
            <Button variant="btn btn-dark" className="btn-lg botao">
              <div class="col">
                <GroupsIcon sx={{ fontSize: 80 }} />
              </div>
              Turmas
            </Button>
          </Link>
        </div>
      </div>
      {/* <div class="row">
        <div class="col p-1 row-custom">
          <Link to={routes.SCORES}>
            <Button variant="btn btn-dark" className="btn-lg botao">
              <div class="col">
                <SignalCellularAltIcon sx={{ fontSize: 80 }} />
              </div>
              Notas
            </Button>
          </Link>
        </div>
      </div> */}
    </div>
  );
}
