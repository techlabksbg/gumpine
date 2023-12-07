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

    "fuchsPlaetze" : function(anzahlFuechse, hasen, pilze) {
        let size = 5;
        let fuchsPositionen = [];
        if (anzahlFuechse==0) return [[]];
        let frei = new Array(size).fill(0).map(e=>new Array(size).fill(true));
        for (let hase of hasen) frei[hase[0]][hase[1]] = false;
        for (let pilz of pilze) frei[pilz[0]][pilz[1]] = false;

        let possible = function(pos, zeilespalte) {
            let p1 = util.vecadd(util.fuchsStarts[zeilespalte], util.vecmul(pos, util.fuchsVecs[zeilespalte]));
            let p2 = util.vecadd(p1, util.fuchsVecs[zeilespalte]);
            return (util.gridMatch(frei, p1, e=>e) && util.gridMatch(frei, p2, e=>e));
        }
       
        // Produziert ein Array mit allen nötigen Fuchsparametern
        // from zeilespalte zvon bis zeilespalte zbis-1
        let getFuchsPositionen = function(zvon, zbis) {
            let positionen = [];
            for (let zeilespalte=zvon; zeilespalte<zbis; zeilespalte++) {
                let mitte = util.vecadd(util.fuchsStarts[zeilespalte], util.vecmul(2, util.fuchsVecs[zeilespalte]));
                let pilzInDerMitte = !frei[mitte[0]][mitte[1]];
                for (let pos=0; pos<4; pos++) {
                    if (possible(pos, zeilespalte)) {
                        positionen.push({"pos":pos, 
                                            "start":util.fuchsStarts[zeilespalte],
                                            "vec":util.fuchsVecs[zeilespalte]});
                        if (!pilzInDerMitte) {
                            break;
                        }
                    }
                }
            }
            return positionen;
        }

        if (anzahlFuechse==1) {
            for (let fp of getFuchsPositionen(0,4)) {
                fuchsPositionen.push([fp]);
            }
        }
        if (anzahlFuechse==2) {
            for (let fp1 of getFuchsPositionen(0,3)) {
                let zs1 = 0;
                while (util.fuchsStarts[zs1]!=fp1.start) zs1++;
                let p1 = util.vecadd(fp1.start, util.vecmul(fp1.pos, fp1.vec));
                let p2 = util.vecadd(p1, fp1.vec);
                frei[p1[0]][p1[1]] = false;
                frei[p2[0]][p2[1]] = false;
                for (let fp2 of getFuchsPositionen(zs1+1,4)) {
                    fuchsPositionen.push([fp1, fp2]);
                }
                frei[p1[0]][p1[1]] = true;
                frei[p2[0]][p2[1]] = true;
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
                            'base' : m.toMiniObj(),
                            'sol' : sol
                        };
                        yield puzzle;
                    }
                }
            }
        }
    },
} 
