import { DateTime } from "luxon";
import { scalarType } from "nexus";

export const datetime = scalarType({
  name: "DateTime",
  asNexusMethod: "datetime",
  description: "ISO8601 datetime",
  parseValue: (value: unknown) => {
    if (typeof value !== "string") {
      throw new Error(`Cannot parse ${value} as datetime`);
    }
    return DateTime.fromISO(value);
  },
  serialize: (value: unknown) => {
    if (!(value instanceof DateTime)) {
      throw new Error(`Cannot serialize ${value} as datetime`);
    }
    return value.toISO();
  },
  parseLiteral: (ast) => {
    if (ast.kind !== "StringValue") {
      throw new Error(`Cannot parse ${ast.kind}`);
    }
    return DateTime.fromISO(ast.value);
  },
  sourceType: {
    export: "DateTime",
    module: "luxon",
  },
});
