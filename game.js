var game = (function(){

    var game = {};  
    game.init = init;

    var tiles = undefined;
    var resetBtn = undefined;

    var state = [0,0,0,0,0,0,0,0,0];

    var HUMAN = 1;
    var COMPUTER=2;
    var currentPlayer = HUMAN;

    var winCondition = [
        [0,1,2],
        [3,4,5],
        [6,7,8],

        [0,3,6],
        [1,4,7],
        [2,5,8],

        [0,4,8],
        [2,4,6]
    ];

    function init(){
        console.log("init game");

        resetBtn = document.getElementById("resetBtn");
        resetBtn.addEventListener("click", reset);

        playBtn = document.getElementById("playBtn");
        playBtn.addEventListener("click", computerPlay);

        tiles = document.getElementsByClassName("tile");
        reset();
    }

    function reset(){
        counter = 0;
        currentPlayer=HUMAN;

        for (var i = 0; i < 9; i++) {
            tiles[i].style.background = "#ffffff";
            tiles[i].addEventListener("click", tileClick);
            
            state[i] = 0;
        }
    }
    
    function tileClick(e){
        var tile = e.target;

        for (var i = 0; i < tiles.length; i++) {
            if(tiles[i] == e.target && state[i] == 0 && currentPlayer==HUMAN){
                changeState(i, currentPlayer);
            }
        }
    }

    function changeState(playPosition, player){
        state[playPosition] = player;

        if(player==HUMAN){
            tiles[playPosition].style.background = "#66f";
            currentPlayer = COMPUTER;
        }else{
            tiles[playPosition].style.background = "#f66";
            currentPlayer = HUMAN;
        }
    }

    function checkWin(board, player){
        var win = true;

        for (var x = 0; x < 8; x++) {
            win = true;

            for (var y = 0; y < 3; y++) {
                if(board[winCondition[x][y]] != player){
                    win = false;
                    break;
                }
            }
            if (win) break;           
        }
        return win;
    }

    function checkFull(board){
        for (var i = 0; i < board.length; i++) {
            if (board[i] == 0)
                return false;
        }
        return true;
    }
    function checkEmpty(board){
        for (var i = 0; i < state.length; i++) {
            if(state[i]!=0)
            return false;
        }
        return true;
    }

    function computerPlay(){
        if(checkEmpty(state)){
            var random = Math.round(Math.random()*9);
            changeState(random, COMPUTER);
            return;
        }
        var minimax = miniMax(state, 0, -Infinity, Infinity, COMPUTER);
        changeState(minimax[1], COMPUTER);
    }

    function checkOver(board){
        if(checkWin(board, HUMAN))
            return true;
        else if(checkWin(board, COMPUTER))
            return true;
        else if(checkFull(board)){
            return true;
        }

        return false;
    }

    function getPossibleMoves(board){
        var moves = [];
        for (var i = 0; i < board.length; i++) {
            if(board[i]==0)
                moves.push(i);            
        }
        return moves;
    }

    function scoreBoard(board){
        if(checkWin(board, HUMAN))
            return -100;
        else if(checkWin(board, COMPUTER))
            return 100;
        else if(checkFull(board)){
            return 0;
        }else{
            return -1000;
        }
    }

    function miniMax(board, depth,alpha, beta, actualPlayer){
        var otherPlayer = actualPlayer == HUMAN ? COMPUTER : HUMAN;
        
        var bestMove = -1;

        if (checkOver(board)){
            bestScore = scoreBoard(board);
            return [bestScore, bestMove];
        }
        
        var validMoves = getPossibleMoves(board);
        for (var i = 0; i < validMoves.length; i++) {
            newBoard = board.slice();
            newBoard[validMoves[i]] = actualPlayer;
            var score = miniMax(newBoard, depth+1,alpha, beta, otherPlayer)[0];

            if(actualPlayer == COMPUTER){
                if (alpha < score) {
                    bestMove = validMoves[i];
                    alpha = score;
                }
                if(beta <= alpha)break;
            }else{ 
                if (beta > score) {
                    bestMove = validMoves[i];
                    beta = score;
                }
                if(beta <= alpha)break;
            }
        }
        var bestScore = actualPlayer == COMPUTER ? alpha : beta;
        return [bestScore, bestMove];
    }

    window.addEventListener("load", init);

    return game;
})();