import {util} from "./util.mjs"

export class Moving {
    // Hasen Array mit Koordinaten
    // Füchse: Array mit Objekten wie folgt:
    //  {'pos':2, "start":[0,1], "vec":[1,0]}
    constructor(fix, hasen, fuechse) {
        this.fix = fix;
        this.hasen = util.deepcopy(hasen);
        this.fuechse = util.deepcopy(fuechse);
        this.makeGrid();
    }

    makeGrid() {
        // 5x5 Array mit Nullen gefüllt
        this.grid = util.deepcopy(this.fix.grid);
        
        for (let hase of this.hasen) {
            this.grid[hase[0]][hase[1]] = util.hase;
        }
        for (let fuchs of this.fuechse) {
            let p = util.vecadd(fuchs.start, util.vecmul(fuchs.pos, fuchs.vec));
            this.grid[p[0]][p[1]] = util.fuchs;
            p = util.vecadd(p, fuchs.vec);
            this.grid[p[0]][p[1]] = util.fuchs;
        }
    }

    toString() {
        return util.toString(this.grid);
    }

}