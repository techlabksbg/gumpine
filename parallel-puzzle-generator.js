import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { generator } from "./generator.mjs"
import { util } from "./util.mjs"
import { Fix } from "./fix.mjs"
import { Moving } from "./moving.mjs"

if (isMainThread) {

    let chunk = 10;
    let numThreads = 10;
    let anzahlHasen = 4;
    let anzahlPilze = 3;
    let anzahlFuechse = 2;
    let wdQueue = [];
    let workers = [];
    let puzzles = [];

    let runWorker = function() {
        if (numThreads>0 && wdQueue.length>0) {
            console.log(`Start Thread with wdQueue.lenth = ${wdQueue.length}`);
            let worker = new Worker("./parallel-puzzle-generator.js", wdQueue.pop());
            numThreads--;
            worker.on("message", msg => {
                for (let p of msg) {
                    puzzles.push(p);
                }
                console.log(`[Main]: Total of ${puzzles.length} puzzles`);
            });
            worker.on("error", err => console.error(err));
            worker.on("exit", code => {
                //console.log(`Thread finished with code ${code}`);
                numThreads++;
                runWorker();
            });
        }
    }

    for (let hasen of generator.hasenPlaetze(anzahlHasen)) {
        let pilzePlaetze = generator.pilzPlaetze(anzahlPilze, hasen);
        let startPos = 0;
        while (startPos < pilzePlaetze.length) {
            let wd = {"workerData" : {
                "hasen" : util.deepcopy(hasen),
                "pilzPlaetze" : pilzePlaetze.slice(startPos, startPos+chunk),
                "anzahlFuechse" : anzahlFuechse,
            }};
            wdQueue.push(wd);
            startPos+=chunk;
            runWorker();
        }
    }



} else {
    const data = workerData;
    let hasen = workerData.hasen;
    let pilzPlaetze = workerData.pilzPlaetze;
    let anzahlFuechse = workerData.anzahlFuechse;
    let puzzles = [];
    //console.log(`pilzPlaetze = ${pilzPlaetze}`);
    for (let pilze of pilzPlaetze) {
        for (let fuechse of generator.fuchsPlaetze(anzahlFuechse, hasen, pilze)) {
            let f = new Fix(pilze);
            let m = new Moving(f, hasen, fuechse);
            let sol = m.explore();
            if ('positions' in sol) {
                let puzzle = {
                    'base' : m.toMiniObj(),
                    'sol' : sol
                };
                puzzles.push(puzzle);
            }
        }
    }
    console.log(`Done with ${puzzles.length} puzzles.`);
    parentPort.postMessage(puzzles);
}
