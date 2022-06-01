"use strict";

let loginForm = document.querySelector(".loginForm");
let container = document.querySelector(".table");
let auswahl = document.querySelector("select#auswahl");
let form = document.querySelector(".form1");
let abmelden = document.querySelector("#abmelden")
let json;
let kunden;
let mitarbeiter;
let hinzugfugteForm ;

let kreditButton;
let neuKundeButton;
let aktualisierungButton;
let ueberweisungsButton;
let aktualisierungButton2;

let eingegebenerUsername;
let eingegebenesPasswort;

let kontrol =  false;

let neuTable = createTable();
let tableBody = neuTable.querySelector("tbody");

function getBankInfos(){
    let xhr = new XMLHttpRequest();
    xhr.onload = function(){
        if(xhr.responseType =="json"){
            json = xhr.response;
            kunden = json.kunden;
            mitarbeiter = json.mitarbeiter;
        }else{
            json = JSON.parse(xhr.responseText)
            kunden = json.kunden;
            mitarbeiter = json.mitarbeiter;
        }
    }

    xhr.open("GET", "./kunden.json");
    xhr.responseType = "json";
    xhr.send();
}

getBankInfos();

function select(){
    let selected = auswahl.value;
    return selected
}


loginForm.onsubmit = function(){
    if(select() == "mitarbeiter"){
        if(localStorage.getItem("mitarbeiter") != undefined){
            for(let i = 0; i< mitarbeiter.length; i++){
                let vollname = mitarbeiter[i].vorname + " " + mitarbeiter[i].nachname
                if(vollname == localStorage.getItem("mitarbeiter")){
                    eingegebenerUsername = mitarbeiter[i].username;
                    eingegebenesPasswort = mitarbeiter[i].passwort;
                    kontrol = true;
                    getAlleKunden();
                }
            }  
        }else{
            eingegebenerUsername = document.querySelector("#username").value;
            eingegebenesPasswort = document.querySelector("#passwort").value;
            getAlleKunden();
        } 
    }else if(select() == "kunde"){
        eingegebenerUsername = document.querySelector("#username").value;
        eingegebenesPasswort = document.querySelector("#passwort").value;
        getEinKunde();
    }   
     return false; 
}


function createTable() {
    let table = document.createElement("table");
    let tableHead = document.createElement("thead");
    let tableHeadRow = document.createElement("tr");
    let tableHeadCell_1 = document.createElement("th");
    let tableHeadCell_2 = document.createElement("th");
    let tableHeadCell_3 = document.createElement("th");
    let tableHeadCell_4 = document.createElement("th");
    let tableHeadCell_5 = document.createElement("th");
    let tableBody = document.createElement("tbody");

    tableHeadCell_1.textContent = "Vorname";
    tableHeadCell_2.textContent = "Nachname";
    tableHeadCell_3.textContent = "Kontostand";
    tableHeadCell_4.textContent = "Kreditschulden";
    tableHeadCell_5.textContent = "Kundennummer";

    tableHeadRow.append(tableHeadCell_5, tableHeadCell_1, tableHeadCell_2, tableHeadCell_3, tableHeadCell_4);
    tableHead.appendChild(tableHeadRow);
    table.append(tableHeadRow, tableBody);

    table.className = "table table-striped";

    return table;
}

function createKundeRow(kundenNummer, vorname, nachname, kontostand, kreditschulden){
    let trow = document.createElement("tr");
    let tkundenNummer = document.createElement("td");
    let tvorname = document.createElement("td");
    let tnachname = document.createElement("td");
    let tkontostand = document.createElement("td");
    let tkreditschulden = document.createElement("td");

    tkundenNummer.textContent = kundenNummer;
    tvorname.textContent = vorname;
    tnachname.textContent = nachname;
    tkontostand.textContent = kontostand;
    tkreditschulden.textContent = kreditschulden;

    trow.append(tkundenNummer,tvorname,tnachname,tkontostand,tkreditschulden);
    tableBody.append(trow);
    container.append(neuTable);
    document.querySelector("button").disabled=true; 
}

//von register.html
function anzeigenForm(){
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.status != 200) {
            container.textContent = "OOOps";
            return;
        }       
        let data = xhr.responseXML.querySelector(".register");
        form.innerHTML = data.innerHTML;
        form.onsubmit = function() {
           let neuKunde = neuKundeanlegen();
           json.kunden.push(neuKunde);
           sendKunde(JSON.stringify(json));
           return false;
        };
    };

    xhr.open("GET", "register.html");
    xhr.responseType = "document";
    xhr.send();
}

//von kredit.html
function anzeigenKreditForm(){
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(xhr.status != 200) {
            container.textContent = "OOOps";
            return;
        }       
        let data = xhr.responseXML.querySelector(".kreditgeben");
        form.innerHTML = data.innerHTML;
        form.onsubmit = function() {
            kreditgeben();
            return false;
        };
    };

    xhr.open("GET", "kredit.html");
    xhr.responseType = "document";
    xhr.send();
}

//von kredit.html
function anzeigenUeberweisenForm(){
    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if(xhr.status != 200) {
            container.textContent = "OOOps";
            return;
        }       
        let data = xhr.responseXML.querySelector(".kreditgeben");
        form.innerHTML = data.innerHTML;
        form.onsubmit = function() {
            ueberweisen();
            return false;
        };
    };

    xhr.open("GET", "kredit.html");
    xhr.responseType = "document";
    xhr.send();
}

//
function createButton(text){
    let neuButton = document.createElement("button");
    neuButton.textContent= text;
    neuButton.addEventListener("click", function(){
        anzeigenForm();
        neuButton.disabled = true;
        kreditButton.disabled = false;
    })
    return neuButton;
}

//Mitarbeiter legt einen neuen Kunde an
function neuKundeanlegen(){
    let neuKunde = {
        kundenNummer : random(100000,999999),
        vorname : form.querySelector("#vorname").value,
        nachname : form.querySelector("#nachname").value,
        username : form.querySelector("#username").value,
        kontostand : form.querySelector("#menge").value,
        passwort : random(1000, 9999),
        kreditschulden : 0
    }
    form.querySelector("#vorname").value = "";
    form.querySelector("#nachname").value = "";
    form.querySelector("#username").value = "";
    form.querySelector("#menge").value = "";

    console.log(JSON.stringify(neuKunde));
    return neuKunde;
}

//Legt eine Zufallszahl zwischen min und max fest
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Speichern des generierten Kunden durch php in der kunden.json-Datei
function sendKunde(jsonString) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.status != 200) return;
    };
    xhr.open("POST","./script.php");
    xhr.send(jsonString);
}

function kreditgeben(){
    let empfaenger = form.querySelector("#empfaenger").value;
    let menge = form.querySelector("#menge").value;
    for(let i= 0; i<kunden.length; i++){
        if(kunden[i].kundenNummer == empfaenger){
            kunden[i].kreditschulden = Number(kunden[i].kreditschulden) + Number(menge);
            sendKunde(JSON.stringify(json));
            form.querySelector("#empfaenger").value ="";
            form.querySelector("#menge").value = "";
            return false;
        }
    }
}

function addRefreschButton(text){
    let neuButton = document.createElement("button");
    neuButton.textContent= text;
    neuButton.addEventListener("click", function(){
        getBankInfos();
        container.innerHTML = "";
        tableBody.innerHTML= "";
        getAlleKunden();
    })
    return neuButton;
}


function getAlleKunden(){
    for(let i = 0; i< mitarbeiter.length; i++) {
        if(eingegebenerUsername == mitarbeiter[i].username && eingegebenesPasswort == mitarbeiter[i].passwort){
            for(let i = 0; i<kunden.length; i++){
               createKundeRow(
                kunden[i].kundenNummer,
                kunden[i].vorname,
                kunden[i].nachname,
                kunden[i].kontostand,
                kunden[i].kreditschulden
                )
            }
         kontrol = true;
         //Neu Kunde button ergaenzen
         neuKundeButton = createButton("Neu Kunde")
         container.append(neuKundeButton); 
         //Kredit geben button ergaenzen
         kreditButton = document.createElement("button");
         kreditButton.textContent = "Kredit Geben";
         kreditButton.style.marginLeft = "1rem"
         kreditButton.addEventListener("click", function(){
            anzeigenKreditForm();
            kreditButton.disabled = true;
            neuKundeButton.disabled = false;
         })
         container.append(kreditButton);
         ////AktualisirungsButton ergaenzen
         aktualisierungButton = addRefreschButton("Aktualisiren");
         aktualisierungButton.style.marginLeft = "1rem"
         container.append(aktualisierungButton); 

         localStorage.setItem("mitarbeiter", mitarbeiter[i].vorname + " " + mitarbeiter[i].nachname);

         document.querySelector("#username").value = "";
         document.querySelector("#passwort").value = ""; 

        // return false;
        }
    }
    if(kontrol == false){
        container.textContent = "Usernumber oder Passwort ist falsch"
    }
}

abmelden.onclick = function(){
    container.innerHTML= "";
    form.innerHTML= "";
    document.querySelector("#username").value = "";
    document.querySelector("#passwort").value = "";
    localStorage.removeItem("mitarbeiter");
    localStorage.removeItem("kunde");
    return false;
}


function ueberweisen(){
    let empfaenger = form.querySelector("#empfaenger").value;
    let menge = form.querySelector("#menge").value;
    let absender = container.querySelector("td").textContent;
    for(let i= 0; i<kunden.length; i++){
        if(kunden[i].kundenNummer == absender){
            kunden[i].kontostand = Number(kunden[i].kontostand) - Number(menge);
            sendKunde(JSON.stringify(json));
        }
        if(kunden[i].kundenNummer == empfaenger){
            kunden[i].kontostand = Number(kunden[i].kontostand) + Number(menge);
            sendKunde(JSON.stringify(json));
            console.log(absender)
            form.querySelector("#empfaenger").value = "";
            form.querySelector("#menge").value = "";
        }
    }
}

function getEinKunde(){
    for(let i = 0; i< kunden.length; i++) {
        if(eingegebenerUsername == kunden[i].username && eingegebenesPasswort == kunden[i].passwort){
            createKundeRow(
                kunden[i].kundenNummer,
                kunden[i].vorname,
                kunden[i].nachname,
                kunden[i].kontostand,
                kunden[i].kreditschulden
                ) 
            kontrol = true; 

            //Ueberweisungsbutton ergaenzen
            ueberweisungsButton = document.createElement("button");
            ueberweisungsButton.textContent = "Überweisen";
            ueberweisungsButton.className="ueberweisenButton"
            ueberweisungsButton.addEventListener("click", function(){
                anzeigenUeberweisenForm();
            })
            container.append(ueberweisungsButton); 
            //AktualisierungsButton ergaenzen
            aktualisierungButton2 = addRefreschButtonFurEinKunde("Aktualisiren");
            aktualisierungButton2.style.marginLeft = "1rem"
            container.append(aktualisierungButton2); 
            //----------------------------------------
            localStorage.setItem("kunde", kunden[i].vorname + " " + kunden[i].nachname);

            document.querySelector("#username").value = "";
            document.querySelector("#passwort").value = ""; 

            //return false;   
        }           
    }
    if(kontrol == false){
        container.textContent = "Kundennummer oder Passwort ist falsch"
    }
}

function addRefreschButtonFurEinKunde(text){
    let neuButton = document.createElement("button");
    neuButton.textContent= text;
    neuButton.addEventListener("click", function(){
        container.innerHTML = "";
        tableBody.innerHTML= "";
        getEinKunde();
    })
    return neuButton;
}