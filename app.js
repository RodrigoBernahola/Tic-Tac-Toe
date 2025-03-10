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

    const dropToken = (row, column, playerToken)  => {

        let res;

        board.forEach(
             (itemRow, indexItemRow) =>  itemRow.forEach( 
                (itemColumn, indexItemColumn) => {

                    if (indexItemRow === row && indexItemColumn === column) {
                        res = itemColumn.getValue()

                        //La celda está ocupada
                        if (res !== '') {
                            console.log("La celda seleccionada está ocupada");
                            return
                        }
                        else {
                            console.log("La celda no está ocupada");
                            itemColumn.setValue(playerToken)
                            return
                        }


                    }
                }
            )
        )


    }


    const getBoard = () => board;


    return {getBoard, dropToken};


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

        name: "pepe",
        token: 'X'

    };

    const playerTwo =  {
        name: "Fulanito",
        token: 'O'
    }

    board.dropToken(0, 0, playerOne.token);

    console.table(board.getBoard());

    board.dropToken(0, 0, playerTwo.token);

    console.table(board.getBoard());

}



const controller = GameController();


// console.table(board.getBoard());
// console.log(board.getBoard());