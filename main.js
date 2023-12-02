import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"

let f = new Fix([[1,1], [2,2]]);
let m = new Moving(f, [[0,0], [4,4]], [{'pos':3, 'start':[3,0], 'vec':[0,1]}]);

console.log(m.toString());
let nr = m.toNumber();
console.log(nr);
let mm = m.fromNumber(nr-1-4);
console.log(mm.toString());