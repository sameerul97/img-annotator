import React, { useState } from "react";
import API from "../api/index";
import { useHistory } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const history = useHistory();

  function submit(e) {
    setError(false);
    setErrorMessage(false);

    e.preventDefault();

    API.post(`/login/index.php`, { email: email, password: password })
      .then((res) => {
        const response = res.data;

        localStorage.setItem("token", response.jwt);
        history.push("/image");

        props.setUserLoggedIn(true);
      })
      .catch((err) => {
        let error = err.response.data;

        if (error.validationError) {
          console.log(
            Object.keys(error.message)[0],
            error.message[Object.keys(error.message)[0]][0]
          );
          if (Object.keys(error.message)[0] === "email") {
            setError(error.error);
            setErrorMessage(error.message[Object.keys(error.message)[0]][0]);
          }

          if (Object.keys(error.message)[0] === "password") {
            setError(error.error);
            setErrorMessage(error.message[Object.keys(error.message)[0]][0]);
          }
        }

        if (!error.validationError) {
          setError(error.error);
          setErrorMessage(`${error.message}`);
        }
      });
  }
  return (
    <div style={{ maxWidth: "450px" }} className="m-auto pt-5">
      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {errorMessage}
        </div>
      )}
      <h1 className="h3 mb-3 font-weight-normal"> Log in</h1>

      <form className={`needs-validation  form-signin mt-3 form-row }`}>
        <div className="col-12   px-0">
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input
            type="email"
            id="inputEmail"
            className="form-control rounded-top  "
            placeholder="Email address"
            required={true}
            autoFocus=""
            style={{ borderRadius: 0, borderBottom: 0 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <input
          type="password"
          id="inputPassword"
          className="form-control rounded-bottom"
          placeholder="Password"
          required=""
          style={{ borderRadius: 0 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn btn-lg btn-info btn-block my-3"
          type="submit"
          disabled={!(email.length > 3 && password.length > 3)}
          onClick={(e) => submit(e)}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Login;
