"use client";
import React, { useState } from "react";
import Component1 from "./Component1";
import Component2 from "./Component2";

const Component = () => {
  const [state, setState] = useState(false);
  const [id, setId] = useState();
  return (
    <>
      <Component2 id={id} setId={setId} setState={setState} state={state} />
    </>
  );
};

export default Component;
