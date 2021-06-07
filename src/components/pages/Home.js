import React from "react";
import Analytics from "../Analytics";
import PlusButton from "../PlusButton";
import Pie from "../Pie";
function Home() {
  return (
    <div>
      <div className="text-center mt-2">
        <p className="mb-0">Click labels below to interact</p>
      </div>
      <Pie></Pie>
      {/* <Analytics></Analytics> */}
      <PlusButton></PlusButton>
    </div>
  );
}

export default Home;
