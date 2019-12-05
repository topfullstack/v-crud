import deepMerge from "deepmerge";
export { get, set } from "dot-prop";
import * as mustache from 'micromustache'

export const merge = deepMerge
export const render = (template, view) => mustache.render(template, view, {
  tags: ["${", "}"]
})

