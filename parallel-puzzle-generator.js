import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { generator } from "./generator.mjs"
import { util } from "./util.mjs"
import { Fix } from "./fix.mjs"
import { Moving } from "./moving.mjs"
import * as fs from "fs";

if (isMainThread) {

    let chunk = 50;
    let numThreads = 10;
    const maxThreads = numThreads;
    
    let wdQueue = [];
    let workers = [];
    let puzzles = [];


    var puzzlefile = fs.createWriteStream('puzzles.json');
    puzzlefile.write('[\n');
    
    let runWorker = function() {
        if (numThreads>0 && wdQueue.length>0) {
            let worker = new Worker("./parallel-puzzle-generator.js", wdQueue.pop());
            numThreads--;
            worker.on("message", msg => {
                for (let p of msg) {
                    puzzles.push(p);
                    puzzlefile.write(JSON.stringify(p)+",\n");
                }
                console.log(`Total ${puzzles.length} puzzles, Queue: ${wdQueue.length}`);
            });
            worker.on("error", err => console.error(err));
            worker.on("exit", code => {
                //console.log(`Thread finished with code ${code}`);
                numThreads++;
                runWorker();
                // alles fertig?
                if (numThreads == maxThreads && wdQueue.length==0) {
                    puzzlefile.write("]\n");
                }
            });
        }
    }


    for (let anzahlHasen=1; anzahlHasen<5; anzahlHasen++) {
        for (let anzahlPilze=1; anzahlPilze<4; anzahlPilze++) {
            for (let anzahlFuechse=0; anzahlFuechse<3; anzahlFuechse++) {
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
            }
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
    parentPort.postMessage(puzzles);
}
