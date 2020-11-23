const http = require('http');
const request = require('request');
const fs = require('fs');
const { resolve } = require('path');

const batchCount = 5;
const callsPerBatch = 2500; 

let dnaSequences = JSON.parse(fs.readFileSync('tests/dnaSequences.json'));
let okCount = 0, failCount = 0;

function runTestBatch(batchCount) {
    return new Promise(function (resolve, reject) {
        var ok = 0, fail = 0;
        for (var j = 0; j < batchCount; j++) {
            var randomIndex = Math.floor(Math.random() * dnaSequences.length);
            var dnaSequence = dnaSequences[randomIndex];
            request.post(
                {
                    url: "http://localhost:8080/mutant",
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
    runTestBatch(callsPerBatch).then(function (result) {
        executedBatches++;
        totalOk += result['ok'];
        totalFail += result['fail'];
        if (executedBatches < batchCount) {
            runBatches();
        } else {
            console.info(totalOk);
            console.info(totalFail);
        }
    });

}

runBatches();