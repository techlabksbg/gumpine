import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"
import {generator} from "./generator.mjs"


for (let hasen of generator.hasenPlaetze(1)) {
    for (let pilze of generator.pilzPlaetze(1, hasen)) {
        for (let fuechse of generator.fuchsPlaetze(2, hasen, pilze)) {
            let f = new Fix(pilze);
            let m = new Moving(f, hasen, fuechse);
            let sol = m.explore();
            if ('positions' in sol && sol.solution.length>7) {
                console.log(`New puzzle! pathlength=${sol.solution.length}, positions=${sol.positions}`);
                for (let s of sol.solution) {
                    let schritt = m.fromNumber(s);
                    console.log(schritt.toString());
                }
            }
        }
    }
}