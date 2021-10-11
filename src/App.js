import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/Home/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Home/Dashboard";
import PrivateRoute, { tokenValidation } from "./components/PrivateRoute";

import Home from "./pages/Home";
import NewImage from "./pages/CreateImage";
import Image from "./pages/Editor";
import Editor from "./pages/Images";
import EmbedPage from "./pages/EmbedPage";
import EmbedPageT from "./pages/EmbedPageT";

import NotFoundImage from "./assets/page_not_found.svg";

import { EmbedStoreProvider } from "./store/Embed";

import EditorStore from "./store/All_Images/index.tsx";

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
        {!isEmbedPage && (
          <Provider store={EditorStore}>
            <Navbar
              userLoggedIn={userLoggedIn}
              isDemo={isDemo}
              logout={logout}
            />
          </Provider>
        )}
        <Switch>
          <Route path="/" exact component={Home} />

          <PrivateRoute
            path="/editor"
            exact
            component={Editor}
            setUserLoggedIn={setUserLoggedIn}
          />

          <PrivateRoute
            path="/image"
            exact
            component={Editor}
            setUserLoggedIn={setUserLoggedIn}
          />

          <PrivateRoute
            path="/image/:id"
            exact
            component={Image}
            setUserLoggedIn={setUserLoggedIn}
          />

          <Route
            path="/embed/:id"
            exact
            render={() => (
              <EmbedStoreProvider>
                <EmbedPage setIsEmbedPage={setIsEmbedPage} />
              </EmbedStoreProvider>
            )}
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
          />
          <PrivateRoute
            path="/create"
            component={NewImage}
            setUserLoggedIn={setUserLoggedIn}
          />
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
