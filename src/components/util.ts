// import deepMerge from "deepmerge";
// export { get, set } from "dot-prop";
// import * as mustache from 'micromustache'

import * as _ from "lodash";
export { get, set, merge, pick, uniqBy } from "lodash";

// export const merge = deepMerge
export const render = (view, data) => _.template(view)(data);
