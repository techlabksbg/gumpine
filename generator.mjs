
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

    "pilzPlaetze" : function(anzahlPilze, hasen) {

    }

}