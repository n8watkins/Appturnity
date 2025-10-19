/**
 * MSW server setup for Node environment (tests)
 */

import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
