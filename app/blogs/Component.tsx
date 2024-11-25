"use client";
import React, { useState } from "react";
import Component1 from "./Component1";
import Component2 from "./Component2";

const Component = () => {
  const [state, setState] = useState(false);
  const [id, setId] = useState();
  return (
    <>
      {state ? (
        <Component1 id={id} setId={setId} setState={setState} />
      ) : (
        <Component2 id={id} setId={setId} setState={setState} />
      )}
    </>
  );
};

export default Component;
