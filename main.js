import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"

let f = new Fix([[1,1], [3,2]]);
let m = new Moving(f, [[0,0], [4,4]], [{'pos':3, 'start':[3,0], 'vec':[0,1]}]);

console.log(f.toString());
console.log(m.toString());