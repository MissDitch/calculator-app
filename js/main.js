function init() {    
    var calculation = document.getElementById("calculation");
    calculation.style.visibility = "hidden";

    addListener("AC", removeAll);
    addListener("CE", removeEntry);
    addListener("posNeg", toggleNegative);

    addListener("zero", calculate);
    addListener("one", calculate);
    addListener("two", calculate);
    addListener("three", calculate);
    addListener("four", calculate);
    addListener("five", calculate);
    addListener("six", calculate);
    addListener("seven", calculate);
    addListener("eight", calculate);
    addListener("nine", calculate);
    addListener("dot", calculate);

    addListener("divide", calculate);
    addListener("multiply", calculate);
    addListener("minus", calculate);
    addListener("plus", calculate);

    addListener("equals", calculate);
}

var current, previous, calc, isNegative = false, operate = true; number = [], entries = [], remove = true;
var operators = {
    '+': function(a, b) { return parseFloat(a) + parseFloat(b) },
    '-': function(a, b) { return a - b },
    '/': function(a, b) { return a / b },
    'x': function(a, b) { return a * b }    
}; 

function addListener(id, func) {
    var el = document.getElementById(id);
    return el.addEventListener("click", func); 
}

function removeAll() {
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");
    output.innerHTML = "";
    calculation.innerHTML = "";
    calculation.style.visibility = "hidden";
    entries.length = 0;
    number.length = 0;
    calc = 0;
}

function removeEntry(e) {
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");

    if (number.length === 0) { // no number in the making
        entries.pop();
        current = entries[entries.length - 1];
        output.innerHTML = "";
        if (entries.length === 0) {
            calculation.innerHTML = "";
            calculation.style.visibility = "hidden";
        } else { calculation.innerHTML = entries.join(" "); }          
    } else {        
        if (previous) { current = previous; } 
        number.pop(); 
        output.innerHTML = number.join("");

        if (entries.length === 0 && number.length === 0) {
           removeAll();
        } else { calculation.innerHTML = entries.join(" ").concat(" " + number.join("")); } 
    }
}  

function toggleNegative() {
    var regExEquals = /=/; 

    if (regExEquals.test(calculation.textContent)) { removeAll();}
    
    if (!isNegative) {
        number.unshift("-");
        isNegative = true;        
    } else {
        number.shift();
        isNegative = false;
    }
    output.innerHTML =  number.join("");
    calculation.innerHTML = entries.join(" ").concat(" " + number.join(""));   
}

function calculate(e) {    
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");
    var regExNumbers = /[\d.]/g;      
    var regExEquals = /=/;     
    var regExOperators = /^[-+x/]$/;    
    var entry = e.target.textContent;    
    previous = current;
    current = entry;         

    if (remove) {output.innerHTML = "";}
    
    if (regExNumbers.test(entry)) { // digit is entered   
        calculation.style.visibility = "visible"; 

        if (entries.length === 1) { // array contains result of last calculation
            removeAll();} // new calculation can start
        remove = false;  
        operate = true;              
        number.push(entry);
        output.innerHTML = number.join("");
        calculation.innerHTML = entries.join(" ").concat(" " + number.join(""));       
    } else { // operator or equals sign is entered
        if (!operate) { return; } 

        if (regExOperators.test(previous) || regExEquals.test(previous)) { 
            operate = false;
            return;  // entering 2 operators is impossible
        }  

        if (entries.length === 0 && number.length === 0) {
            operate = false;
            calculation.style.visibility = "hidden";
            return;  //starting calculation with operator or equals sign is impossible
        }
        remove = true;
        output.innerHTML = entry;
        var numberString = number.join("");
        //use BigNumber here ? or in operator object?
        if (regExNumbers.test(numberString)) {
            entries.push(parseFloat(numberString));
            calc = numberString;
        }        
        entries.push(entry);        
        number = []; 
        isNegative = false;        

        if (entries.length < 3) {  // only left operand and operator in array      
            calculation.innerHTML += " " + entry; 
            if (regExEquals.test(calculation.textContent))  { // previous calculation
                calculation.innerHTML = entries.join(" "); // show new calculation
            }                     
        } else { // right operand and equals sign (or new operator): make calculation
            var prop = entries[1];          
            calc = operators[prop](entries[0], entries[2]);  

            if (regExEquals.test(entry)) { 
                output.innerHTML = calc;
                calculation.innerHTML += " = " + calc;
                entries.splice(0, 4, calc);  
                current = calc;               
           } else {   
                calculation.innerHTML = calc + " " + entry; }
                entries.splice(0, 3, calc);     // calculation becomes left operand for next calculation        
        }       
    }
}

init();