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
    
    maxPositions() {
        return Math.pow(this.size*this.size, this.hasen.length)*Math.pow(this.size-1, this.fuechse.length);
    }

    toNumber() {
        let nr = 0;
        this.hasen.map((e)=>e[0]+this.size*e[1]).sort().forEach(e => {
            nr = this.size*this.size*nr+e;
        });
        for (let fuchs of this.fuechse) {
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

    *hasenZuege() {
        let hasen = util.deepcopy(this.hasen);
        for (let hase of hasen) {
            let from = Array(...hase);
            for (let dir of util.dirs) {
                let p = util.vecadd(hase, dir);
                let step = 1;
                while (util.gridMatch(this.grid, p, (g)=>(g>=2))) {
                    p = util.vecadd(p, dir);
                    step++;
                }
                if (step>1 && util.gridMatch(this.grid, p, (g)=>(g<2))) {
                    hase[0] = p[0];
                    hase[1] = p[1];
                    yield new Moving(this.fix, hasen, this.fuechse);
                    hase[0] = from[0];
                    hase[1] = from[1];
                }
            }
        }
    }

    *fuchsZuege() {
        let fuechse = util.deepcopy(this.fuechse);
        for (let fuchs of fuechse) {
            let from = fuchs.pos;
            for (let to = fuchs.pos+1; to<this.size-1; to++) {
                let p = util.vecadd(fuchs.start, util.vecmul(to+1, fuchs.vec));
                if (util.gridMatch(this.grid, p, (g)=>g==util.leer)) {
                    fuchs.pos = to;
                    yield new Moving(this.fix, this.hasen, fuechse);
                    fuchs.pos = from;
                } else {
                    break;
                }
            }
            for (let to = fuchs.pos-1; to>=0; to--) {
                let p = util.vecadd(fuchs.start, util.vecmul(to, fuchs.vec));
                if (util.gridMatch(this.grid, p, (g)=>g==util.leer)) {
                    fuchs.pos = to;
                    yield new Moving(this.fix, this.hasen, fuechse);
                    fuchs.pos = from;
                } else {
                    break;
                }
            }
        }
    }

    // Annahme: Jetzige Situation ist eine Lösung.
    explore() {
        let nr = this.toNumber();
        let todo = [nr];
        let max = this.maxPositions();
        let marks = new Uint8Array(Math.ceil(max/8));
        util.setBit(marks, nr);
        console.log(util.getBit(marks,nr));
        let last = nr;
        let parents = {};
        parents[nr] = nr;
        let positions = 1;
        while (todo.length>0) {
            nr = todo.shift();
            last = nr;
            let current = this.fromNumber(nr);
            console.log(current.toString());
            for (let zug of current.fuchsZuege()) {
                let n = zug.toNumber();
                if (!util.getBit(marks, n)) {
                    todo.push(n);
                    util.setBit(marks, n);
                    parents[n] = nr;
                    positions++;
                }
            }
            for (let zug of current.hasenZuege()) {
                console.log("Nachbar");
                console.log(zug.toString());
                let n = zug.toNumber();
                if (!util.getBit(marks, n)) {
                    // Prüfen, ob alle Hasen im Loch
                    if (zug.hasen.every(h=>this.fix.grid[h[0]][h[1]]==util.loch)) {
                        return false;
                    }
                    todo.push(n);
                    util.setBit(marks, n);
                    parents[n] = nr;
                    positions++;
                }
            }
        }
        let solution = [last];
        while (parents[last]!=last) {
            last = parents[last];
            solution.push(last);
        }
        return {'solution':solution, 'positions':positions};
    }
}