import React from "react";
import { Link } from "react-router-dom";
import * as routes from "../constants/routes";

export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand mb-0 h1" to={routes.HOME}>
            ACADÊMICO
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="textoNavbar">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to={routes.COURSES}>
                  Cursos
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to={routes.DISCIPLINES}>
                  Disciplinas
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={routes.CURRICULUM_MATRICES}>
                  Matrizes curriculares
                </Link>
              </li>
              <li className="nav-item active">
                <Link className="nav-link" to={routes.PROFESSORS}>
                  Professores
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to={routes.STUDENTS}>
                  Alunos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={routes.CLASSES}>
                  Turmas
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to={routes.SCORES}>
                  Notas
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
