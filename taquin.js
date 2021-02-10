/**
 *
 * M413 - TD3 - Taquin Game
 * *
 * @author Jean-Michel Bruneau
 *    @copyright UCA - IUT -INFO
 * @version    1.0
 * @date            2021-01-31
 *
 */
"use strict";

// M413 - Taquin
let message = 'JavaScript is ok :)';
// alert( message);
console.log(message);

function onLoad() {
    console.log('Processus de chargement du document terminé…');
    //
    // All your JavaScript code goes here !
    //
    generateGame(4) // Default game
    init()
}

// Toute les ressources de la page sont complètement chargées.
window.onload = onLoad;

//OPTIMISED
function init() {
    let boxes = document.getElementsByClassName("box") // Array des element ".box"
    for (let i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener("click", selection) //On ajout l'évènement click
    }
}

//OPTIMISED
function selection(event) {
    let target = (event.target.tagName === "SPAN") ? event.target.parentElement : event.target; //Si on clique sur le span on selectione l'id sinon l'id
    let r = getRC(target.id)[0] // Numero de ligne
    let c = getRC(target.id)[1] // Numero de colonne
    let idToCheck; //idToCheck prend la taille du nombre de déplacement maximum
    let length = document.getElementsByClassName("box").length //Recuperation de la taille du tableau
    idToCheck = nextTo(Math.sqrt(length), r, c)
    //Boucle qui permet de déplacer l'élément cliqué sur la place vide
    for (let idToCheckElement of idToCheck) {
        if (idToCheckElement !== undefined) { //On vérifie que l'élément du tableau est défini
            idToCheckElement = toId(idToCheckElement[0], idToCheckElement[1])
            let dc = document.getElementById(idToCheckElement); //Récupération de l'élément via son id existant au préalable
            if (dc.classList.contains("empty")) { //Si l'élément a la classe empty

                let from = document.getElementById(target.id);
                let to = document.getElementById(dc.id);
                let content = from.innerHTML //On sauvegarde l'HTML de notre cible de base
                from.innerHTML = "" //On vide le contenu HTML de notre cible
                from.classList.add("empty") //On ajoute la classe empty à la cible
                to.classList.remove("empty") //On retire la classe empty a l'élément empty précède
                to.innerHTML = content //On lui met le contenu de la balise target sauvegardé dans content
                console.log("Déplacement de " + from.id + " à " + to.id)
            }
        }
    }
    checkVictory() //Verification si le coup est une victoire
}

//OPTIMISED
function checkVictory() {
    let boxes = document.getElementsByClassName("box") // Recuperation des élements ".box"
        , value = []; // Tableau des valeurs
    for (let i = 0; i < boxes.length; i++)
        value.push(parseInt(boxes[i].innerText)) // On ajoute dans le tableau des valeurs chaque valeurs une a une
    if (value.isSortedByValue()) { // Si les valeurs sont trier par valeur
        document.getElementById("ifVictory").style.display = "block" // On affiche le modal "ifVictory"
        document.getElementById("size").innerText = Math.sqrt(boxes.length) + "x" + Math.sqrt(boxes.length) // On écrit dans quelle était la taille de la partie
    }
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
    for (let i = 0; i < this.length - 1; i++) { // On verifie pour chaque element de la chaine - 1 (le -1 est la valeur NaN)
        if (this[i] !== array[i]) return false // Si il y a une différence alors ca retourne false
    }
    return true; // Les arrays sont identique, on renvoie true
}

//OPTIMISED
function cheat() {
    let boxes = document.getElementsByClassName("box") // Recuperation des élements ".box"
        , value = [] // Tableau des valeurs

    for (let i = 0; i < boxes.length; i++)
        value.push(i + 1) // On ajoute les valeurs triée de 1 a boxes.length

    for (let i = 0; i < boxes.length - 1; i++) {
        boxes[i].innerHTML = "<span>" + value[i] + "</span>" // On met la nouvelle valeur dans la boxes numero i
        boxes[i].classList.remove("empty") // On lui retire la classe empty au cas ou elle l'a (si la parti est en cours :))
    }
    let l = boxes.length
        , content = boxes[l - 2].innerHTML //On sauvegarde l'HTML de notre cible de l'avant dernière case
    boxes[l - 2].innerHTML = "" //On vide le contenu HTML de l'avant dernière case
    boxes[l - 2].classList.add("empty") //On ajoute la classe empty à la avant dernière case
    boxes[l - 1].classList.remove("empty") //On retire la classe empty a l'element ayant la classe empty
    boxes[l - 1].innerHTML = content //On lui met le contenu de la balise sauvegardé dans content
}

//OPTIMISED
function generateGameInput(input) {
    let size = document.getElementById(input).value
    generateGame(size)
    document.getElementById("ifVictory").style.display = "none"
}

//OPTIMISED
function getArrayId(size, r, c) {
    return ((r - 1) * size + c) - 1
}

//OPTIMISED
function getRC(id) {
    let r = parseInt(id.substr(1)); // Numero de ligne
    let c = parseInt(id.substr(r.toString().length + 3)); // Numero de colonne
    return [r, c]
}

function toId(r, c) {
    return "r" + r + "-c" + c
}

//OPTIMISED
function nextTo(size, r, c) {
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
function generateGame(size) {
    let game = document.getElementById("game")
    game.innerHTML = ""

    let value = gameShuffle(size)

    for (let r = 1; r <= size; r++) {
        let row = document.createElement("div")
        row.classList.add("row")
        for (let c = 1; c <= size; c++) {
            let div = document.createElement("div")
            div.setAttribute('id', 'r' + r + '-c' + c)
            div.classList.add('box')
            if (value[getArrayId(size, r, c)] === "") {
                div.classList.add('empty')
            } else {
                let span = document.createElement("span")
                let text = document.createTextNode(value[getArrayId(size, r, c)])
                span.appendChild(text)
                div.appendChild(span)
            }
            row.appendChild(div)
        }
        game.appendChild(row)
    }
    init()
}

function gameShuffle(size) {
    let board = []
    for (let i = 0; i < (size * size) - 1; i++) {
        board.push(i + 1)
    }
    board.push("")
    let multiplier = 250;
    let empty = [parseInt(size), parseInt(size)]
    for (let i = 0; i < size * multiplier; i++) {
        let nextToEmpty = nextTo(size, empty[0], empty[1])
        let chooseNext = nextToEmpty[getRandomInt(nextToEmpty.length)]
        let currentID = getArrayId(size, empty[0], empty[1]);
        let nextID = getArrayId(size, chooseNext[0], chooseNext[1]);
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
        let currentID = getArrayId(size, empty[0], empty[1]);
        let nextID = getArrayId(size, chooseNext[0], chooseNext[1]);
        board[currentID] = board[nextID]
        board[nextID] = ""
        empty = [chooseNext[0], chooseNext[1]]
    }

    return board
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
