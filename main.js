import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"

let f = new Fix([[1,0], [2,2], [3,0]]);
let m = new Moving(f, [[0,0], [4,4], [1,1], [2,1]], 
    [{'pos':3, 'start':[3,0], 'vec':[0,1]},
     {'pos':0, 'start':[0,3], 'vec':[1,0]}]);

console.log(m.toString());
console.log("Mögliche Fuchs Züge");
for (let zug of m.fuchsZuege()) {
    console.log(zug.toString());
}
