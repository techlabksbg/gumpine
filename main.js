import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"
import {generator} from "./generator.mjs"


for (let hasen of generator.hasenPlaetze(2)) {
    for (let pilze of generator.pilzPlaetze(2, hasen)) {
        let f = new Fix(pilze);
        let m = new Moving(f, hasen, []);
        console.log(m.toString());
    }
}