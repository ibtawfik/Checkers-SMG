'use strict';

/**
 * This is the logic for the game "Checkers".
 */

// Constant. Do not touch!!!
var CONSTANT = (function () {
  var constant = {
    ROW: 8,
    COLUMN: 4
  };

  return {
    get: function (key) {
      return constant[key];
    }
  };
}());

/**
 * Game board for reference.
 *
 * EVEN | 00 | ** | 01 | ** | 02 | ** | 03 | ** |
 * ODD  | ** | 04 | ** | 05 | ** | 06 | ** | 07 |
 * EVEN | 08 | ** | 09 | ** | 10 | ** | 11 | ** |
 * ODD  | ** | 12 | ** | 13 | ** | 14 | ** | 15 |
 * EVEN | 16 | ** | 17 | ** | 18 | ** | 19 | ** |
 * ODD  | ** | 20 | ** | 21 | ** | 22 | ** | 23 |
 * EVEN | 24 | ** | 25 | ** | 26 | ** | 27 | ** |
 * ODD  | ** | 28 | ** | 29 | ** | 30 | ** | 31 |
 */

/**
 * Get all possible upwards simple moves  or a specific piece.
 *
 * @param checkersState the game state
 * @param pieceIndex the piece's pieceIndex
 * @return an array of all possible move destinations
 */
var getMoveUpMoves = function (checkersState, pieceIndex) {
  var moves = [],
    leftUpIndex,
    rightUpIndex;

  // If the piece is in the first row, then there's no way to move up.
  if (pieceIndex / CONSTANT.get('COLUMN') === 0) {
    return moves;
  }

  if (Math.floor(pieceIndex / CONSTANT.get('COLUMN')) % 2 === 0) {
    // EVEN ROW

    // Check left first
    leftUpIndex = pieceIndex - CONSTANT.get('COLUMN') - 1;
    // For the leftmost one, it can only move to the right up side.
    if (pieceIndex % CONSTANT.get('COLUMN') !== 0
        && checkersState[leftUpIndex] === 'EMPTY') {
      moves.push(leftUpIndex);
    }

    // Check right
    rightUpIndex = pieceIndex - CONSTANT.get('COLUMN');
    if (checkersState[rightUpIndex] === 'EMPTY') {
      moves.push(rightUpIndex);
    }

  } else {
    // ODD ROW

    // Check left first
    leftUpIndex = pieceIndex - CONSTANT.get('COLUMN');
    if (checkersState[leftUpIndex] === 'EMPTY') {
      moves.push(leftUpIndex);
    }

    // Check right, for the rightmost one, it can only move to the left up side.
    rightUpIndex = pieceIndex - CONSTANT.get('COLUMN') + 1;
    if (rightUpIndex % CONSTANT.get('COLUMN') !== CONSTANT.get('COLUMN') - 1
        && checkersState[rightUpIndex] === 'EMPTY') {
      moves.push(rightUpIndex);
    }
  }

  return moves;
};

/**
 * Get all possible downwards simple moves for a specific piece.
 *
 * @param checkersState the game state
 * @param pieceIndex the piece's pieceIndex
 * @return an array of all possible move destinations
 */
var getMoveDownMoves = function (checkersState, pieceIndex) {
  var moves = [],
    leftUpIndex,
    rightUpIndex;

  // If the piece is in the last row, then there's no way to move down.
  if (pieceIndex > (CONSTANT.get('ROW') - 1) * CONSTANT.get('COLUMN') - 1) {
    return moves;
  }

  if (Math.floor(pieceIndex / CONSTANT.get('COLUMN')) % 2 === 0) {
    // EVEN ROW

    // Check left first, for the leftmost one,
    // it can only move to the right up side
    leftUpIndex = pieceIndex + CONSTANT.get('COLUMN') - 1;
    if (leftUpIndex % CONSTANT.get('COLUMN') !== 3
        && checkersState[leftUpIndex] === 'EMPTY') {
      moves.push(leftUpIndex);
    }

    // Check right
    rightUpIndex = pieceIndex + CONSTANT.get('COLUMN');
    if (checkersState[rightUpIndex] === 'EMPTY') {
      moves.push(rightUpIndex);
    }

  } else {
    // ODD ROW

    // Check left first
    leftUpIndex = pieceIndex + CONSTANT.get('COLUMN');
    if (checkersState[leftUpIndex] === 'EMPTY') {
      moves.push(leftUpIndex);
    }

    // Check right, for the rightmost one, it can only move to the left up side.
    rightUpIndex = pieceIndex + CONSTANT.get('COLUMN') + 1;
    if (rightUpIndex % CONSTANT.get('COLUMN') !== 0
        && checkersState[rightUpIndex] === 'EMPTY') {
      moves.push(rightUpIndex);
    }
  }
  return moves;
};

/**
 * Check if the jump is valid.
 *
 * @param ownPiece the player's own piece
 * @param opponentPiece the opponent's (jumped) piece
 * @param targetCell the target cell
 * @returns true if the jump is valid, otherwise false
 */
var validateJump = function (ownPiece, opponentPiece, targetCell) {
  return opponentPiece !== 'EMPTY'
    // Can only jump over an opponent piece
      && ownPiece.substr(0, 1) !== opponentPiece.substr(0, 1)
    // Can not jump over an already jumped (captured) piece
      && opponentPiece.length === 4
      && targetCell === 'EMPTY';
};

/**
 * Get all possible upwards jump moves for a specific piece.
 *
 * @param checkersState the game state.
 * @param pieceIndex the piece's pieceIndex.
 * @return an array of all possible move paths. Including the jumped piece index
 *  and target cell index.
 */
var getJumpUpMoves = function (checkersState, pieceIndex) {
  var ownPiece = checkersState[pieceIndex],
    opponentPieceIndex,
    opponentPiece,
    targetCellIndex,
    targetCell,
    moves = [];

  if ((pieceIndex / CONSTANT.get('COLUMN')) < 2) {
    return moves;
  }

  if (Math.floor(pieceIndex / CONSTANT.get('COLUMN')) % 2 === 0) {
    // Even row

    // Check left
    if (pieceIndex % CONSTANT.get('COLUMN') !== 0) {
      opponentPieceIndex = pieceIndex - CONSTANT.get('COLUMN') - 1;
      targetCellIndex = pieceIndex - 2 * CONSTANT.get('COLUMN') - 1;
      opponentPiece = checkersState[opponentPieceIndex];
      targetCell = checkersState[targetCellIndex];

      if (validateJump(ownPiece, opponentPiece, targetCell)) {
        moves.push([opponentPieceIndex, targetCellIndex]);
      }
    }

    // Check right
    if (pieceIndex % CONSTANT.get('COLUMN') !== CONSTANT.get('COLUMN') - 1) {
      opponentPieceIndex = pieceIndex - CONSTANT.get('COLUMN');
      targetCellIndex = pieceIndex - 2 * CONSTANT.get('COLUMN') + 1;
      opponentPiece = checkersState[opponentPieceIndex];
      targetCell = checkersState[targetCellIndex];

      if (validateJump(ownPiece, opponentPiece, targetCell)) {
        moves.push([opponentPieceIndex, targetCellIndex]);
      }
    }
  } else {
    // Odd row

    // Check left
    if (pieceIndex % CONSTANT.get('COLUMN') !== 0) {
      opponentPieceIndex = pieceIndex - CONSTANT.get('COLUMN');
      targetCellIndex = pieceIndex - 2 * CONSTANT.get('COLUMN') - 1;
      opponentPiece = checkersState[opponentPieceIndex];
      targetCell = checkersState[targetCellIndex];

      if (validateJump(ownPiece, opponentPiece, targetCell)) {
        moves.push([opponentPieceIndex, targetCellIndex]);
      }
    }

    // Check right
    if (pieceIndex % CONSTANT.get('COLUMN') !== CONSTANT.get('COLUMN') - 1) {
      opponentPieceIndex = pieceIndex - CONSTANT.get('COLUMN') - 1;
      targetCellIndex = pieceIndex - 2 * CONSTANT.get('COLUMN') + 1;
      opponentPiece = checkersState[opponentPieceIndex];
      targetCell = checkersState[targetCellIndex];

      if (validateJump(ownPiece, opponentPiece, targetCell)) {
        moves.push([opponentPieceIndex, targetCellIndex]);
      }
    }
  }

  return moves;
};

/**
 * Get all possible downwards jump moves for a specific piece.
 *
 * @param checkersState the game state.
 * @param pieceIndex the piece's pieceIndex.
 * @return an array of all possible move paths. Including the jumped piece index
 *  and target cell index.
 */
var getJumpDownMoves = function (checkersState, pieceIndex) {
  var ownPiece = checkersState[pieceIndex],
    opponentPieceIndex,
    opponentPiece,
    targetCellIndex,
    targetCell,
    moves = [];

  if ((pieceIndex / CONSTANT.get('COLUMN')) === CONSTANT.get('ROW') - 1) {
    return moves;
  }

  if (Math.floor(pieceIndex / CONSTANT.get('COLUMN')) % 2 === 0) {
    // Even row

    // Check left
    if (pieceIndex % CONSTANT.get('COLUMN') !== 0) {
      opponentPieceIndex = pieceIndex + CONSTANT.get('COLUMN') - 1;
      targetCellIndex = pieceIndex + 2 * CONSTANT.get('COLUMN') - 1;
      opponentPiece = checkersState[opponentPieceIndex];
      targetCell = checkersState[targetCellIndex];

      if (validateJump(ownPiece, opponentPiece, targetCell)) {
        moves.push([opponentPieceIndex, targetCellIndex]);
      }
    }

    // Check right
    if (pieceIndex % CONSTANT.get('COLUMN') !== CONSTANT.get('COLUMN') - 1) {
      opponentPieceIndex = pieceIndex + CONSTANT.get('COLUMN');
      targetCellIndex = pieceIndex + 2 * CONSTANT.get('COLUMN') + 1;
      opponentPiece = checkersState[opponentPieceIndex];
      targetCell = checkersState[targetCellIndex];

      if (validateJump(ownPiece, opponentPiece, targetCell)) {
        moves.push([opponentPieceIndex, targetCellIndex]);
      }
    }
  } else {
    // Odd row

    // Check left
    if (pieceIndex % CONSTANT.get('COLUMN') !== 0) {
      opponentPieceIndex = pieceIndex + CONSTANT.get('COLUMN');
      targetCellIndex = pieceIndex + 2 * CONSTANT.get('COLUMN') - 1;
      opponentPiece = checkersState[opponentPieceIndex];
      targetCell = checkersState[targetCellIndex];

      if (validateJump(ownPiece, opponentPiece, targetCell)) {
        moves.push([opponentPieceIndex, targetCellIndex]);
      }
    }

    // Check right
    if (pieceIndex % CONSTANT.get('COLUMN') !== CONSTANT.get('COLUMN') - 1) {
      opponentPieceIndex = pieceIndex + CONSTANT.get('COLUMN') + 1;
      targetCellIndex = pieceIndex + 2 * CONSTANT.get('COLUMN') + 1;
      opponentPiece = checkersState[opponentPieceIndex];
      targetCell = checkersState[targetCellIndex];

      if (validateJump(ownPiece, opponentPiece, targetCell)) {
        moves.push([opponentPieceIndex, targetCellIndex]);
      }
    }
  }

  return moves;
};

/**
 * Get all possible simple moves for a specific piece. If it is crown,
 * also check if it can move one step backward.
 *
 * @param checkersState the game state.
 * @param pieceIndex the piece pieceIndex.
 * @return an array of all possible move destinations.
 */
var getSimpleMoves = function (checkersState, pieceIndex, turnIndex) {
  var moves = [],
    tmpMoves = [],
    piece = checkersState[pieceIndex],
    color = piece.substr(0, 1),
    kind = piece.substr(1, 3);

  if (color === "B" && turnIndex === 1) {
    if (kind === 'CRO') {
      tmpMoves = getMoveUpMoves(checkersState, pieceIndex);
      moves = moves.concat(tmpMoves);
    }

    tmpMoves = getMoveDownMoves(checkersState, pieceIndex);
    moves = moves.concat(tmpMoves);
  } else if (color === "W" && turnIndex === 0) {
    if (kind === 'CRO') {
      tmpMoves = getMoveDownMoves(checkersState, pieceIndex);
      moves = moves.concat(tmpMoves);
    }

    tmpMoves = getMoveUpMoves(checkersState, pieceIndex);
    moves = moves.concat(tmpMoves);
  }

  return moves;
};

/**
 * Get all possible jump moves for a specific piece. If it is crown,
 * also check if it can jump backward.
 *
 * @param checkersState the game state.
 * @param pieceIndex the piece pieceIndex.
 * @return an array of all possible move paths. Including the jumped piece index
 *  and target cell index.
 */
var getJumpMoves = function (checkersState, pieceIndex, turnIndex) {
  var moves = [],
    tmpMoves = [],
    piece = checkersState[pieceIndex],
    color = piece.substr(0, 1),
    kind = piece.substr(1, 3);

  if (color === "B" && turnIndex === 1) {
    if (kind === 'CRO') {
      tmpMoves = getJumpUpMoves(checkersState, pieceIndex);
      moves = moves.concat(tmpMoves);
    }
    tmpMoves = getJumpDownMoves(checkersState, pieceIndex);
    moves = moves.concat(tmpMoves);
  } else if (color === "W" && turnIndex === 0) {
    if (kind === 'CRO') {
      tmpMoves = getJumpDownMoves(checkersState, pieceIndex);
      moves = moves.concat(tmpMoves);
    }

    tmpMoves = getJumpUpMoves(checkersState, pieceIndex);
    moves = moves.concat(tmpMoves);
  }

  return moves;
};

/**
 * Clone a object.
 *
 * @param obj
 * @returns {*}
 */
var clone = function (obj) {
  var str = JSON.stringify(obj),
    copy = JSON.parse(str);
  return copy;
};

/**
 * A function takes the state in game API format and convert it to a
 * array format for later calculation convenience.
 * @param gameApiState the game state in game API format.
 */
var convertGameApiStateToCheckersState = function (gameApiState) {
  var key,
    index,
    checkersState = [];
  for (key in gameApiState) {
    if (gameApiState.hasOwnProperty(key)) {
      index = key.substr(1);
      checkersState[index] = gameApiState[key];
    }
  }

  return checkersState;
};

/**
 * A function that takes a checkers state as in array format and convert it in
 * to a game API format.
 * @param checkersState the game state in array format.
 * @returns gameApiState the game state in game API format.
 */
var convertCheckersStateToGameApiState = function (checkersState) {
  var i,
    gameApiState = {};
  for (i = 0; i < checkersState.length; i += 1) {
    gameApiState['S' + i] = checkersState[i];
  }

  return gameApiState;
};

/**
 * Takes the game API state, the player's move, turn index and return a
 * calculated new game API state after the move is made.
 *
 * @param gameApiState the game state in game API format.
 * @param move array which contains the piece's original position and new
 *  target position.
 * @param turnIndex the current player's index.
 */
var getNextState = function (gameApiState, move, turnIndex) {
  var nextState = clone(gameApiState),
    hasWhite = false,
    hasBlack = false,
    index,
    set,
    key;
  for (index in move) {
    if (move.hasOwnProperty(index) && move[index].hasOwnProperty('set')) {
      set = move[index].set;
      for (key in set) {
        if (set.hasOwnProperty(key)) {
          nextState['S' + key.substr(1)] = set[key];
        }
      }
    }
  }

  // Check if the game ends
  for (index in nextState) {
    if (nextState.hasOwnProperty(index)) {
      if (nextState[index].substr(0, 1) === 'W') {
        hasWhite = true;
      } else if (nextState[index].substr(0, 1) === 'B') {
        hasBlack = true;
      }
    }
  }

  if (hasWhite && !hasBlack) {
    // White won
    return {nextState: nextState, endMatchScore: [1, 0]};
  }

  if (!hasWhite && hasBlack) {
    // Black won
    return {nextState: nextState, endMatchScore: [0, 1]};
  }

  // No winner
  return {nextState: nextState};
};

/**
 * Retrieve the detail information from the game API move. Which includes the
 * moving path array, the operated piece's index, the next turn index and the
 * winner if it has one.
 *
 * @param gameApiMove the game API move
 * @returns {{
 *    checkersMove: Array,
 *    pieceIndex: number,
 *    setTurnIndex: number,
 *    winner: string
 *  }}
 */
var retrieveGameApiMoveDetail = function (gameApiMove) {
  var gameApiMoveDetail = {
      checkersMove: [],
      pieceIndex: -1,
      setTurnIndex: -1,
      winner: ' '
    },
    setOperations = [],
    index,
    set,
    key;

  for (index in gameApiMove) {
    if (gameApiMove.hasOwnProperty(index)) {
      if (gameApiMove[index].hasOwnProperty('setTurn')) {
        gameApiMoveDetail.setTurnIndex = gameApiMove[index].setTurn;
      } else if (gameApiMove[index].hasOwnProperty('set')) {
        set = gameApiMove[index];
        for (key in set) {
          if (set.hasOwnProperty(key)) {
            setOperations.push([key, set[key]]);
          }
        }
      } else if (gameApiMove[index].hasOwnProperty('endMatch')) {
        if (gameApiMove[index].endMatch.endMatchScores[0] === 0) {
          gameApiMoveDetail.winner = 'B';
        } else {
          gameApiMoveDetail.winner = 'W';
        }
      }
    }
  }

  for (key in setOperations[0][1]) {
    if (setOperations[0][1].hasOwnProperty(key)) {
      gameApiMoveDetail.pieceIndex = parseInt(key.substr(1), 10);
    }
  }

  if (setOperations.length === 2) {
    for (key in setOperations[1][1]) {
      if (setOperations[1][1].hasOwnProperty(key)) {
        gameApiMoveDetail.checkersMove.push(parseInt(key.substr(1), 10));
      }
    }
  } else {
    for (key in setOperations[1][1]) {
      if (setOperations[1][1].hasOwnProperty(key)) {
        gameApiMoveDetail.checkersMove.push(parseInt(key.substr(1), 10));
      }
    }

    for (key in setOperations[2][1]) {
      if (setOperations[2][1].hasOwnProperty(key)) {
        gameApiMoveDetail.checkersMove.push(parseInt(key.substr(1), 10));
      }
    }
  }

  return gameApiMoveDetail;
};

/**
 * Check if the jump move path is possible by checking if it exists in the
 * possible moves array.
 *
 * @param possibleMoves an array contains all possible moves
 * @param checkerMove the move need to be checked
 * @returns {boolean}
 */
var containJumpMove = function (possibleMoves, checkerMove) {
  var index;
  for (index in possibleMoves) {
    if (possibleMoves[index][0] === checkerMove[0]
        && possibleMoves[index][1] === checkerMove[1]) {
      return true;
    }
  }
  return false;
};

/**
 * Check if hte index is legal
 * @param index the index need to be check
 * @returns {boolean} true if legal, otherwise false
 */
var isLegalIndex = function (index) {
  return index >= 0 && index < CONSTANT.get('ROW') * CONSTANT.get('COLUMN')
      && index % 1 === 0;
};

/**
 * Check if the move is OK.
 *
 * @param match
 * @returns {boolean}
 */
var isMoveOk = function (match) {
  var gameApiStateBeforeMove = match.stateBeforeMove,
//    gameApiStateAfterMove = match.stateAfterMove,
    turnIndexBeforeMove = match.turnIndexBeforeMove,
    turnIndexAfterMove = match.turnIndexAfterMove,
    move = match.move,
    checkersStateBeforeMove =
      convertGameApiStateToCheckersState(gameApiStateBeforeMove),
    nextStateObj =
        getNextState(gameApiStateBeforeMove, move, turnIndexBeforeMove),
    nextGameApiState = nextStateObj.nextState,
    nextCheckersState = convertGameApiStateToCheckersState(nextGameApiState),
    gameApiMoveDetail = retrieveGameApiMoveDetail(move),
    checkersMove = gameApiMoveDetail.checkersMove,
    pieceIndex = gameApiMoveDetail.pieceIndex,
//    setTurnIndex = gameApiMoveDetail.setTurnIndex,
    winner = gameApiMoveDetail.winner,
    isSimpleMove = true,
    possibleMoves = [],
    index,
    i;

  // Check if the moves are legal
  if (!isLegalIndex(pieceIndex)) {
    return {email: 'x@x.x', emailSubject: 'hacker!',
      emailBody: 'Illegal index'};
  }
  for (i = 0; i < checkersMove.length; i += 1) {
    if (!isLegalIndex(checkersMove[i])) {
      return {email: 'x@x.x', emailSubject: 'hacker!',
        emailBody: 'Illegal index'};
    }
  }

  // Check if the move is legal
  if (checkersMove.length === 1) {
    // Simple move
    possibleMoves = [];

    // Check if there any mandatory jumps
    for (index in checkersStateBeforeMove) {
      if ((checkersStateBeforeMove[index].substr(0, 1) === 'W'
          && turnIndexBeforeMove === 0)
          || (checkersStateBeforeMove[index].substr(0, 1) === 'B'
              && turnIndexBeforeMove === 1)) {
        if (getJumpMoves(checkersStateBeforeMove, parseInt(index, 10),
            turnIndexBeforeMove).length !== 0) {
          return {email: 'x@x.x', emailSubject: 'hacker!',
            emailBody: 'Illegal ignore mandatory jump!!!'};
        }
      }
    }

    possibleMoves = getSimpleMoves(checkersStateBeforeMove, pieceIndex,
        turnIndexBeforeMove);

    if (possibleMoves.indexOf(checkersMove[0]) === -1) {
      return {email: 'x@x.x', emailSubject: 'hacker!',
        emailBody: 'Illegal simple moves!!!'};
    }
  } else if (checkersMove.length === 2) {
    // Jump move

    possibleMoves =
        getJumpMoves(checkersStateBeforeMove, pieceIndex, turnIndexBeforeMove);
    if (!containJumpMove(possibleMoves, checkersMove, turnIndexBeforeMove)) {
      return {email: 'x@x.x', emailSubject: 'hacker!',
        emailBody: 'Illegal jumps!!!'};
    }

    isSimpleMove = false;
  } else {
    return {email: 'x@x.x', emailSubject: 'hacker!',
      emailBody: 'Illegal moves!!!'};
  }

  if (!isSimpleMove) {
    // Check if the set turn index is legal
    // For the same piece, check if it can do more jump moves
    if (getJumpMoves(nextCheckersState, checkersMove[1],
        turnIndexBeforeMove).length > 0) {
      // If the same piece can do more jumps, then the turnIndex remains.
      if (turnIndexAfterMove !== turnIndexBeforeMove) {
        return {email: 'x@x.x', emailSubject: 'hacker!',
          emailBody: 'Illegal setTurn'};
      }
    } else {
      // It the same piece can't do more jumps, then the turnIndex will change.
      if (turnIndexAfterMove === turnIndexBeforeMove) {
        return {email: 'x@x.x', emailSubject: 'hacker!',
          emailBody: 'Illegal setTurn!'};
      }
    }
  }

  // Check if the game ends
  if (winner === 'B') {
    if (!(nextStateObj.hasOwnProperty('endMatchScore')
        && nextStateObj.endMatchScore[0] === 0)) {
      return {email: 'x@x.x', emailSubject: 'hacker!',
        emailBody: 'Illegal winner'};
    }
  }

  if (winner === 'W') {
    if (!(nextStateObj.hasOwnProperty('endMatchScore')
        && nextStateObj.endMatchScore[1] === 0)) {
      return {email: 'x@x.x', emailSubject: 'hacker!',
        emailBody: 'Illegal winner'};
    }
  }

  return true;
};

/**
 * Get the initial moves (operations).
 *
 * @returns {Array}
 */
var getInitialMove = function () {
  var operations = [],
    i,
    set;

  operations.push({setTurn: 0});

  for (i = 0; i < (CONSTANT.get('ROW') - 2)
      / 2 * CONSTANT.get('COLUMN');
      i += 1) {
    set = {};
    set['S' + i] = 'BMAN';
    operations.push({set: set});
  }

  for (i = (CONSTANT.get('ROW') / 2 - 1) * CONSTANT.get('COLUMN');
       i < (CONSTANT.get('ROW') / 2 + 1) * CONSTANT.get('COLUMN'); i += 1) {
    set = {};
    set['S' + i] = 'EMPTY';
    operations.push({set: set});
  }

  for (i = (CONSTANT.get('ROW') / 2 + 1) * CONSTANT.get('COLUMN');
       i < CONSTANT.get('ROW') * CONSTANT.get('COLUMN'); i += 1) {
    set = {};
    set['S' + i] = 'WMAN';
    operations.push({set: set});
  }

  return operations;
};

/**
 * Checkers logic service.
 */
checkers.factory('checkersLogicService', function () {
  return {
    isMoveOk: isMoveOk,
    getNextState: getNextState,
    CONSTANT: CONSTANT
  };
});