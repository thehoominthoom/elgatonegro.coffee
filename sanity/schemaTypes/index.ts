import { type SchemaTypeDefinition } from "sanity";
import { event } from "./event";
import { menu } from "./menu";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [event, menu],
};
