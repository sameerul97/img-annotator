import React from "react";
import Analytics from "../components/Home/Analytics";
import PlusButton from "../components/Home/PlusButton";
import Pie from "../components/Home/Pie";
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
