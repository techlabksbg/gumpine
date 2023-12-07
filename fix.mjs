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
    
    toMiniObj() {
        return [this.pilze.length, this.encodePilze()];
    }

    static fromMiniObj(obj) {
        let pilze = new Array(obj[0]).fill(0).map(e=>[0,0]);
        let fix = new Fix(pilze);
        fix.decodePilze(obj[1]);
        return fix;
    }

    encodePilze() {
        let nr = 0;
        this.pilze.map((e)=>e[0]+this.size*e[1]).sort().forEach(e => {
            nr = this.size*this.size*nr+e;
        });
        return nr;
    }

    decodePilze(nr) {
        for (let pilz of this.pilze) {
            let posnumber = nr % (this.size*this.size);
            pilz[0] = posnumber % this.size;
            pilz[1] = Math.floor(posnumber/this.size);
            nr = Math.floor(nr/(this.size*this.size));
        }
        this.makeGrid();
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