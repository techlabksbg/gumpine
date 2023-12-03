import { util } from "./util.mjs"


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
    }

}