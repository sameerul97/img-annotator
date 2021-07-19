import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Home from "./pages/Home";
import Allimages from "./pages/Allimages";
import HotspotImage from "./components/HotspotImage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PrivateRoute, { tokenValidation } from "./components/PrivateRoute";
import NewImage from "./pages/NewImage";
import Image from "./pages/Image";

import NotFoundImage from "./assets/page_not_found.svg";
import EmbedPage from "./pages/EmbedPage";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const [isEmbedPage, setIsEmbedPage] = useState(false);

  useEffect(() => {
    if (!isDemo) {
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
    }
  });

  function logout() {
    setUserLoggedIn(false);
    localStorage.removeItem("token");
  }

  return (
    <React.Fragment>
      <Router>
        {!isEmbedPage && <Navbar userLoggedIn={userLoggedIn} isDemo={isDemo} logout={logout} />}
        <Switch>
          <Route path="/" exact component={Home} />
          <PrivateRoute
            path="/image"
            exact
            component={Allimages}
            setUserLoggedIn={setUserLoggedIn}
          ></PrivateRoute>

          <PrivateRoute
            path="/image/:id"
            exact
            component={Image}
            setUserLoggedIn={setUserLoggedIn}
          ></PrivateRoute>
          <Route
            path="/embed/:id"
            exact
            render={() => <EmbedPage setIsEmbedPage={setIsEmbedPage} />}
          // setUserLoggedIn={setUserLoggedIn}

          />
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
