import { type SchemaTypeDefinition } from "sanity";
import { cartStatus } from "./cartStatus";
import { event } from "./event";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [event, cartStatus],
};
