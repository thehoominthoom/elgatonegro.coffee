import { type SchemaTypeDefinition } from "sanity";
import { event } from "./event";
import { location } from "./location";
import { menu } from "./menu";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [event, location, menu],
};
