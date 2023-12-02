

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
    }
}
