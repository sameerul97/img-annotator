import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./components/pages/Home";
import Allimages from "./components/pages/Allimages";
import HotspotImage from "./components/Image";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute, { tokenValidation } from "./components/PrivateRoute";
import NewImage from "./components/pages/NewImage";

import NotFoundImage from "./assets/page_not_found.svg";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      tokenValidation()
        .then((res) => {
          setUserLoggedIn(true);
        })
        .catch((err) => {
          console.log(err);
          setUserLoggedIn(false);
        });
    }
  });

  function logout() {
    setUserLoggedIn(false);
    localStorage.removeItem("token");
  }

  return (
    <React.Fragment>
      <Router>
        <Navbar userLoggedIn={userLoggedIn} logout={logout} />
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateRoute
            path="/images"
            exact
            component={Allimages}
            setUserLoggedIn={setUserLoggedIn}
          ></PrivateRoute>

          <PrivateRoute
            path="/image/:id"
            exact
            component={HotspotImage}
            setUserLoggedIn={setUserLoggedIn}
          ></PrivateRoute>

          <Route
            path="/login"
            render={(props) => <Login setUserLoggedIn={setUserLoggedIn} />}
          />
          <PrivateRoute
            path="/dashboard"
            component={Dashboard}
            setUserLoggedIn={setUserLoggedIn}
          ></PrivateRoute>
          <PrivateRoute
            path="/create"
            component={NewImage}
            setUserLoggedIn={setUserLoggedIn}
          ></PrivateRoute>
          <Route path="/*" component={NotFound} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

function NotFound() {
  return (
    <div className="text-center mx-auto col-10">
      <img
        alt="not found"
        src={NotFoundImage}
        className="text-center img-fluid"
      />
    </div>
  );
}

export default App;
