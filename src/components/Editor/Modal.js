import React, { useState, useEffect } from "react";
import API from "../../api/index";

export default function Modal(props) {
  const image_id = props.imageId;
  const [header, setHeader] = useState("");
  const [copy, setCopy] = useState("");
  const [script, setScript] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onCopyChange = (event) => {
    setCopy(event.target.value);
  };

  const onHeaderChange = (event) => {
    setHeader(event.target.value);
  };

  const onScriptChange = (event) => {
    setScript(event.target.value);
  };

  useEffect(() => {
    setHeader(props.header || "");
    setCopy(props.copy || "");
    setScript(props.script || "");
  }, [props.copy, props.header, props.script]);

  const saveHeaderAndCopy = () => {
    API.put(
      `/details/index.php`,
      {
        header: header,
        copy: copy,
        script: script,
        image_id: image_id,
      },
      {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: localStorage.getItem("token"),
        },
      }
    )
      .then((res) => {
        setError(false);
        setErrorMessage("");

        setSuccess(true);
        setSuccessMessage("Updated");

        setTimeout(() => {
          setSuccess(false);
          setSuccessMessage("");
        }, 2500);
      })
      .catch((err) => {
        setSuccess(false);
        setSuccessMessage("");

        let errorResponse = err.response;
        let error = err.response.data;

        // 440 token expired / token tamperred
        if (error.message === "Expired token") {
          // TODO: Show login inside modal and continue
          props.history.push(`/login/`);
        }

        // TODO: Handle 403 forbibdden error

        if (errorResponse.status === 401) {
          setError(error.error);
          setErrorMessage(error.message);
        }

        if (errorResponse.status === 400) {
          if (error.validationError) {
            if (Object.keys(error.message)[0] === "image_id") {
              setError(error.error);
              setErrorMessage(error.message[Object.keys(error.message)[0]][0]);
            }
          }
        }
      });
  };

  const HeaderInput = (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span
          className="input-group-text bg-secondary"
          id="inputGroup-sizing-default"
        >
          Header
        </span>
      </div>
      <input
        type="text"
        className="form-control"
        aria-label="Default"
        aria-describedby="inputGroup-sizing-default"
        value={header}
        onChange={onHeaderChange}
      />
    </div>
  );

  const DataInput = (
    <div className="input-group mb-3">
      <div className="input-group-prepend">
        <span className="input-group-text bg-secondary">Body Text</span>
      </div>
      <textarea
        style={{ minHeight: "200px" }}
        className="form-control"
        aria-label="With textarea"
        value={copy}
        onChange={onCopyChange}
      />
    </div>
  );

  const ScriptInput = (
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text bg-secondary">Wayin embed code</span>
      </div>
      <textarea
        className="form-control"
        aria-label="With textarea"
        value={script}
        onChange={onScriptChange}
      />
    </div>
  );

  const Alerts = (
    <React.Fragment>
      {success && (
        <div className="col-md-6 mx-auto mt-4 text-center">
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        </div>
      )}

      {error && (
        <div className="col-md-6 mx-auto mt-4 text-center">
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        </div>
      )}
    </React.Fragment>
  );

  return (
    <div
      className="modal fade text-dark text-black"
      id="exampleModalCenter"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div
        className="modal-dialog modal-lg modal-dialog-centered"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              Update Page Details
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {HeaderInput}
            {DataInput}
            {ScriptInput}
            {Alerts}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveHeaderAndCopy}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
