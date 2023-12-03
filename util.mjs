

export const util = {
    "deepcopy": function(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    "leer":0,
    "loch":1,
    "pilz":2,
    "hase":3,
    "fuchs":4,

    "symbole":['🟩', '⚫','🍄', '🐇', '🦊'],

    "toString": function(grid) {
        let str = "";
        for (let y=0; y<grid.length; y++) {
            for (let x=0; x<grid.length; x++) {
                str += util.symbole[grid[x][y]];
            }
            str += "\n";
        }
        return str;
    },

    "vecadd":function(a,b) {
        return [a[0]+b[0], a[1]+b[1]];
    },

    "vecmul":function(m, vec) {
        return [m*vec[0], m*vec[1]];
    },

    "dirs": [[1,0], [0,1], [-1,0], [0,-1]],

    // condition ist eine Funktion, die true liefert,
    // je nach Eintrag im grid.
    "gridMatch":function(grid, p, condition) {
        let n = grid.length;
        return p[0]>=0 && p[1]>=0 && p[0]<n && p[1]<n && condition(grid[p[0]][p[1]]);
    }

}
