function checkIfLegalMove(fieldId, board) {
    if (board[fieldId] !== '') return 0;
    else return 1;
}

//symbol is "O" or "X"
function makeMove(fieldId, symbol, board) {
    board[fieldId] = symbol;
    return board;
}

//returns 0 when not end, 1 when winning move was just played, 2 when there is a draw
function checkIfEnd(board, symbol) {
    //winning conditions
    if ((board["NW"] === symbol && board["N"] === symbol && board["NE"] === symbol) ||
        (board["W"] === symbol && board["C"] === symbol && board["E"] === symbol) ||
        (board["SW"] === symbol && board["S"] === symbol && board["SE"] === symbol) ||
        (board["NW"] === symbol && board["W"] === symbol && board["SW"] === symbol) ||
        (board["N"] === symbol && board["C"] === symbol && board["S"] === symbol) ||
        (board["NE"] === symbol && board["E"] === symbol && board["SE"] === symbol) ||
        (board["NW"] === symbol && board["C"] === symbol && board["SE"] === symbol) ||
        (board["NE"] === symbol && board["C"] === symbol && board["SW"] === symbol)
    )
        return 1;
    else {
        for (cell in board) {
            if (!board[cell]) return 0; //there is still an empty cell on the board
        }
        return 2; //there are no empty cells on the board
    }
}


module.exports = {
    checkIfLegalMove,
    makeMove,
    checkIfEnd
  };