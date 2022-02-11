import React from "react";
import { createFederatedCatchAll } from "@module-federation/next-catchall";

const ErrorComponent = () => {
  return <h1>There was an error trying to load route</h1>;
};
const NotFoundComponent = () => {
  return <h1>4OH4 not found</h1>;
};
export default createFederatedCatchAll(
  process.env.REMOTES,
  ErrorComponent,
  NotFoundComponent
);
