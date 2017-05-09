function init() {    
    var calculation = document.getElementById("calculation");
    calculation.style.visibility = "hidden";

    addListener("AC", removeAll);
    addListener("CE", removeEntry);

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

var current, previous, calc, number = [], entries = [], remove = true;
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
    if (number.length === 0) {
        entries.pop();
        current = entries[entries.length - 1];
        output.innerHTML = "";
        if (entries.length === 0) {
            calculation.innerHTML = "";
            calculation.style.visibility = "hidden";
        } else { calculation.innerHTML = entries.join(""); }          
    } else {        
        if (previous) { current = previous; } 
        number.pop(); 
        output.innerHTML = number.join("");
        if (entries.length === 0 && number.length === 0) {
           removeAll();
        } else { calculation.innerHTML = entries.join("").concat(number.join("")); } 
    }
}  

function calculate(e) {    
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");
    var regExNumbers = /[\d.]/g;  
    var regExEquals = /=/; 
    var regExOperators = /[-+x/]/;   
    var entry = e.target.textContent;    
    previous = current;
    current = entry; 
    calculation.style.visibility = "visible"; 

    if (remove) {output.innerHTML = "";}
    
    if (regExNumbers.test(entry)) {    
        if (regExEquals.test(calculation.textContent)) { removeAll();} 
        remove = false;                
        number.push(entry);
        output.innerHTML += entry;
        calculation.innerHTML += entry;       
    } else {  
        if (regExOperators.test(previous) || regExEquals.test(previous)){
            output.innerHTML = previous; 
            return; 
        }
        remove = true;
        output.innerHTML = entry;
        var numberString = number.join("");
        if (regExNumbers.test(numberString)) {
            entries.push(parseFloat(numberString)) ;
            calc = numberString;
        }        
        entries.push(entry);        
        number = [];         

        if (entries.length < 3) {  //there is no right operand yet       
            calculation.innerHTML += entry;
            if (regExEquals.test(calculation.textContent))  { 
                calculation.innerHTML = entries.join(""); 
            }             
        } else { 
            var prop = entries[1];          
            calc = operators[prop](entries[0], entries[2]);  
            if (!Number.isInteger(calc))  { calc = calc.toFixed(2); } 
           // console.log(entries);           
            if (regExEquals.test(entry)) { 
                output.innerHTML = calc;
                calculation.innerHTML += "=" + calc;
                entries.splice(0, 4, calc);  
                current = calc;               
            } else { calculation.innerHTML = calc + entry; }
            entries.splice(0, 3, calc);             
        }       
    }
}

function countDigits(number) {
    
}

init();

/* 
digits are shown in output
store first numberber when operator is entered 
replace numberber by operator in output
what kind of operator is chosen?
store operator
replace operator  by second numberber in output

when operator key is pressed again, store second numberber, make calculation first and store result
before making next calculation

when equals key is pressed store second numberber, make calculation and show result

when CE key is pressed, the last entry is removed, either numberber or operator


*/

/*
var operators = {
    '+': function(a, b) { return a + b },
    '<': function(a, b) { return a < b },
     // ...
};

var op = '+';
alert(operators[op](10, 20));
   */