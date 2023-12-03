import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"

let f = new Fix([[1,0], [2,2], [3,1]]);
let m = new Moving(f, [[0,0], [4,4]],[]);
    /*[{'pos':3, 'start':[3,0], 'vec':[0,1]},
     {'pos':0, 'start':[0,3], 'vec':[1,0]}]); */

console.log(m.toString());
console.log(m.explore());
