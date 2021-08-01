import React from "react";

type TextProps = {
  message: string;
  id: number;
}; /* use `interface` if exporting so that consumers can extend */

// Easiest way to declare a Function Component; return type is inferred.
const Text = (props: TextProps) => (
  <div>
    {props.message} {props.id}
  </div>
);

const AnotherComponent = (props: TextProps) => (
  <div>
    {props.message} {props.id}
  </div>
);

interface FooProp {
  name: string;
  X: number;
  Y: number;
}

 
function ComponentFoo(prop: FooProp) {
  return <AnotherComponent message={'test'} id={1} />;
}

const Button = (prop: { value: string }, context: { color: string }) => (
  <button />
);

export default ComponentFoo;
