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


    //Se encarga de comprobar que la fila y columna selecionadas no estén ocupadas y si no lo están ubica la ficha del jugador en esa celda.

    const dropToken = (row, column, playerToken) => {
        // Si las coordenadas están fuera del rango del tablero
        if (row < 0 || row >= board.length || column < 0 || column >= board[0].length) {
            return false;
        }
        
        // Acceder directamente a la celda usando los índices
        const targetCell = board[row][column];
        
        // Verificar si la celda está ocupada
        if (targetCell.getValue() !== '') {
            return false;
        } else {
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

//Es la función a partir de la cual se crean los objetos celda que están dentro del array de tablero
function Cell() {

    //Propiedad no accesible, es privada ya que solo se accede a ella a través de los métodos get y set.
    let value = '';


    const setValue = (playerToken) => value = playerToken;

    const getValue = () => value;


    return {getValue, setValue}

}


//Se encarga de crear y devolver los objetos jugador
function Player(nameArg, tokenArg) {

    let name = nameArg;
    let token = tokenArg;


    const getName = () => name;

    const setName = (newName) => name = newName;

    const getToken = () => token;

    return {getName, setName, getToken}

}

//Esta función se encarga de crear el objeto controlador de toda la lógica relacionada al desarrollo del juego y determinar cuando termina el mismo
function GameController() {


    //Define el tablero a utilizar y los jugadores que van a participar, el jugador activo por defecto será el primero.

    const gameBoardController = Gameboard();

    const board = gameBoardController.getBoard();

    const playerOne = Player('Jugador 1', 'X');

    const playerTwo = Player('Jugador 2', 'O');

    let activePlayer = playerOne;


    //Definición de métodos del controlador


    //Devuelve el objeto que representa al tablero
    const getBoard = () => {
        return {board}
    };

    //Este método se encarga de determinar si el jugador que puso una ficha (el jugador activo actual) ganó el juego o no. Este método tiene acceso a la variable board que está definida localmente en el scope superior de GameController. Si en el método se devuelve true, se encontró un ganador. Si el método devuelve false, el método no encontró un ganador. Si el método devuelve null, se produjo en empate entre los jugadores.
    const checkWinner = (player) => {

        let res;

        const token = player.getToken();

        const winnerCombination = [`${token}`, `${token}`, `${token}`];

        //Compruebo si las filas existentes coinciden con la combinación ganadora, es decir ['X', 'X', 'X']
        const arrayWithRowValues = board.map( (row) => row.map( (column) => column.getValue() ) );

        //Se comprueba si cada una de las filas del tablero es igual a ['X', 'X', 'X']
        res = arrayWithRowValues.find( (combination) => combination.every( ( item, index) => item === winnerCombination[index])); 

        if (res) {
            return true
        }
    
        //Comprobar si las columnas existentes coinciden con la combinación ganadora, es decir ['X', 'X', 'X']

        const COLUMNS = 3;

        for (let j = 0; j < COLUMNS; j++) {

            //En este condicional se controla si hubo un ganador en las columnas
            if (
                (board[0][j].getValue() === token) &&
                (board[1][j].getValue() === token) &&
                (board[2][j].getValue() === token)
            )
            {
                return true;
            }
        }

        //En este condicional se controla si hubo un ganador en la diagonal principal
        if (
            (board[0][0].getValue() === token) &&
            (board[1][1].getValue() === token) &&
            (board[2][2].getValue() === token)
        ) {
            return true;
        }

        //Se controla si en la diagonal inversa hay un ganador
        if (

            (board[0][2].getValue() === token) &&
            (board[1][1].getValue() === token) &&
            (board[2][0].getValue() === token)

        ){
            return true;
        }


        //Controlar si se produjo un empate entre los jugadores
        let isFull = true;
        const ROWS = 3;

        for (let i = 0; i < ROWS; i++) {

            for (let j = 0; j < COLUMNS; j++) {

                if (board[i][j].getValue() === '') {
                    isFull = false;
                    return false
                }

            }

        }

        if (isFull) {
            return null;
        }

        return false
    }

    //Devuelve a los dos jugadores que participan
    const returnPlayers = () => {

        return {playerOne, playerTwo};

    }


    //Este método se encarga de tomar la fila y columna deseada por el jugador y colocar la ficha en una posición válida
    const playRound = (player, row, column) => {

        const token = player.getToken();

        gameBoardController.dropToken(row, column, token);

    }

    //El método comprueba quién es el jugador activo y devuelve el jugador opuesto para que participe en la próxima ronda.
    const switchActivePlayer = (activePlayer, playerOne, playerTwo) => {

        if (activePlayer === playerOne) {
            return playerTwo;
        }
        else{
            return playerOne
        }

    }

    
    //El método devuelve al jugador activo actual
    const getActivePlayer = () => {

        return {activePlayer};

    }

    return {checkWinner, playRound, switchActivePlayer, returnPlayers, getActivePlayer, getBoard}

}


//Esta función es la encargada de coordinar la lógica del juego (a través del objeto controlador) con la interfaz gráfica propuesta(a través de la manipulación del DOM).
function displayLogic () {

    //? buttonflag? winner?
    let buttonFlag = true;

    let winner;

    //Se definen una vez en variables locales a esta función los elementos y objetos que serán importantes tanto para la lógica como para la interacción con el DOM.
    const gameController = GameController();

    let {board: boardGame} = gameController.getBoard();

    let {playerOne, playerTwo} = gameController.returnPlayers();

    const divGameboard = document.querySelector('.scoreContainer');

    const buttonStart = document.querySelector('#startGame');

    const restartButton = document.querySelector('#restart');

    restartButton.disabled = true;

    let {activePlayer} = gameController.getActivePlayer();


    //Métodos del objeto displayLogic

    //Añadir la cantidad de puntos indicada por el parámetro point al elemento del DOM que indique el parámetro field
    const addPointToCounter = (field, point) => {

        let string;
        let flag;

        flag = divGameboard.classList.contains('initial') ? true: false;

        point = flag ? 0 : 1;

        switch (field) {
            case 0:
                string = '.ties';
                break;
            
            case 1:
                string = '.scoreOne';
                break;

            case 2:
                string = '.scoreTwo';
                break;

            default:
                break;
        }

        let span = document.querySelector(`${string} .points`);
        span.textContent =  parseInt(span.textContent) + point;  


    }

    //Este método tiene que encargarse de mostrar el tablero con los valores actualizados luego de cada ronda, sólo actualiza el botón correspondiente a la celda que se clickeó.
    const displayGrid = (button, token) => {

        button.classList.add('marked');
        button.textContent = token;
    }


    //Esta función se encarga de aumentar el contador de puntos y activa el botón para reiniciar el tablero
    const addCounterDisplay = (winner) => {

        restartButton.disabled = false;
        let field;

        if (winner === null) {

            addPointToCounter(0, 1);
            return
        }

        field = winner === playerOne ? 1 : 2;

        addPointToCounter(field, 1);
        return;
        
    }

    const clearButtons = () => {

        const buttons = document.querySelectorAll('div .buttonSquare');

        buttons.forEach( (button) => {

            button.textContent = '';
            button.classList.remove('marked');

        })

        return
    }


    const clearArray = () => {

        //Solo iterar sobre boardGame, sin reasignar la variable
        boardGame.forEach(row => {
            row.forEach(cell => {
                cell.setValue('');
            });
        });
        return;
    }

    
    //Event listeners para modificar el DOM

    //Este método escucha por un evento click sobre el botón de empezar juego, si es la primera vez que presiona, controlar que los nombres sean válidos y desactivar las opciones para modificarlos
    buttonStart.addEventListener('click', () => {

        if (buttonFlag) {

            const namePlayerOne = document.querySelector('#playerOne');
            const namePlayerTwo = document.querySelector('#playerTwo');

            if (!namePlayerOne.value || !namePlayerTwo.value) {
                alert("Ingresa nombres válidos");
            }

            else {

                //Modificar los nombres de los jugadores por los valores que tienen los input ingresados, luego desactivar estos campos del form <input>
                playerOne.setName(namePlayerOne.value);
                playerTwo.setName(namePlayerTwo.value);

                namePlayerOne.disabled = true;
                namePlayerTwo.disabled = true;

                //Desactivar el botón que da inicio al juego y la bandera correspondiente
                buttonStart.disabled = true;
                buttonFlag = false;

                //Se actualizarán los valores de los contadores de puntos 

                document.querySelector('.scoreOne p').textContent = `Puntos del jugador ${playerOne.getName()}:`;
                document.querySelector('.scoreTwo p').textContent = `Puntos del jugador ${playerTwo.getName()}:`;

                addPointToCounter(0, 0);
                addPointToCounter(1, 0);
                addPointToCounter(2, 0);


                //Se muestra el tablero una vez que se validaron los nombres ingresados
                divGameboard.classList.remove('initial');
            }

        }

    })


    //En este método se gestiona cada click sobre una de las celdas cuando se disponibiliza el tablero
    divGameboard.addEventListener('click', (e) =>  {

        if (winner || winner === null) {
            return;
        }

        //Lo que se clickea es el botón, no el div 
        let celda = e.target;

        let res;

        //Comprobar si lo que se clickea es una de las celdas del tablero, y no el tablero que las contiene
        if (celda.classList.contains('buttonSquare')) {

            if (celda.classList.contains('marked')) {
                alert("Esta celda ya fue marcada, selecciona otra");
                return;
            }

            //Asignar a la celda seleccionada la ficha indicada, modificando el array que representa el board
            let row = parseInt(celda.parentNode.dataset.row); 
            let column =  parseInt(celda.parentNode.dataset.column); 
            gameController.playRound(activePlayer, row, column);
            
            //Mostrar el cambio hecho (en el contenido del botón presionado)
            displayGrid(celda, activePlayer.getToken());


            //Comprobar si ganó el juagdor activo
            res = gameController.checkWinner(activePlayer);

            //Se asigna a la variable res el ganador como el activePlayer si checkWinner devuelve true. Si devuelve falseno hubo ganador y se cambia el activePlayer. Si devuelve null se produjo un empate entre los jugadores y se asigna null a winner.
            if (res) {

                alert("El jugador: " + activePlayer.getName() + " ganó");
                
                winner = activePlayer;
                addCounterDisplay(winner);
                return
            }
            else if (res === false) {

                activePlayer = gameController.switchActivePlayer(activePlayer, playerOne, playerTwo);
                return;
            }
            else{

                alert("Se produjo un empate entre los jugadores");

                winner = res;
                addCounterDisplay(winner);
            }

        }
        else {
            return;
        }


    })


    restartButton.addEventListener('click', () => {

        restartButton.disabled = true;
        winner = undefined;

        clearButtons();
        clearArray()

        return
    })

}


displayLogic()