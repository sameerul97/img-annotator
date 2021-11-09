import React from "react";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="text-center w-100 pt-5  ">
      <div className="spinner-grow text-info p-3" role="status">
        <span className="sr-only">{message}</span>
      </div>
    </div>
  );
}
