import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import API from "../api";
import axios from "axios";

export const tokenValidation = (url) => {
  return new Promise((resolve, reject) => {
    API.post("/token/index.php", "", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.data.okay) {
          resolve(res.data.okay);
        }
      })
      .catch((err) => {
        reject(false);
      });
  });
};

const PrivateRoute = ({ component: Component, setUserLoggedIn, ...rest }) => {
  const [auth, setAuth] = useState(false);
  const [isTokenValidated, setIsTokenValidated] = useState(false);

  useEffect(() => {
    // send jwt to API to see if it's valid
    let token = localStorage.getItem("token");

    if (token) {
      tokenValidation()
        .then((res) => {
          setAuth(true);
          setUserLoggedIn(true);
        })
        .catch((err) => {
          setAuth(false);
          setUserLoggedIn(false);
        })
        .then((res) => {
          setIsTokenValidated(true);
        });
    } else {
      setIsTokenValidated(true);

      // in case there is no token
      if (token === null) {
        setUserLoggedIn(false);
      }
    }
  }, []);

  if (!isTokenValidated)
    return (
      <div className="text-center w-100 pt-5 mt-5 ">
        <div className="spinner-grow text-info p-3" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <Route
      {...rest}
      render={(props) => {
        return auth ? <Component {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
};

export default PrivateRoute;
