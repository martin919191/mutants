const { BigQuery } = require('@google-cloud/bigquery');
const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    if (process.env.DBTYPE != undefined && process.env.DBTYPE.toUpperCase() == 'LOCAL') {
      console.info("Setting up local DB...");
      this.db = new sqlite3.Database('db/mutant_data.db');
      this.db.run('CREATE TABLE dna_sequences(sequence text, mutant_indicator integer)', function (err) {
        console.error(err.message);
      });

      // Function implementation for local DB
      this.insertDnaSequence = async function (sequence, mutantIndicator) {
        let q = `INSERT INTO dna_sequences VALUES('${sequence}', ${mutantIndicator ? 1 : 0})`;
        this.db.run(q);
      }
      this.getStats = function () {
        var db = this.db;
        return new Promise(function (resolve, reject) {
          db.all("SELECT CASE mutant_indicator WHEN 1 THEN 'count_mutant_dna' ELSE 'count_human_dna' END indicator, COUNT(1) count FROM dna_sequences GROUP BY mutant_indicator", [], (err, rows) => {
            if (err) {
              throw err;
            }
            var obj = {};
            rows.forEach((row) => {
              obj[row.indicator] = row.count;
            });
            obj['ratio'] = obj['count_mutant_dna'] / obj['count_human_dna'];
            resolve(obj);
          });
        });
      }

    } else {
      this.bigquery = new BigQuery();
      this.dataset = this.bigquery.dataset('mutant_data');
      this.table = this.dataset.table('dna_sequences');

      // Function implementation for BigQuery DB
      this.insertDnaSequence = async function (sequence, mutantIndicator) {
        this.table.insert({
          sequence: sequence,
          mutant_indicator: mutantIndicator
        }).catch((err) => {
          console.error(err.errors[0].errors[0].reason);
        });
      }
      this.getStats = function () {
        var bigquery = this.bigquery;
        return new Promise(function (resolve, reject) {
          bigquery.query("SELECT CASE mutant_indicator WHEN true THEN 'count_mutant_dna' ELSE 'count_human_dna' END indicator, COUNT(1) count FROM mutant_data.dna_sequences GROUP BY mutant_indicator", [], (err, rows) => {
            if (err) {
              throw err;
            }
            var obj = {};
            rows.forEach((row) => {
              obj[row.indicator] = row.count;
            });
            obj['ratio'] = obj['count_mutant_dna'] / obj['count_human_dna'];
            resolve(obj);
          });
        });
      }
    }
  }
}

module.exports = Database;
