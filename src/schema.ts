import "reflect-metadata";
import { GraphQLBigInt, GraphQLEmailAddress } from "graphql-scalars";
import { asNexusMethod, connectionPlugin, makeSchema } from "nexus";
import { validatePlugin } from "nexus-validate";

import * as allTypes from "./schema/index";
import { join } from "path";

export const schema = makeSchema({
  plugins: [
    connectionPlugin({
      includeNodesField: true,
    }),
    validatePlugin(),
  ],
  outputs: {
    schema: __dirname + "/../schema.graphql",
    typegen: __dirname + "/generated/nexus-typegen.ts",
  },
  contextType: {
    module: join(__dirname, "./context.ts"),
    export: "Context",
  },
  types: [
    allTypes,
    asNexusMethod(GraphQLBigInt, "bigint", "bigint"),
    asNexusMethod(GraphQLEmailAddress, "email", "string"),
  ],
  features: {
    abstractTypeStrategies: {
      __typename: true,
    },
  },
});
