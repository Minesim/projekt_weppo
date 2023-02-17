function checkIfLegalMove(fieldId, board) {
    if (board(fieldId)) return 0;
    else return 1;
}

//player is "O" or "X"
function makeMove(fieldId, player, board) {
    board[fieldId] = player;
    return board;
}

//returns 0 when not end, 1 when winning move was just played, 2 when there is a draw
function checkIfEnd(board) {
    //winning conditions
    if ((board[NW]===board[N] && board[N]===board[NE]) ||
        (board[W]===board[C] && board[C]===board[E]) ||
        (board[SW]===board[S] && board[S]===board[SE]) ||
        (board[NW]===board[W] && board[W]===board[SW]) ||
        (board[N]===board[C] && board[C]===board[S]) ||
        (board[NE]===board[E] && board[E]===board[SE]) ||
        (board[NW]===board[C] && board[C]===board[SE]) ||
        (board[SW]===board[C] && board[C]===board[NE])
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