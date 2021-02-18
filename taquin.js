"use strict";

function onLoad() {
    init(5)
}

let taquinGrid;

//OPTIMISED
function init(size) {
    taquinGrid = Object.create(Grid)
    taquinGrid.size = size;
    taquinGrid.values = gameShuffle();
    console.log(taquinGrid)
    displayGrid()
}

const Grid = {
    size: null,
    values: null,
    victoryState: false
}

const Case = {
    r: null,
    c: null,
    nextTo: null,
    value: null //Seule valeur qui peut changer avec le temps
}

//OPTIMISED
function getBoxes() {
    return document.querySelectorAll("div.box"); // Array des element ".box"
}

//OPTIMISED
function displayGrid() {
    let game = document.querySelector("div#game")
    game.innerHTML = ""

    for (let r = 1; r <= taquinGrid.size; r++) {
        let row = document.createElement("div")
        row.classList.add("row")
        for (let c = 1; c <= taquinGrid.size; c++) {
            let div = document.createElement("div")
            div.setAttribute('id', 'r' + r + '-c' + c)
            div.classList.add('box')
            if (taquinGrid.values[getArrayId(r, c)].value === "") {
                div.classList.add('empty')
            } else {
                let span = document.createElement("span")
                let text = document.createTextNode(taquinGrid.values[getArrayId(r, c)].value)
                span.appendChild(text)
                div.appendChild(span)
            }
            row.appendChild(div)
        }
        game.appendChild(row)
    }

    if (taquinGrid.victoryState) {
        document.querySelector("div#ifVictory").style.display = "block" // On affiche le modal "ifVictory"
        document.querySelector("span#size").innerText = taquinGrid.size + "x" + taquinGrid.size // On écrit dans quelle était la taille de la partie
    }

    let boxes = getBoxes();
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener("click", selection) //On ajout l'évènement click
    }
}

//OPTIMISED
function selection(event) {
    let target = (event.target.tagName === "SPAN") ? event.target.parentElement : event.target //Si on clique sur le span on selectione l'id sinon l'id
        , selectCase = getCase(!isNaN(parseInt(target.innerText)) ? parseInt(target.innerText) : "")

    let idToCheck = selectCase.nextTo; //idToCheck récupère les cases autour de la selection

    //Boucle qui permet de déplacer l'élément cliqué sur la place vide
    for (let idToCheckElement of idToCheck) {
        if (idToCheckElement !== undefined) { //On vérifie que l'élément du tableau est défini
            let caseNextTo = getCaseByPos(idToCheckElement[0], idToCheckElement[1]) // Récupération de la case via ses coordonnée
            if (caseNextTo.value === "") { //Si la case a coté est vide
                changeValue(caseNextTo.r, caseNextTo.c, selectCase.value) // On change le contenue de la case vide
                changeValue(selectCase.r, selectCase.c, "") // On vide la case cliqué
                //console.log("Déplacement de " + selectCase + " à " + caseNextTo
            }
        }
    }
    checkVictory() //Verification si le coup est une victoire
    displayGrid() // On recharge l'affichage
}

//OPTIMISED
function checkVictory() {
    let valuesGrid = []
    for (let i = 0; i < taquinGrid.values.length; i++) valuesGrid.push(taquinGrid.values[i].value)
    console.log("vic", valuesGrid)
    if (valuesGrid.isSortedByValue()) {
        taquinGrid.victoryState = true
    }
}

//OPTIMISED
function cheat() {
    for (let i = 0; i < taquinGrid.values.length; i++) taquinGrid.values[i].value = i + 1 // On met dans l'ordre les valeurs
    taquinGrid.values[taquinGrid.values.length - 1].value = taquinGrid.values[taquinGrid.values.length - 2].value // On met la dernière valeur à l'avant dernière
    taquinGrid.values[taquinGrid.values.length - 2].value = "" // On vide la valeur de l'avant dernière
    displayGrid() // On affiche la grille
}

//OPTIMISED
function generateGameInput(input) {
    let size = document.querySelector("input#" + input).value
    init(size)
    document.querySelector("div#ifVictory").style.display = "none" // On affiche le modal "ifVictory"
}

//OPTIMISED
function changeValue(r, c, value) {
    for (let i = 0; i < taquinGrid.values.length; i++) if (taquinGrid.values[i].r === r && taquinGrid.values[i].c === c)
        taquinGrid.values[i].value = value
    return false
}

//OPTIMISED
function getCase(value) {
    for (let i = 0; i < taquinGrid.values.length; i++) if (taquinGrid.values[i].value === value)
        return taquinGrid.values[i]
    return false
}

//OPTIMISED
function getCaseByPos(r, c) {
    for (let i = 0; i < taquinGrid.values.length; i++) if (taquinGrid.values[i].r === r && taquinGrid.values[i].c === c)
        return taquinGrid.values[i]
    return false
}


//OPTIMISED
function getArrayId(r, c) {
    let size = taquinGrid.size;
    return ((r - 1) * size + c) - 1
}

//OPTIMISED
function nextTo(r, c) {
    let size = taquinGrid.size;
    const idToCheck = [], colToCheck = [], rowToCheck = [];

    if (r - 1 > 0) // Si on ne sort pas du tableau
        rowToCheck.push(r - 1)
    if (r + 1 <= size) // Si on ne sort pas du tableau
        rowToCheck.push(r + 1)

    if (c - 1 > 0) // Si on ne sort pas du tableau
        colToCheck.push(c - 1)
    if (c + 1 <= size) // Si on ne sort pas du tableau
        colToCheck.push(c + 1)

    //Ajout des coups possible selon la ligne
    for (let rowToCheckElement of rowToCheck) {
        if (!isNaN(rowToCheckElement)) idToCheck.push([rowToCheckElement, c])
    }
    //Ajout des coups possible selon la colonne
    for (let colToCheckElement of colToCheck) {
        if (!isNaN(colToCheckElement)) idToCheck.push([r, colToCheckElement])
    }
    return idToCheck;
}

//OPTIMISED
function gameShuffle() {

    let size = taquinGrid.size;
    let board = []
    for (let i = 0; i < (size * size) - 1; i++) {
        board.push(i + 1)
    }
    board.push("")
    let multiplier = 250;
    let empty = [parseInt(size), parseInt(size)]
    for (let i = 0; i < size * multiplier; i++) {
        let nextToEmpty = nextTo(empty[0], empty[1])
            , chooseNext = nextToEmpty[getRandomInt(nextToEmpty.length)]
            , currentID = getArrayId(empty[0], empty[1])
            , nextID = getArrayId(chooseNext[0], chooseNext[1]);
        board[currentID] = board[nextID]
        board[nextID] = ""
        empty = [chooseNext[0], chooseNext[1]]
    }

    //Normalisation de la partie
    while (board[board.length - 1] !== "") {
        let nextR = empty[0] + 1;
        let nextC = empty[1] + 1;
        let chooseNext = empty
        if (nextR <= size) {
            chooseNext = [nextR, empty[1]]
        }
        if (nextC <= size) {
            chooseNext = [empty[0], nextC]
        }
        let currentID = getArrayId(empty[0], empty[1]);
        let nextID = getArrayId(chooseNext[0], chooseNext[1]);
        board[currentID] = board[nextID]
        board[nextID] = ""
        empty = [chooseNext[0], chooseNext[1]]
    }
    let caseBoard = []

    for (let r = 1; r <= size; r++) for (let c = 1; c <= size; c++) {
        let newCase = Object.create(Case)
        newCase.r = r;
        newCase.c = c;
        newCase.nextTo = nextTo(r, c)
        newCase.value = board[getArrayId(r, c)]
        caseBoard.push(newCase)
    }

    return caseBoard
}

//OPTIMISED
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//OPTIMISED
Array.prototype.sortByValue = function () {
    let array = this.slice(); //On copie le tableau dans un nouveau tableau
    array.sort(function (a, b) {
        return a - b;
    }); //On trie le tableau par valeur
    return array
}

//OPTIMISED
Array.prototype.isSortedByValue = function () {
    let array = this.sortByValue()
    array.push(array.shift());
    // On verifie pour chaque element de la chaine - 1 (le -1 est la valeur NaN)
    for (let i = 0; i < this.length - 1; i++) if (this[i] !== array[i]) return false // Si il y a une différence alors ca retourne false
    return true; // Les arrays sont identique, on renvoie true
}

// Toute les ressources de la page sont complètement chargées.
window.onload = onLoad;
