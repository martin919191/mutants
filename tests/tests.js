const http = require('http');
const request = require('request');
const fs = require('fs');
const { resolve } = require('path');

const batchCount = 1;
const callsPerBatch = 10; 

let dnaSequences = JSON.parse(fs.readFileSync('tests/dnaSequences.json'));
let okCount = 0, failCount = 0;

function runTestBatch(batchCount, batchNbr) {
    console.info(`Running batch ${batchNbr}`);
    return new Promise(function (resolve, reject) {
        var ok = 0, fail = 0;
        for (var j = 0; j < batchCount; j++) {
            console.info(`Call ${j}`);
            var randomIndex = Math.floor(Math.random() * dnaSequences.length);
            var dnaSequence = dnaSequences[randomIndex];
            request.post(
                {
                    //url: "https://project-mutants.uc.r.appspot.com/mutant",
                    url: "http://localhost:3001/mutant",
                    method: "POST",
                    json: true,
                    body: {
                        "dna": dnaSequence
                    }
                },
                function (error, response, body) {
                    if (!error) {
                        ok++;
                    } else {
                        console.info(error);
                        fail++;
                    }
                    if (ok + fail == batchCount) {
                        resolve({ "ok": ok, "fail": fail })
                    }
                }
            );
        }
    });
}

var executedBatches = 0;
var totalOk = 0, totalFail = 0;
function runBatches() {
    runTestBatch(callsPerBatch, executedBatches).then(function (result) {
        console.info(`Batch ${executedBatches} complete`);
        executedBatches++;
        totalOk += result['ok'];
        totalFail += result['fail'];
        if (executedBatches < batchCount) {
            console.info(`Running batch ${executedBatches}`);
            runBatches();
        } else {
            console.info(totalOk);
            console.info(totalFail);
        }
    });

}
console.info('Sarlanga');
runBatches();