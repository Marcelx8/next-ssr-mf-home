import { createFederatedCatchAll } from "next-shared-logic";
export default createFederatedCatchAll(process.env.REMOTES);
