'use strict';

/* Directions:
-11 -10  -9
- 1       1
  9  10  11 */
const ALL_DIRECTIONS = [-11, -10, -9, -1, 1, 9, 10, 11];

const EMPTY = 0;
const BLACK = 1;
const WHITE = 2;
const OUTER = 3;

// list of all legal squares
const ALL_SQUARES = (function() {
  let a = [];
  for (let i=11; i<=88; i++) {
    if (i % 10 > 0 && i % 10 < 9) a.push(i);
  }
  return a;
})();

const WEIGHTS = [
  0,   0,   0,  0,  0,  0,  0,   0,   0, 0,
  0, 120, -20, 20,  5,  5, 20, -20, 120, 0,
  0, -20, -40, -5, -5, -5, -5, -40, -20, 0,
  0,  20,  -5, 15,  3,  3, 15,  -5,  20, 0,
  0,   5,  -5,  3,  3,  3,  3,  -5,   5, 0,
  0,   5,  -5,  3,  3,  3,  3,  -5,   5, 0,
  0,  20,  -5, 15,  3,  3, 15,  -5,  20, 0,
  0, -20, -40, -5, -5, -5, -5, -40, -20, 0,
  0, 120, -20, 20,  5,  5, 20, -20, 120, 0,
  0,   0,   0,  0,  0,  0,  0,   0,   0, 0,
];

module.exports = {
  EMPTY         : EMPTY,
  BLACK         : BLACK,
  WHITE         : WHITE,
  OUTER         : OUTER,
  ALL_SQUARES   : ALL_SQUARES,
  ALL_DIRECTIONS: ALL_DIRECTIONS,
  WEIGHTS       : WEIGHTS,
};
