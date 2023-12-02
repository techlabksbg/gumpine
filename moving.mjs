import {util} from "./util.mjs"

export class Moving {
    // Hasen Array mit Koordinaten
    // Füchse: Array mit Objekten wie folgt:
    //  {'pos':2, "start":[0,1], "vec":[1,0]}
    constructor(fix, hasen, fuechse) {
        this.fix = fix;
        this.size = this.fix.size;
        this.hasen = util.deepcopy(hasen);
        this.fuechse = util.deepcopy(fuechse);
        this.makeGrid();
    }
    
    toNumber() {
        let nr = 0;
        this.hasen.map((e)=>e[0]+this.size*e[1]).sort().forEach(e => {
            nr = this.size*this.size*nr+e;
        });
        console.log(this.fuechse);
        for (let fuchs of this.fuechse) {
            console.log(fuchs);
            console.log(fuchs.pos);
            nr = (this.size-1)*nr + fuchs.pos;
        }
        return nr;
    }

    fromNumber(nr) {
        let hasen = util.deepcopy(this.hasen);
        let fuechse = util.deepcopy(this.fuechse);
        for (let i=fuechse.length-1; i>=0; i--) {
            fuechse[i].pos = nr%(this.size-1);
            nr = Math.floor(nr/(this.size-1));
        }
        for (let hase of hasen) {
            let posnumber = nr % (this.size*this.size);
            hase[0] = posnumber % this.size;
            hase[1] = Math.floor(posnumber/this.size);
            nr = Math.floor(nr/(this.size*this.size));
        }
        return new Moving(this.fix, hasen, fuechse);
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