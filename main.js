import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"
import {generator} from "./generator.mjs"


for (let hasen of generator.hasenPlaetze(3)) {
    for (let pilze of generator.pilzPlaetze(3, hasen)) {
        let f = new Fix(pilze);
        let m = new Moving(f, hasen, []);
        let sol = m.explore();
        if ('positions' in sol && sol.solution.length>17) {
            console.log(`New puzzle! pathlength=${sol.solution.length}, positions=${sol.positions}`);
            for (let s of sol.solution) {
                let schritt = m.fromNumber(s);
                console.log(schritt.toString());
            }
        }
    }
}