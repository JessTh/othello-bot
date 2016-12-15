'use strict';

let C = require('./constants');

/*
 0  1  2  3  4  5  6  7  8  9
   ---------------------------
10 | 11 12 13 14 15 16 17 18 | 19
20 | 21 22 23 24 25 26 27 28 | 29
30 | 31 32 33 34 35 36 37 38 | 39
40 | 41 42 43 44 45 46 47 48 | 49
50 | 51 52 53 54 55 56 57 58 | 59
60 | 61 62 63 64 65 66 67 68 | 69
70 | 71 72 73 74 75 76 77 78 | 79
80 | 81 82 83 84 85 86 87 88 | 89
   --------------------------
90 | 91 92 93 94 95 96 97 98 99
*/

// return piece for printing
function nameOf(piece)      { return '.@O?'[piece]; }
function playerName(player) { return player === 1 ? 'black' : 'white'; }
function opponent(player)   { return player === C.BLACK ? C.WHITE : C.BLACK; }

// deftype piece () *(integer .empty .outer)
let piece = (type) => type ? type : C.EMPTY;

// board = array of piece
let board = (type) => new Array(100).fill(piece(type));

function copyBoard(board) { return board.slice(); }

// sef board ref
function set(board, square, val) { board[square] = val; }

function initialBoard() {
  let iboard = board(C.OUTER);   // iniate board with outer pieces
  C.ALL_SQUARES.forEach((s) => iboard[s] = C.EMPTY);  // set empty squares
  iboard[44] = C.WHITE; iboard[45] = C.BLACK;
  iboard[54] = C.BLACK; iboard[55] = C.WHITE;
  return iboard;
}

function printBoard(board) {
  let a = count(C.BLACK, board);
  let b = count(C.WHITE, board);
  console.log(`   1 2 3 4 5 6 7 8   [${a}, ${b}, ${a-b}]`);
  for (let i=1; i<9; i++) {
    process.stdout.write(i+'0 ');
    for (let j=1; j<9; j++) {
      let piece = board[i * 10 + j];
      process.stdout.write(nameOf(piece) + ' ');
    }
    console.log(''); // new line
  }
}
let ib = initialBoard();
// printBoard(ib);

function count(player, board) {
  return board.filter((p) => p === player).length;
}

function countDifference(player, board) {
  return board.filter((p) => p === player).length - board.filter((p) => p === opponent(player)).length;
}

// valid moves are numbers in ALL_SQUARES
// valid moves are numbers in the range 11-88 that end in 1-8
function isValid(move) {
  return C.ALL_SQUARES.some((a) => a === move);
}

// legal move needs to be to an empty square, and it needs to flip at elast one opponent piece
function isLegal(move, player, board) {
  return board[move] === C.EMPTY && C.ALL_DIRECTIONS.some((dir) => wouldFlip(move, player, board, dir));
}

// returns false if no bracketing pice found, square of bracketing piece otherwise.
function wouldFlip(move, player, board, dir) {
  let c = move + dir;   // first piece in direction.
  return board[c] === opponent(player) && findBracketingPiece(c+dir, player, board, dir);
}

function findBracketingPiece(square, player, board, dir) {
  if (board[square] === player) return square;
  else if (board[square] === opponent(player)) return findBracketingPiece(square + dir, player, board, dir);
  return null;
}
// console.log(findBracketingPiece(45, C.WHITE, ib, -1) === 44);

function makeMove(move, player, board) {
  board[move] = player;   // set square
  C.ALL_DIRECTIONS.forEach((dir) => makeFlips(move, player, board, dir));   // make any flips
  return board;
}

function makeFlips(move, player, board, dir) {
  let bracketer = wouldFlip(move, player, board, dir);
  if (bracketer) {
    // console.log(`bracketer: ${bracketer}`);
    for (var i=move+dir; i !== bracketer; i+=dir) {
      board[i] = player;
    }
  }
}

// play game with 2 strategies and return result (pos = black won)
function play(blStrategy, whStrategy, print, result) {
  let board   = initialBoard();
  let player  = C.BLACK;
  let strategy;
  while (player !== null) {
    strategy = (player === C.BLACK) ? blStrategy : whStrategy;
    board    = getMove(strategy, player, board, print);
    player   = nextToPlay(board, player, print);
  }
  if (print) {
    console.log(printBoard(board));
    console.log(`Game Over, final result: ${countDifference(C.BLACK, board)}`);
  } else if (result) {
    return countDifference(C.BLACK, board);
  }
}

function nextToPlay(board, prevPlayer, print) {
  // console.log(board);
  let opp = opponent(prevPlayer);
  if (anyLegalMove(opp, board)) return opp;
  if (anyLegalMove(prevPlayer, board)) return prevPlayer;
  return null;
}

function anyLegalMove(player, board) {
  return C.ALL_SQUARES.some((move) => isLegal(move, player, board));
}

// call players strategy function to get a move (until legal move is found)
function getMove(strategy, player, board, print) {
  if (print) printBoard(board);
  let move = strategy(player, copyBoard(board));    // copy so that strategy can't change the board.
  if (isValid(move) && isLegal(move, player, board)) {
    if (print) console.log(`${playerName(player)} moves to ${move}`);
    board = makeMove(move, player, board);
    return board;
  } else {
    getMove(strategy, player, board, print);
  }
}

module.exports.playerName       = playerName;
module.exports.play             = play;
module.exports.isLegal          = isLegal;
module.exports.countDifference  = countDifference;
module.exports.makeMove         = makeMove;
module.exports.copyBoard        = copyBoard;
module.exports.opponent         = opponent;
