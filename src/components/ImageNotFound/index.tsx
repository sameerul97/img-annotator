import React from "react";

export default function ImageNotFound({ image_not_found_error_message }: any) {
  return (
    <div className="col-md-6 mx-auto mt-5 pt-3" role="alert">
      <div className="alert alert-danger" role="alert">
        {image_not_found_error_message}
      </div>
    </div>
  );
}
