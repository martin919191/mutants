class MutantDetector {

    static regex = /(AAAA|TTTT|CCCC|GGGG)/;


    static isMutant(dna) {
        var isMutant = false;
        //let dna = ["ATGCGA", "CAGTGC", "TTATGT", "AGAAGG", "CTCCTA", "TCACTG"]; //This is a MUTANT
        //let dna = ["CTGCCA", "CAGTGC", "TTATGT", "AGAAGG", "CTCCTA", "TCACTG"]; //This is NOT a MUTANT
        //console.info(regex.exec(dna));
        return new Promise(function (resolve, reject) {
            let columns = MutantDetector.validateRowsCols(dna);
            let diagonals = MutantDetector.validateDiagonals(dna);
            if (columns + diagonals > 2) isMutant = true;
            resolve(isMutant);
        });
    }

    static validateRowsCols(matrix) {
        let o = [];
        var validSequencesInDiagonal = 0;
        matrix.map(x => o.push(''));
        for (var row = 0; row < matrix.length; row++) {
            for (var col = 0; col < matrix.length; col++) {
                o[row] += matrix[col][row];
            }
            // Validate regex in row and col. Add 1 to validSequencesInDiagonal counter if there are valid sequences
            validSequencesInDiagonal = this.regex.exec(o[row]) != null ? validSequencesInDiagonal + 1 : validSequencesInDiagonal;
            validSequencesInDiagonal = this.regex.exec(matrix[row]) != null ? validSequencesInDiagonal + 1 : validSequencesInDiagonal;
            if (validSequencesInDiagonal >= 2) break;
        }
        return validSequencesInDiagonal > 2 ? 2 : validSequencesInDiagonal;
    }

    /**
     * Below function receives a DNA matrix, then evaluates all valid diagonals looking for a valid DNA sequence.
     * Returns:
     *  0 If no valid DNA sequence was found
     *  1 If one valid DNA sequence was found
     *  2 If two or more valid sequences were found
     * 
     * @param {*} matrix The DNA matrix to evaluate.
     */
    static validateDiagonals(matrix) {
        var validSequencesInDiagonal = 0;
        let matrixLength = matrix.length;
        // Condition goes until matrixLength - 3 to avoid extra loops. This can be done as we
        // look for strings with 4+ characters.
        for (var i = 0; i < matrixLength - 3; i++) {
            let diagonal1 = "";
            let diagonal2 = "";
            let diagonal3 = "";
            let diagonal4 = "";
            for (var j = 0; j < matrixLength - i; j++) {
                diagonal1 += matrix[j][j + i];
                diagonal2 += matrix[j + i][j];
                diagonal3 += matrix[j + i][matrixLength - 1 - j];
                diagonal4 += matrix[j][matrixLength - 1 - j - i];
            }

            validSequencesInDiagonal = this.regex.exec(diagonal1) != null ? validSequencesInDiagonal + 1 : validSequencesInDiagonal;
            validSequencesInDiagonal = this.regex.exec(diagonal2) != null ? validSequencesInDiagonal + 1 : validSequencesInDiagonal;
            validSequencesInDiagonal = this.regex.exec(diagonal3) != null ? validSequencesInDiagonal + 1 : validSequencesInDiagonal;
            validSequencesInDiagonal = this.regex.exec(diagonal4) != null ? validSequencesInDiagonal + 1 : validSequencesInDiagonal;
            if (validSequencesInDiagonal >= 2) break;
            //diagonals.push(diagonal1);
            //if (diagonal2 != diagonal1) diagonals.push(diagonal2);
            //diagonals.push(diagonal3);
            //if (diagonal4 != diagonal3) diagonals.push(diagonal4);
        }
        return validSequencesInDiagonal > 2 ? 2 : validSequencesInDiagonal;
    }
}

module.exports = MutantDetector;