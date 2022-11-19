import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./layout/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Professor from "./components/Professor";
import Home from "./components/Home";
import Course from "./components/Course";
import Discipline from "./components/Discipline";
import CurriculumMatrices from "./components/CurriculumMatrix";
import Class from "./components/Class";
import Score from "./components/Score";
import * as routes from "./constants/routes";
import Student from "./components/Student";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path={routes.HOME} element={<Home />} />
          <Route exact path={routes.COURSES} element={<Course />} />
          <Route exact path={routes.DISCIPLINES} element={<Discipline />} />
          <Route
            exact
            path={routes.CURRICULUM_MATRICES}
            element={<CurriculumMatrices />}
          />
          <Route exact path={routes.STUDENTS} element={<Student />} /> 
          <Route exact path={routes.PROFESSORS} element={<Professor />} />
          <Route exact path={routes.CLASSES} element={<Class />} />
          <Route exact path={routes.SCORES} element={<Score />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
