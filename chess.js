// Matrix - 8 x 8
let chessPieces = document.querySelectorAll('.chess-piece');

chessPieces.forEach((piece, i) => {
    piece.addEventListener("click", () => move(piece, i));
});
for (let i = 0; i < 64; i++) {
    chessPieces[i].addEventListener("click", () => {
        move(chessPieces[i], i);
    });
}

const pieces = ['whiteKing', 'whiteQueen', 'whiteRook', 'whiteBishop', 'whiteKnight', 'whitePawn',
    'blackKing', 'blackQueen', 'blackRook', 'blackBishop', 'blackKnight', 'blackPawn'];

const TYPE = {
    WHITE: 'white',
    BLACK: 'black'
};

(function init_board() {
    chessPieces[56].setAttribute('id', 'blackRook');
    chessPieces[63].setAttribute('id', 'blackRook');
    chessPieces[57].setAttribute('id', 'blackKnight');
    chessPieces[62].setAttribute('id', 'blackKnight');
    chessPieces[58].setAttribute('id', 'blackBishop');
    chessPieces[61].setAttribute('id', 'blackBishop');
    chessPieces[59].setAttribute('id', 'blackQueen');
    chessPieces[60].setAttribute('id', 'blackKing');

    for (let i = 48; i < 56; i++) {
        chessPieces[i].setAttribute('id', 'blackPawn');
    }

    chessPieces[0].setAttribute('id', 'whiteRook');
    chessPieces[7].setAttribute('id', 'whiteRook');
    chessPieces[1].setAttribute('id', 'whiteKnight');
    chessPieces[6].setAttribute('id', 'whiteKnight');
    chessPieces[5].setAttribute('id', 'whiteBishop');
    chessPieces[2].setAttribute('id', 'whiteBishop');
    chessPieces[3].setAttribute('id', 'whiteQueen');
    chessPieces[4].setAttribute('id', 'whiteKing');

    for (let i = 8; i < 16; i++) {
        chessPieces[i].setAttribute('id', 'whitePawn');
    }

})();

let selected_index = -1;
let possibleMoves = [];
let possibleHits = [];
let turn = TYPE.WHITE;
let castle = {
    black: {
        left: 0,
        right: 0
    },
    white: {
        left: 0,
        right: 0
    }
};

function checkTurn(el) {
    return (el.id.match('^white.*') && turn === TYPE.WHITE || el.id.match('^black.*') && turn === TYPE.BLACK);
}

const checkPossibleMove = (index) => {
    if (index >= 0 && index < 64) {
        if (chessPieces[index].id === '') possibleMoves.push(index);
        else if (!checkTurn(chessPieces[index])) possibleHits.push(index);
    }
};

// Possible scenarios
// 1. When no other pieces is selected.
// 2. When a piece is selected, and its possible moves are highlighted.
//    a. someone tries to select other type piece they shouldn't.
//    b. they try to select one of the possible moves.
//    c. they try to select any other thing, their own piece or a blank piece.

function move(el, i) {
    // console.log(el, i, possibleMoves, possibleHits, selected_index);
    let pieceVal = el.id;
    if (possibleMoves.includes(i) || possibleHits.includes(i)) {
        turn = turn === TYPE.WHITE ? TYPE.BLACK : TYPE.WHITE;
        let new_piece = chessPieces[selected_index].id;
        chessPieces[selected_index].removeAttribute('id');
        el.setAttribute('id', new_piece);
        freePossibleHighlights()
    } else {
        if (i === selected_index) {
            el.classList.remove('chess-piece-selected');
            freePossibleHighlights();
        } else if (pieceVal === '') {
            freePossibleHighlights()
        } else if (pieceVal.match('^white.*') && turn === TYPE.WHITE || pieceVal.match('^black.*') && turn === TYPE.BLACK) {
            freePossibleHighlights();
            el.classList.add('chess-piece-selected');
            selected_index = i;
            switch (pieceVal) {
                case 'whitePawn':
                case 'blackPawn':
                    pawn(i);
                    break;
                case 'whiteKing':
                case 'blackKing':
                    king(i);
                    break;
                case 'whiteQueen':
                case 'blackQueen':
                    rook(i);
                    bishop(i);
                    break;
                case 'whiteKnight':
                case 'blackKnight':
                    knight(i);
                    break;
                case 'whiteBishop':
                case 'blackBishop':
                    bishop(i);
                    break;
                case 'whiteRook':
                case 'blackRook':
                    rook(i);
                    break;
            }
        }
    }
}

function highlight_possible_moves() {
    for (let k of possibleMoves)
        chessPieces[k].classList.add('chess-piece-possible-moves');
    for (let k of possibleHits)
        chessPieces[k].classList.add('chess-piece-in-danger');
}

function freePossibleHighlights() {
    if (selected_index !== -1) {
        chessPieces[selected_index].classList.remove('chess-piece-selected');
        selected_index = -1;
    }
    for (let cell of possibleMoves)
        chessPieces[cell].classList.remove('chess-piece-possible-moves');
    for (let cell of possibleHits)
        chessPieces[cell].classList.remove('chess-piece-in-danger');
    possibleMoves.splice(0, possibleMoves.length);
    possibleHits.splice(0, possibleHits.length);
}

function pawn(i) {
    if (turn === TYPE.BLACK) {
        // check for 2 moves or 1 move // [8 -> 16, 24 -> 17], [16, 24, -1, 17]
        if (i < 8) return;
        if (i >= 48 && i < 56) {
            possibleMoves.push(i - 8, i - 16);
            if (pieces.includes(chessPieces[i - 16].id)) possibleMoves.pop();
        } else if (i > 7) possibleMoves.push(i - 8);
        // If something is obstructing the pawn
        if (pieces.includes(chessPieces[i - 8].id)) possibleMoves.splice(0, possibleMoves.length);
        // possible hits
        if (i % 8 === 0) {
            if (chessPieces[i - 7].id.match('^white.*')) possibleHits.push(i - 7);
        } else if ((i + 1) % 8 === 0) {
            if (chessPieces[i - 9].id.match('^white.*')) possibleHits.push(i - 9);
        } else {
            if (chessPieces[i - 7].id.match('^white.*')) possibleHits.push(i - 7);
            if (chessPieces[i - 9].id.match('^white.*')) possibleHits.push(i - 9);
        }

    } else {
        if (i >= 56) return;
        if (i >= 8 && i < 16) {
            possibleMoves.push(i + 8, i + 16);
            if (pieces.includes(chessPieces[i + 16].id)) possibleMoves.pop();
        } else if (i < 56) possibleMoves.push(i + 8);
        // for pawn obstruction
        if (pieces.includes(chessPieces[i + 8].id)) possibleMoves.splice(0, possibleMoves.length);
        // possible hits
        if (i % 8 === 0) {
            if (chessPieces[i + 9].id.match('^black.*')) possibleHits.push(i + 9);
        } else if ((i + 1) % 8 === 0) {
            if (chessPieces[i + 7].id.match('^black.*')) possibleHits.push(i + 7);
        } else {
            if (chessPieces[i + 7].id.match('^black.*')) possibleHits.push(i + 7);
            if (chessPieces[i + 9].id.match('^black.*')) possibleHits.push(i + 9);
        }
    }
    highlight_possible_moves();
}

function king(i) {
    if (i % 8 !== 0) checkPossibleMove(i - 1);
    if (i % 8 !== 0 && i >= 8) checkPossibleMove(i - 9);
    if (i % 8 !== 0 && i < 56) checkPossibleMove(i + 7);
    if ((i + 1) % 8 !== 0) checkPossibleMove(i + 1);
    if ((i + 1) % 8 !== 0 && i >= 8) checkPossibleMove(i - 7);
    if ((i + 1) % 8 !== 0 && i < 56) checkPossibleMove(i + 9);
    if (i < 56) checkPossibleMove(i + 8);
    if (i >= 8) checkPossibleMove(i - 8);

    highlight_possible_moves()
}

function bishop(i) {
    const edgeCase = (a, b) => ((a % 8 === 0 && (b + 1) % 8 === 0) || (b % 8 === 0 && (a + 1) % 8 === 0));
    let pos;
    for (pos = i + 9; pos < 64 && !edgeCase(pos - 9, pos); pos += 9) {
        if (chessPieces[pos].id === '') possibleMoves.push(pos);
        else {
            if (!checkTurn(chessPieces[pos])) possibleHits.push(pos);
            break;
        }
    }

    for (pos = i - 9; pos >= 0 && !edgeCase(pos + 9, pos); pos -= 9) {
        if (chessPieces[pos].id === '') possibleMoves.push(pos);
        else {
            if (!checkTurn(chessPieces[pos])) possibleHits.push(pos);
            break;
        }
    }

    for (pos = i + 7; pos < 64 && !edgeCase(pos - 7, pos); pos += 7) {
        if (chessPieces[pos].id === '') possibleMoves.push(pos);
        else {
            if (!checkTurn(chessPieces[pos])) possibleHits.push(pos);
            break;
        }
    }

    for (pos = i - 7; pos >= 0 && !edgeCase(pos + 7, pos); pos -= 7) {
        if (chessPieces[pos].id === '') possibleMoves.push(pos);
        else {
            if (!checkTurn(chessPieces[pos])) possibleHits.push(pos);
            break;
        }
    }
    highlight_possible_moves();
}

function rook(i) { // 32
    let pos;
    for (pos = i + 8; pos < 64; pos += 8) {
        if (chessPieces[pos].id === '') possibleMoves.push(pos);
        else {
            if (!checkTurn(chessPieces[pos])) possibleHits.push(pos);
            break;
        }
    }

    for (pos = i - 8; pos >= 0; pos -= 8) {
        if (chessPieces[pos].id === '') possibleMoves.push(pos);
        else {
            if (!checkTurn(chessPieces[pos])) possibleHits.push(pos);
            break;
        }
    }

    for (pos = i + 1; pos < Math.ceil((i + 1) / 8) * 8; pos++) {
        if (chessPieces[pos].id === '') possibleMoves.push(pos);
        else {
            if (!checkTurn(chessPieces[pos])) possibleHits.push(pos);
            break;
        }
    }

    for (pos = i - 1; pos >= Math.floor(i / 8) * 8; pos--) {
        if (chessPieces[pos].id === '') possibleMoves.push(pos);
        else {
            if (!checkTurn(chessPieces[pos])) possibleHits.push(pos);
            break;
        }
    }

    highlight_possible_moves();
}


// no obstruction
function knight(i) {
    // moving left
    if (!(i % 8 === 0 || (i - 1) % 8 === 0)) {
        if (i - 10 >= 8) checkPossibleMove(i - 10);
        if (i + 6 < 62) checkPossibleMove(i + 6);
    }
    // moving right
    if (!((i + 1) % 8 === 0 || (i + 2) % 8 === 0)) {
        if (i - 6 > 1) checkPossibleMove(i - 6);
        if (i + 10 < 64) checkPossibleMove(i + 10);
    }
    // moving up
    if (i < 48) {
        if (i % 8 !== 0) checkPossibleMove(i + 15);
        if ((i + 1) % 8 !== 0) checkPossibleMove(i + 17);
    }
    // moving down
    if (i >= 16) {
        if (i % 8 !== 0) checkPossibleMove(i - 17);
        if ((i + 1) % 8 !== 0) checkPossibleMove(i - 15);
    }

    highlight_possible_moves();
}
