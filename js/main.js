function init() {
    
    var calculation = document.getElementById("calculation");
    
    calculation.style.visibility = "hidden";

    addListener("AC", clearAll);
    addListener("CE", clearEntry);

    addListener("zero", showEntry);
    addListener("one", showEntry);
    addListener("two", showEntry);
    addListener("three", showEntry);
    addListener("four", showEntry);
    addListener("five", showEntry);
    addListener("six", showEntry);
    addListener("seven", showEntry);
    addListener("eight", showEntry);
    addListener("nine", showEntry);
    addListener("dot", showEntry);

    addListener("divide", showEntry);
    addListener("multiply", showEntry);
    addListener("minus", showEntry);
    addListener("plus", showEntry);

    addListener("equals", showEntry);
}

var leftOperand, rightOperand, calc, num = "", entries = [], clear = true;
var operators = {
        '+': function(a, b) { return parseFloat(a) + parseFloat(b) },
        '-': function(a, b) { return a - b },
        '/': function(a, b) { return a / b },
        'x': function(a, b) { return a * b }    
    }; 
//var entries = [];
//var clear = true;

function addListener(id, func) {
    var el = document.getElementById(id);
    return el.addEventListener("click", func); 
}

function clearAll(e) {
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");
    output.innerHTML = "";
    calculation.innerHTML = "";
    calculation.style.visibility = "hidden";
    entries.length = 0;
    calc = 0;
}
// only working for digits and operators
function clearEntry(e) {
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");
    var removed = entries.pop();
    output.innerHTML = "";
    calculation.innerHTML = entries.join("");
}  

/* if entry is digit, and next entry also a digit, previous entry must remain on output
if entry is an operator, number must be removed from output and stored

  */
function showEntry(e) {    
    var output = document.getElementById("output");
    var calculation = document.getElementById("calculation");
    var regEx = /[\d.]/g;  
    var regEx2 = /^[=]$/;
    
    var entry = e.target.textContent;    
    calculation.style.visibility = "visible"; 
    //calculation.innerHTML = entry;
    if (clear) {
        output.innerHTML = "";
    }
    if (regEx.test(entry)) {    
        clear = false;                
        num += entry;
        output.innerHTML += entry;
        calculation.innerHTML += entry;
    }
    else { 
        //leftOperand = num;
          
        clear = true;
        output.innerHTML = entry;
        if(regEx.test(num)) {
            entries.push(parseFloat(num)) ;
            calc = num;
        }        
        entries.push(entry);
        
        num = ""; 
        

        if (entries.length < 3) {  //there is no right operand yet            
            //calc = leftOperand;  
            calculation.innerHTML += entry;
            if (regEx2.test(entry)) {
                output.innerHTML = calc;
            }
        }
        else  { 
            leftOperand = entries[0];
            rightOperand = entries[2];   
            var prop = entries[1];          
            calc = operators[prop](leftOperand, rightOperand);  
            if (!Number.isInteger(calc))  {
                    calc = calc.toFixed(3);
                } 
            console.log(entries);  
            if (regEx2.test(entry)) { // "="
                //entries.pop();
                output.innerHTML = calc;
                calculation.innerHTML += "=" + calc;
                entries.splice(0, 4, calc); 
                //entries.length = 0;
            } else {
                calculation.innerHTML = calc + entry ;   
                  
            }
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