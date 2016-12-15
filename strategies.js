'use strict';

let othello = require('./othello-bot');
let C       = require('./constants');

// return the best move for player according to the given evaluation function
function maximizer(evalFunc, player, board) {
  // evalFunc takes arguments: (player, board)
  let moves   = legalMoves(player, board);
  let scores  = moves.map((move) => evalFunc(player, othello.makeMove(move, player, othello.copyBoard(board))));
  let best    = Math.max.apply(null, scores);
  // console.log(moves, scores, best, moves[scores.indexOf(best)]);
  return moves[scores.indexOf(best)];
}


// ================= RANDOM STRATEGY ======================================
function randomStrategy(player, board) {
  let lms = legalMoves(player, board)
  return lms[Math.floor(Math.random()*lms.length)];
}

function legalMoves(player, board) {
  return C.ALL_SQUARES.filter((move) => othello.isLegal(move, player, board));
}


// ================= EVALUATE POSITIONS ==================================
function maximizeDifference(player, board) {
  return maximizer(othello.countDifference, player, board);
}

// ================= WEIGHTED SQUARES ====================================

function maximizeWeightedSquares(player, board) {
  return maximizer(weightedSquares, player, board);
}

// calculates sum of the weights of player's squares - opponents weighted squares
function weightedSquares(player, board) {
  let opp = othello.opponent(player);
  return C.ALL_SQUARES.reduce((a, b) => {
    if (board[b] === player) return a + C.WEIGHTS[b];
    if (board[b] === opp)    return a - C.WEIGHTS[b];
    return a;
  }, 0);
}

// ================ GAMETREE - MINIMAX ===================================

// NOTE: to be implemented

const WINNING_VALUE = Number.MAX_NUMBER;
const LOSING_VALUE  = Number.MIN_SAFE_INTEGER;

// evaluate final result, win/drax/loss?
function finalValue(player, board) {
  let diff = othello.countDifference(player, board);
  if (diff < 0) return LOSING_VALUE;
  else if (diff > 0) return WINNING_VALUE;
  return 0;
}


// =======================================================================

function runBatch(strategy1, strategy2, N) {
  let outcome = [];
  for (let i=0; i<N; i++) {
    outcome.push(othello.play(strategy1, strategy2, false, true));
  }
  let win   = outcome.filter((res) => res > 0).length;
  let lose  = outcome.filter((res) => res < 0).length;
  console.log(`wins:   ${win} (${win/N*100} %)`);
  console.log(`losses: ${lose} (${lose/N*100} %)`);
  console.log(`draws:  ${(N-win-lose)} (${(N-win-lose)/N*100} %)`);
}

// runBatch(randomStrategy, randomStrategy, 1000);

// othello.play(maximizeDifference, randomStrategy, true);
// runBatch(maximizeDifference, randomStrategy, 1000);

// othello.play(maximizeWeightedSquares, randomStrategy, true);
// runBatch(maximizeWeightedSquares, randomStrategy, 100);
