// Matrix - 8 x 8
let chess_pieces = document.querySelectorAll('.chess-piece');

for (let i = 0; i < 64; i++) {
    chess_pieces[i].addEventListener("click", () => {
        move(chess_pieces[i], i);
    });
}


// let chess_board;

const TYPE = {
    WHITE: 'white',
    BLACK: 'black'
};

const pieces = new Map();
pieces.set('♔', 'wk');
pieces.set('♕', 'wq');
pieces.set('♙', 'wp');
pieces.set('♗', 'wb'); // thedi chaal
pieces.set('♘', 'wn'); // dhai kadam
pieces.set('♖', 'wr'); // bahaut sidha
pieces.set('♚', 'bk');
pieces.set('♛', 'bq');
pieces.set('♟', 'bp');
pieces.set('♝', 'bb'); // thedi chaal
pieces.set('♞', 'bn'); // dhai kadam
pieces.set('♜', 'br'); // bahaut sidha
pieces.set('', 'empty');


(function init_board() {
    chess_pieces[0].innerHTML = chess_pieces[7].innerHTML = '♜';
    chess_pieces[1].innerHTML = chess_pieces[6].innerHTML = '♞';
    chess_pieces[2].innerHTML = chess_pieces[5].innerHTML = '♝';
    chess_pieces[3].innerHTML = '♛';
    chess_pieces[4].innerHTML = '♚';

    for (let i = 8; i < 16; i++) {
        chess_pieces[i].innerHTML = '♟'
    }

    chess_pieces[56].innerHTML = chess_pieces[63].innerHTML = '♖';
    chess_pieces[57].innerHTML = chess_pieces[62].innerHTML = '♘';
    chess_pieces[58].innerHTML = chess_pieces[61].innerHTML = '♗';
    chess_pieces[59].innerHTML = '♕';
    chess_pieces[60].innerHTML = '♔';

    for (let i = 48; i < 56; i++) {
        chess_pieces[i].innerHTML = '♙'
    }

})();

let selected_index = -1;
let possibleMoves = [];
let turn = TYPE.WHITE;
let castle = {
    black: 0,
    white: 0
};

// Possible scenarios
// 1. When no other pieces is selected.
// 2. When a piece is selected, and its possible moves are highlighted.
//    a. someone tries to select other type piece they shouldn't.
//    b. they try to select one of the possible moves.
//    c. they try to select any other thing, their own piece or a blank piece.

function move(el, i) {
    let piece_val = pieces.get(el.innerHTML);
    if (piece_val === 'empty') {
        // third case is possible move

        console.log([i, possibleMoves])
        if (possibleMoves.includes(i)) {
            turn = turn === TYPE.WHITE ? TYPE.BLACK : TYPE.WHITE;
            let new_piece = chess_pieces[selected_index].innerHTML;
            chess_pieces[selected_index].innerHTML = null;
            el.innerHTML = new_piece;
            chess_pieces[selected_index].classList.remove('chess-piece-selected');

        } else {
            if (selected_index !== null && i !== selected_index) {
                chess_pieces[selected_index].classList.remove('chess-piece-selected');
            }
        }

        for (let j = 0; j < possibleMoves.length; j++) {
            if (j !== -1) {
                chess_pieces[possibleMoves[j]].classList.remove('chess-piece-possible-moves');
                chess_pieces[possibleMoves[j]].classList.remove('chess-piece-in-danger');
            }
        }

        possibleMoves = []

    }
    else {
        if (piece_val.match('^w.$') && turn === TYPE.WHITE || piece_val.match('^b.$') && turn === TYPE.BLACK) {
            if (selected_index !== -1 && selected_index !== i) {
                chess_pieces[selected_index].classList.remove('chess-piece-selected');
            }
            for (let j = 0; j < possibleMoves.length; j++) {
                if (j !== -1) {
                    chess_pieces[possibleMoves[j]].classList.remove('chess-piece-possible-moves');
                    chess_pieces[possibleMoves[j]].classList.remove('chess-piece-in-danger');
                }
            }
            possibleMoves = []
            el.classList.add('chess-piece-selected');
            selected_index = i;
            switch (piece_val) {
                case 'wp':
                    pawn(el, i, TYPE.WHITE);
                    break;
                case 'bp':
                    pawn(el, i, TYPE.BLACK);
                    break;
                case 'wk':
                case 'bk':
                    king(el, i);
                    break;
                case 'wq':
                case 'bq':
                    queen(el, i);
                    break;
                case 'wn':
                case 'bn':
                    knight(el, i);
                    break;
                case 'wb':
                case 'bb':
                    bishop(el, i);
                    break;
                case 'wr':
                case 'br':
                    rook(el, i);
                    break;
            }
        }
    }

}

function highlight_possible_moves() {
    // console.log(possibleMoves)
    // console.log(selected_index)
    for (let k = 0; k < (possibleMoves.includes(-1) ? possibleMoves.indexOf(-1) : possibleMoves.length); k++) {
        chess_pieces[possibleMoves[k]].classList.add('chess-piece-possible-moves');
    }
    if (possibleMoves.includes(-1)) {
        for (let l = possibleMoves.indexOf(-1) + 1; l < possibleMoves.length; l++) {
            chess_pieces[possibleMoves[l]].classList.add('chess-piece-in-danger');
        }
    }

}

function pawn(el, i, type) {
    if (type === TYPE.WHITE) {
        // check for 2 moves or 1 move // [8 -> 16, 24 -> 17], [16, 24, -1, 17]
        if (i >= 48 && i < 56) {
            possibleMoves = [i - 8, i - 16];
        }
        else if (i > 7) {
            possibleMoves = [i - 8];
        }
        // possible hits
        if (i % 8 === 0) {
            if (pieces.get(chess_pieces[i - 7].innerHTML).match('^b.$')) {
                possibleMoves.push([-1, i - 7]);
            }
        }
        else if ((i + 1) % 8 === 0) {
            if (pieces.get(chess_pieces[i - 9].innerHTML).match('^b.$')) {
                possibleMoves.push([-1, i - 9]);
            }
        }
        else {
            if (pieces.get(chess_pieces[i - 7].innerHTML).match('^b.$')) {
                possibleMoves.push([-1, i - 7]);
            }
            if (pieces.get(chess_pieces[i - 9].innerHTML).match('^b.$')) {
                if (possibleMoves.includes(-1)) {
                    possibleMoves.push([i - 9]);
                }
                else {
                    possibleMoves.push([-1, i - 9]);
                }
            }
        }

    } else {
        if (i >= 8 && i < 16) {
            possibleMoves = [i + 8, i + 16];
        }
        else if (i > 7) {
            possibleMoves = [i + 8];
        }
        // possible hits
        if (i % 8 === 0) {
            if (pieces.get(chess_pieces[i + 7].innerHTML).match('^b.$')) {
                possibleMoves.push([-1, i + 7]);
            }
        }
        else if ((i + 1) % 8 === 0) {
            if (pieces.get(chess_pieces[i + 9].innerHTML).match('^b.$')) {
                possibleMoves.push([-1, i + 9]);
            }
        }
        else {
            if (pieces.get(chess_pieces[i + 7].innerHTML).match('^b.$')) {
                possibleMoves.push([-1, i + 7]);
            }
            if (pieces.get(chess_pieces[i + 9].innerHTML).match('^b.$')) {
                if (possibleMoves.includes(-1)) {
                    possibleMoves.push([i + 9]);
                }
                else {
                    possibleMoves.push([-1, i + 9]);
                }
            }
        }
    }

    highlight_possible_moves();
}

function king(el, i) {}

function queen(el, i) {}

function bishop(el, i) {}

function rook(el, i) {}


// no obstruction
function knight(el, i) {}
