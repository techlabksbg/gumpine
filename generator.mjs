import { util } from "./util.mjs"
import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"

export const generator = {
    "hasenPlaetze" : function(anzahlHasen) {
        if (anzahlHasen==1) {
            return [[[0,0]],[[2,2]]];
        }
        if (anzahlHasen==2) {
            return [[[0,0],[4,0]], [[0,0],[4,4]], [[0,0],[2,2]]];
        }
        if (anzahlHasen==3) {
            return [[[0,0], [4,0], [0,4]], [[0,0],[4,0], [2,2]], [[0,0],[4,4],[2,2]]];
        }
        if (anzahlHasen==4) {
            return [[[0,0], [4,0], [4,4], [0,4]], [[0,0],[4,0],[2,2],[4,4]]];
        }
    },

    "pilzPlaetze" : function(anzahlPilze, hasen, size=5) {
        let frei = new Array(size).fill(0).map(e=>new Array(size).fill(true));
        for (let hase of hasen) frei[hase[0]][hase[1]] = false;


        let nextSquare = function(p) {
            p = [...p];
            while (true) {
                p[0]++;
                if (p[0]>=size) {
                    p[0]=0;
                    p[1]++;
                }
                if (p[1]>=size) {
                    return false;
                }
                if (frei[p[0]][p[1]]) {
                    return p;
                }
            }
        }

        let pilzPositionen = [];

        let platzieren = function(pilze, wievielnoch, abwo) {
            if (wievielnoch==0) {
                pilzPositionen.push(util.deepcopy(pilze));
                return;
            }
            let p = nextSquare(abwo);
            while (p!==false) {
                pilze.push(p);
                platzieren(pilze, wievielnoch-1, p);
                pilze.pop();
                p = nextSquare(p);
            }
        }
        // Array pilzPositionen befüllen
        platzieren([], anzahlPilze, [-1,0]);
        return pilzPositionen;
    },

    // TODO: ist die Zeile oder Spalte leer, reicht es, eine Position
    // zu generieren, alle anderen sind überflüssig, weil erreichbar.
    // Bei einem Pilz auf der Zeile oder Spalte, reicht entweder die
    // erstmögliche Position (wenn der Pilz nicht in der Mitte ist),
    // oder die möglichen Position
    "fuchsPlaetze" : function(anzahlFuechse, hasen, pilze) {
        let size = 5;
        let fuchsPositionen = [];
        if (anzahlFuechse==0) return [[]];
        let frei = new Array(size).fill(0).map(e=>new Array(size).fill(true));
        for (let hase of hasen) frei[hase[0]][hase[1]] = false;
        for (let pilz of pilze) frei[pilz[0]][pilz[1]] = false;

        let starts = [[0,1], [0,3], [1,0], [3,0]];
        let vecs = [[1,0], [1,0], [0,1], [0,1]];

        let possible = function(pos, zeilespalte) {
            let p1 = util.vecadd(starts[zeilespalte], util.vecmul(pos, vecs[zeilespalte]));
            let p2 = util.vecadd(p1, vecs[zeilespalte]);
            return (util.gridMatch(frei, p1, e=>e) && util.gridMatch(frei, p2, e=>e));
        }

        if (anzahlFuechse==1) {
            for (let zeilespalte=0; zeilespalte<4; zeilespalte++) {
                for (let pos=0; pos<4; pos++) {
                    if (possible(pos, zeilespalte)) {
                        fuchsPositionen.push([{"pos":pos, 
                                    "start":starts[zeilespalte],
                                "vec":vecs[zeilespalte]}]);
                    }
                }
            }
        }
        if (anzahlFuechse==2) {
            for (let zeilespalte1=0; zeilespalte1<3; zeilespalte1++) {
                for (let pos1=0; pos1<4; pos1++) {
                    if (possible(pos1, zeilespalte1)) {
                        let p1 = util.vecadd(starts[zeilespalte1], util.vecmul(pos1, vecs[zeilespalte1]));
                        let p2 = util.vecadd(p1, vecs[zeilespalte1]);
                        frei[p1[0]][p1[1]] = false;
                        frei[p2[0]][p2[1]] = false;
                        for (let zeilespalte2=zeilespalte1+1; zeilespalte2<4; zeilespalte2++) {
                            for (let pos2=0; pos2<4; pos2++) {
                                if (possible(pos2, zeilespalte2)) {
                                    fuchsPositionen.push([
                                        {"pos":pos1, 
                                         "start":starts[zeilespalte1],
                                         "vec":vecs[zeilespalte1]},
                                        {"pos":pos2, 
                                         "start":starts[zeilespalte2],
                                         "vec":vecs[zeilespalte2]}
                                    ]);
                                }
                            }
                        }
                        frei[p1[0]][p1[1]] = true;
                        frei[p2[0]][p2[1]] = true;
                    }
                }
            }
        }
        return fuchsPositionen;
    },

    "makePuzzles" : function*(anzahlHasen, anzahlPilze, anzahlFuechse) {
        for (let hasen of generator.hasenPlaetze(anzahlHasen)) {
            for (let pilze of generator.pilzPlaetze(anzahlPilze, hasen)) {
                for (let fuechse of generator.fuchsPlaetze(anzahlFuechse, hasen, pilze)) {
                    let f = new Fix(pilze);
                    let m = new Moving(f, hasen, fuechse);
                    let sol = m.explore();
                    if ('positions' in sol) {
                        let puzzle = {
                            'base' : m.toObj(),
                            'sol' : sol
                        };
                        yield puzzle;
                    }
                }
            }
        }
    },
} 
