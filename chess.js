// Matrix - 8 x 8
let chess_pieces = document.querySelectorAll('.chess-piece');

for (let i = 0; i < 64; i++) {
    chess_pieces[i].addEventListener("click", () => {
        move(chess_pieces[i], i);
    });
}


// let chess_board;

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

let selected_index = null;

function move(el, i) {
    if (selected_index !== null && i !== selected_index) {
        chess_pieces[selected_index].classList.remove('chess-piece-selected');
    }
    let piece_val = pieces.get(el.innerHTML);
    if (piece_val !== undefined) {
        el.classList.add('chess-piece-selected');
        selected_index = i;
    }
}