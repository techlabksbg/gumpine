import {Fix} from "./fix.mjs"
import {Moving} from "./moving.mjs"
import {generator} from "./generator.mjs"

let puzzles = generator.makePuzzles(4,3,2);

for (let puzzle of puzzles) {
    if (puzzle.sol.solution.length>20) {
        let m = Moving.fromObj(puzzle.base);
        m = m.fromNumber(puzzle.sol.solution[0]);
        console.log(`Moves : ${puzzle.sol.solution.length-1}, Configurations: ${puzzle.sol.positions}`);
        console.log(m.toString());
    }
}
