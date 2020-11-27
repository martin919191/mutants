const { BigQuery } = require('@google-cloud/bigquery');
class Database {
    constructor() {

        this.bigquery = new BigQuery();
        this.dataset = this.bigquery.dataset('mutant-data');
        this.table = this.dataset.table('dna_sequences');
    }

    async insertDnaSequence(sequence, mutantIndicator) {
        table.insert({
            sequence: sequence,
            mutant_indicator: mutantIndicator
        }).catch((err) => {
            // An API error or partial failure occurred.
            console.error(err);
            if (err.name === 'PartialFailureError') {
                // Some rows failed to insert, while others may have succeeded.

                // err.errors (object[]):
                // err.errors[].row (original row object passed to `insert`)
                // err.errors[].errors[].reason
                // err.errors[].errors[].message
            }
        });

    }
}

module.exports = Database;

//-
// Insert multiple rows at a time.
//-
/*const rows = [
  {
    INSTNM: 'Motion Picture Institute of Michigan',
    CITY: 'Troy',
    STABBR: 'MI'
  },
  // ...
];

table.insert(rows, insertHandler);

//-
// Insert a row as according to the <a href="https://cloud.google.com/bigquery/docs/reference/v2/tabledata/insertAll">specification</a>.
//-
const row = {
  insertId: '1',
  json: {
    INSTNM: 'Motion Picture Institute of Michigan',
    CITY: 'Troy',
    STABBR: 'MI'
  }
};

const options = {
  raw: true
};

table.insert(row, options, insertHandler);

//-
// Handling the response. See <a href="https://developers.google.com/bigquery/troubleshooting-errors">Troubleshooting Errors</a> for best practices on how to handle errors.
//-
function insertHandler(err, apiResponse) {
  if (err) {
    // An API error or partial failure occurred.

    if (err.name === 'PartialFailureError') {
      // Some rows failed to insert, while others may have succeeded.

      // err.errors (object[]):
      // err.errors[].row (original row object passed to `insert`)
      // err.errors[].errors[].reason
      // err.errors[].errors[].message
    }
  }
}

//-
// If the callback is omitted, we'll return a Promise.
//-
table.insert(rows)
  .then((data) => {
    const apiResponse = data[0];
  })
  .catch((err) => {
    // An API error or partial failure occurred.

    if (err.name === 'PartialFailureError') {
      // Some rows failed to insert, while others may have succeeded.

      // err.errors (object[]):
      // err.errors[].row (original row object passed to `insert`)
      // err.errors[].errors[].reason
      // err.errors[].errors[].message
    }
  });
*/