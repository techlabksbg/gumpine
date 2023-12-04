import { util } from "./util.mjs"

export class Fix {
    // Pilze ist ein Array mit Koordinaten
    constructor(pilze) {
        this.pilze = util.deepcopy(pilze);
        this.size = 5;
        // Koordinaten der Löcher
        this.loecher = [[0,0], [2,2], [4,0], [0,4], [4,4]];
        this.makeGrid();
    }

    static fromObj(obj) {
        return new Fix(obj.pilze);
    }

    toObj() {
        return JSON.parse(JSON.stringify({
            'pilze' : this.pilze,
        }));
    }

    makeGrid() {
        // 5x5 Array mit Nullen gefüllt
        this.grid = new Array(this.size).fill(0).map((e)=>new Array(this.size).fill(0));
        for (let loch of this.loecher) {
            this.grid[loch[0]][loch[1]] = util.loch;
        }
        for (let pilz of this.pilze) {
            this.grid[pilz[0]][pilz[1]] = util.pilz;
        }
    }

    toString(){
        return util.toString(this.grid);
    }
}