import React from "react";
import { NavLink } from "react-router-dom";
import { HashRouter } from "react-router-dom";

function Navbar(props) {
  return (
    <HashRouter>
      <nav className="navbar navbar-expand-lg navbar-dark bg-info">
        <NavLink to="/" className="navbar-brand">
          <span role="img" aria-label="img">
            🚀
          </span>
          Img-annotator
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                className="nav-link"
                activeClassName="nav-link active"
              >
                Home
              </NavLink>
            </li>

            {props.userLoggedIn && (
              <li className="nav-item">
                <NavLink
                  exact
                  to="/images"
                  className="nav-link"
                  activeClassName="nav-link active"
                >
                  View All
                </NavLink>
              </li>
            )}
            {props.userLoggedIn && (
              <li className="nav-item">
                <NavLink
                  exact
                  to="/create"
                  className="nav-link"
                  activeClassName="nav-link active"
                >
                  Create
                </NavLink>
              </li>
            )}
            {props.userLoggedIn && (
              <li className="nav-item">
                <NavLink
                  exact
                  to="/dashboard"
                  className="nav-link"
                  activeClassName="nav-link active"
                >
                  Dashboard
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ml-auto">
            {!props.userLoggedIn && (
              <li className="nav-item">
                <NavLink
                  exact
                  to="/login"
                  className="nav-link"
                  activeClassName="nav-link active"
                >
                  Login
                </NavLink>
              </li>
            )}

            {props.userLoggedIn && (
              <li className="nav-item">
                <NavLink
                  exact
                  to="/login"
                  className="nav-link"
                  activeClassName="nav-link active"
                  onClick={() => {
                    props.logout();
                  }}
                >
                  Logout
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </HashRouter>
  );
}

export default Navbar;
