"use strict";

function onLoad() {
    generateGame(6) // Default game
    init()
}

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
    let r = parseInt(target.id.substr(1)); // Numero de ligne
    let c = parseInt(target.id.substr(r.toString().length + 3)); // Numero de colonne
    const idToCheck = Array(4), colToCheck = Array(2), rowToCheck = Array(2);
    //idToCheck prend la taille du nombre de déplacement maximum
    let length = document.getElementsByClassName("box").length //Recuperation de la taille du tableau
    if (r - 1 > 0) // Si on ne sort pas du tableau
        rowToCheck.push(r - 1)
    if (r + 1 <= Math.sqrt(length)) // Si on ne sort pas du tableau
        rowToCheck.push(r + 1)

    if (c - 1 > 0) // Si on ne sort pas du tableau
        colToCheck.push(c - 1)
    if (c + 1 <= Math.sqrt(length)) // Si on ne sort pas du tableau
        colToCheck.push(c + 1)
    //Ajout des coups possible selon la ligne
    for (let rowToCheckElement of rowToCheck) {
        if (!isNaN(rowToCheckElement)) idToCheck.push("r" + rowToCheckElement + "-c" + c)
    }
    //Ajout des coups possible selon la colonne
    for (let colToCheckElement of colToCheck) {
        if (!isNaN(colToCheckElement)) idToCheck.push("r" + r + "-c" + colToCheckElement)
    }
    //Boucle qui permet de déplacer l'élément cliqué sur la place vide
    for (let idToCheckElement of idToCheck) {
        if (idToCheckElement !== undefined) { //On vérifie que l'élément du tableau est défini
            let dc = document.getElementById(idToCheckElement); //Récupération de l'élément via son id existant au préalable
            if (dc.classList.contains("empty")) { //Si l'élément a la classe empty
                let content = target.innerHTML //On sauvegarde l'HTML de notre cible de base
                target.innerHTML = "" //On vide le contenu HTML de notre cible
                target.classList.add("empty") //On ajoute la classe empty à la cible
                dc.classList.remove("empty") //On retire la classe empty a l'élément empty précède
                dc.innerHTML = content //On lui met le contenu de la balise target sauvegardé dans content
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
Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
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
function generateGame(size) {
    let listSize = size * size - 1, value = []
    for (let i = 0; i < listSize; i++) value.push(i + 1) // On attribue les valeurs a chaque element
    value.shuffle() // On mélange les valeurs
    let game = document.getElementById("game")
    game.innerHTML = ""
    for (let r = 1; r <= size; r++) {
        let row = document.createElement("div")
        row.classList.add("row")
        for (let c = 1; c <= size; c++) {
            let div = document.createElement("div")
            div.setAttribute('id', 'r' + r + '-c' + c)
            div.classList.add('box')
            let id = ((r - 1) * size + c) - 1 // Recuperation de la valeur du tableau par rapport au case
            let value_with_id = value[id]
            if (value[id] === undefined) {
                div.classList.add('empty')
            } else {
                let span = document.createElement("span")
                let text = document.createTextNode(value_with_id)
                span.appendChild(text)
                div.appendChild(span)
            }
            row.appendChild(div)
        }
        game.appendChild(row)
    }
    init()
}

