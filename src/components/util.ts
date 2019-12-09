// import deepMerge from "deepmerge";
// export { get, set } from "dot-prop";
// import * as mustache from 'micromustache'

// import { get, set, merge, pick, uniqBy, template } from "lodash";

import get from 'lodash/get'
import set from 'lodash/set'
import pick from 'lodash/pick'
import uniqBy from 'lodash/uniqBy'
import template from 'lodash/template'
import merge from 'lodash/merge'

import dayjs from 'dayjs'

const formatDate = (date, format = 'yyyy-MM-DD HH:mm') => dayjs(date).format(format.replace('yyyy', 'YYYY'))

export { get, set, merge, pick, uniqBy, template, formatDate };