console.log("pepe");

function Gameboard () {

    const rows = 3;
    const columns = 3;
    const board = []

    //Crear el tablero al inicializar el objeto. Cada celda será otro objeto Cell
    for (let i = 0; i < rows; i++) {

        board[i] = [];

        for (let j = 0; j < columns; j++) {

            //Forma alternativa de crear la matriz
            //board[i][j] = '';

            board[i].push(Cell());

        }

    }

    //Boceto del tablero
    //[ [{}, {}. {}], [{}, {}, {}], [{}, {}, {}] ]

    //Definicion de los metodos del tablero


    //Se encarga de comprobar que la fila y columna selecionada no estén ocupadas y si no lo están ubica la ficha del jugador en esa celda.

    const dropToken = (row, column, playerToken) => {
        // Si las coordenadas están fuera del rango del tablero
        if (row < 0 || row >= board.length || column < 0 || column >= board[0].length) {
            console.log("Coordenadas fuera del tablero");
            return false;
        }
        
        // Acceder directamente a la celda usando los índices
        const targetCell = board[row][column];
        
        // Verificar si la celda está ocupada
        if (targetCell.getValue() !== '') {
            console.log("La celda seleccionada está ocupada");
            return false;
        } else {
            console.log("La celda no está ocupada");
            targetCell.setValue(playerToken);
            return true;
        }
    }

    //Devuelve el array tablero almacenado en la variable board
    const getBoard = () => board;

    //Muestra por consola el estado del juego actualmente
    const printBoard = () => {

        let output = '';
 
        board.forEach( 
            (itemRow) => itemRow.forEach(
            (itemColumn, indexItemColumn) => {

                output += '|' + itemColumn.getValue() + '| ';

                if ((indexItemColumn + 1) % 3 === 0) {output += ' \n '};

            })
        
        )

        return output

    }


    return {getBoard, dropToken, printBoard};

}


function Cell() {

    //Propiedad no accesible, es privada ya que solo se accede a ella a través de los métodos get y set.
    let value = '';


    const setValue = (playerToken) => value = playerToken;

    const getValue = () => value;


    return {getValue, setValue}

}

//Implementar si es que mejora el rendimiento en el futuro
// function Player(name, token) {

//     const player = {
//         name,
//         token
//     }


//     const getName = () => name;

//     const getToken = () => token;

//     return player

// }



function GameController() {

    const board = Gameboard();

    const playerOne = {

        name: "Pepe",
        token: 'X'

    };

    const playerTwo =  {
        name: "Fulanito",
        token: 'O'
    }

    //Definición de métodos del controlador

    //Este método se encarga de determinar si el jugador que puso una ficha ganó el juego o no.
    const checkWinner = (player) => {

        let res;

        const token = player.token;

        const boardGame =  board.getBoard();

        const winnerCombination = [`${token}`, `${token}`, `${token}`];

        //Compruebo si las filas existentes coinciden con la combinación ganadora, es decir ['X', 'X', 'X']
        const arrayWithRowValues = boardGame.map( (row) => row.map( (column) => column.getValue() ) );

        console.log(arrayWithRowValues);

        //Se comprueba si cada una de las filas del tablero es igual a ['X', 'X', 'X']
        res = arrayWithRowValues.find( (combination) => combination.every( ( item, index) => item === winnerCombination[index])); 

        if (res) {
            console.log("Se encontró un ganador");
            return true
        }
    
        //Comprobar si las columnas existentes coinciden con la combinación ganadora, es decir ['X', 'X', 'X']

        const COLUMNS = 3;

        for (let j = 0; j < COLUMNS; j++) {


            //En este condicional se controla si hubo un ganador en las columnas
            if (
                (boardGame[0][j].getValue() === token) &&
                (boardGame[1][j].getValue() === token) &&
                (boardGame[2][j].getValue() === token)
            )
            {
                console.log("Se encontró un ganador");
                return true;
            }
        }

        //En este condicional se controla si hubo un ganador en la diagonal principal
        if (
            (boardGame[0][0].getValue() === token) &&
            (boardGame[1][1].getValue() === token) &&
            (boardGame[2][2].getValue() === token)
        ) {
            console.log("Se encontró un ganador");
            return true;
        }

        //Se controla si en la diagonal inversa hay un ganador
        if (

            (boardGame[0][2].getValue() === token) &&
            (boardGame[1][1].getValue() === token) &&
            (boardGame[2][0].getValue() === token)

        ){
            console.log("Se encontró un ganador");
            return true;
        }


        //Controlar si se produjo un empate entre los jugadores
        let isFull = true;
        const ROWS = 3;

        for (let i = 0; i < ROWS; i++) {

            for (let j = 0; j < COLUMNS; j++) {

                if (boardGame[i][j].getValue() === '') {
                    isFull = false;
                    return false
                }

            }


        }

        if (isFull) {
            console.log("Empate");
            return null;
        }
        console.log("No se encontró un ganador");        
        return false

    }

    //Este método se encarga de tomar la fila y columna deseada por el jugador y colocar la ficha en una posición válida
    const playRound = (player) => {

        const token = player.token;

        //dropToken = (row, column, playerToken) 

        let choice;

        do {
            
            let row = parseInt(prompt("Ingrese la fila que desea: "));
            let column = parseInt(prompt("Ingrese la columna que desea: "));

            choice = board.dropToken(row, column, token);

        } while (!choice);

    }

    const switchActivePlayer = (activePlayer, playerOne, playerTwo) => {

        if (activePlayer === playerOne) {
            return playerTwo;
        }
        else{
            return playerOne
        }

    }

    const playGame = (playerOne, playerTwo) => {

        let winner;

        let activePlayer = playerOne;

        do {
            playRound(activePlayer);
            console.log(board.printBoard());
            winner = checkWinner(activePlayer);

            if (winner === null) {
                return winner;
            }
            else if (!winner) {
                activePlayer = switchActivePlayer(activePlayer, playerOne, playerTwo);
            }
        } while (!winner);

        return activePlayer;

    }

    let res = playGame(playerOne, playerTwo);

    if (res !== null) {
        console.log("El ganador fue: " + res.name);
    }
    else{
        console.log("Se produjo un empate");
    }

}

const controller = GameController();