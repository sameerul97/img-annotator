import React from "react";
import { NavLink } from "react-router-dom";
import { HashRouter } from "react-router-dom";

function Navbar(props) {

  const logOut = () => {
    props.logout();
  };

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
            <NavBarLinkButton name="Home" to="/" />
            {
              props.userLoggedIn ? (
                <React.Fragment>
                  <NavBarLinkButton name="View All" to="/images" />
                  <NavBarLinkButton name="Create" to="/create" />
                  <NavBarLinkButton name="Dashboard" to="/dashboard" />
                </React.Fragment>
              ) : null
            }
            {
              props.isDemo ? (
                <React.Fragment>
                  <NavBarLinkButton name="View All" to="/images" />
                </React.Fragment>
              ) : null
            }
          </ul>

          <ul className="navbar-nav ml-auto">
            {(!props.userLoggedIn && !props.isDemo) ? <NavBarLinkButton name="Login" to="/login" /> : null}
            {props.userLoggedIn && <NavBarLinkButton name="Logout" to="/login" onclickcallback={logOut} />}
          </ul>
        </div>
      </nav>
    </HashRouter>
  );
}

const NavBarLinkButton = ({ name, to, onclickcallback = false }) => {
  return (
    <li className="nav-item">
      <NavLink
        exact
        to={to}
        className="nav-link"
        activeClassName="nav-link active"
        onClick={onclickcallback ? onclickcallback : null}
      >
        {name}
      </NavLink>
    </li>
  );
}

export default Navbar;
