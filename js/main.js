function init() {
    
    var calculation = document.getElementById("calculation");
    
    calculation.style.visibility = "hidden";

    addListener("AC", clearAll);
    addListener("CE", clearEntry);

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

var current, previous, leftOperand, rightOperand, calc, num = "", entries = [], clear = true;
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

function clearAll() {
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");
    output.innerHTML = "";
    calculation.innerHTML = "";
    calculation.style.visibility = "hidden";
    entries.length = 0;
    calc = 0;
}
// needs only to work for digits and operators
function clearEntry(e) {
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");
    if (!num) {
        var removed = entries.pop();
        current = entries[entries.length - 1];
        output.innerHTML = "";
        calculation.innerHTML = entries.join("");
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

    if (clear) {output.innerHTML = "";}
    
    if (regExNumbers.test(entry)) {    
        if (regExEquals.test(calculation.textContent) ) { clearAll();}
        clear = false;                
        num += entry;
        output.innerHTML += entry;
        calculation.innerHTML += entry;       
    } 
    else {  
        if (regExOperators.test(previous) || regExEquals.test(previous)){
            console.log("already entered operator");
            output.innerHTML = entries[entries.length - 1];
            return; 
        }
        clear = true;
        output.innerHTML = entry;
        if (regExNumbers.test(num)) {
            entries.push(parseFloat(num)) ;
            calc = num;
        }        
        entries.push(entry);        
        num = "";         

        if (entries.length < 3) {  //there is no right operand yet       
            calculation.innerHTML += entry;
            console.log(calculation.textContent);
            if (regExEquals.test(calculation.textContent))  { 
                calculation.innerHTML = entries.join(""); // get rid of last calculation
            }             
        }
        else  { //there is a right operand now
            leftOperand = entries[0];
            rightOperand = entries[2];   
            var prop = entries[1];          
            calc = operators[prop](leftOperand, rightOperand);  
            if (!Number.isInteger(calc))  { calc = calc.toFixed(3); } 
           // console.log(entries);           
            if (regExEquals.test(entry)) { // "="
                output.innerHTML = calc;
                calculation.innerHTML += "=" + calc;
                entries.splice(0, 4, calc);  
                current = calc;               
            } 
            else { calculation.innerHTML = calc + entry; }
            entries.splice(0, 3, calc);             
        }       
    }  

}

function countDigits(num) {
    
}

init();

/* 
digits are shown in output
store first number when operator is entered 
replace number by operator in output
what kind of operator is chosen?
store operator
replace operator  by second number in output

when operator key is pressed again, store second number, make calculation first and store result
before making next calculation

when equals key is pressed store second number, make calculation and show result

when CE key is pressed, the last entry is removed, either number or operator


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