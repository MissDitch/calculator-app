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
    BigNumber.config({ 
        DECIMAL_PLACES: 7, 
        ROUNDING_MODE: 4,
        FORMAT: {
            // the decimal separator
        decimalSeparator: '.',
        // the grouping separator of the integer part
        groupSeparator: ' ',
        // the primary grouping size of the integer part
        groupSize: 3,
        // the secondary grouping size of the integer part
        secondaryGroupSize: 0
        // the grouping separator of the fraction part
        //fractionGroupSeparator: ' ',
        // the grouping size of the fraction part
        //fractionGroupSize: 0
        }
     }) ;
}

var current, previous, bigA, bigB, calc = null, isNegative = false, operate = true; number = [], entries = [], remove = true;

var operators = {
    '+': function(a, b) { 
            bigA = new BigNumber(a);
            bigB = new BigNumber(b);
            return bigA.plus(bigB).toFormat(); },
    '-': function(a, b) { 
            bigA = new BigNumber(a);
            bigB = new BigNumber(b);
            return bigA.minus(bigB).toFormat(); },
    '/': function(a, b) { 
            bigA = new BigNumber(a);
            bigB = new BigNumber(b);
            return bigA.dividedBy(bigB).toFormat(); },            
    'x': function(a, b) {
            bigA = new BigNumber(a);
            bigB = new BigNumber(b);
            return bigA.times(bigB).toFormat(); }     
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
    calc = null;
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
    //if (operate) { previous = current; } 
    //else { previous = number.join(""); }   
    previous = current; 
    current = entry;         

    if (remove) {output.innerHTML = "";}
    
    if (regExNumbers.test(entry)) { // digit is entered   
        calculation.style.visibility = "visible"; 
        if (entries.length === 1) { // array contains result of last calculation
            removeAll();} // new calculation can start

        if (entry === "." && number.indexOf(entry) > -1) { return; }
        remove = false;  
        operate = true;              
        number.push(entry);
        output.innerHTML = number.join("");
        calculation.innerHTML = entries.join(" ").concat(" " + number.join(""));       
    } else { // operator or equals sign is entered
        if (!operate) { return; } 

        if (regExOperators.test(previous) || regExEquals.test(previous)) { 
            operate = false;
            previous = entries[0];
            return;  // entering 2 operators is impossible
        }  

        if (entries.length === 0 && number.length === 0) {
            operate = false;
            calculation.style.visibility = "hidden";
            return;  //starting calculation with operator or equals sign is impossible
        }

        if (entry === "=" && entries.length < 2) { 
            current = number.join("");
            return; 
        }
        remove = true;
        output.innerHTML = entry;
        var numberString = number.join("");
        
        if (regExNumbers.test(numberString)) {
            entries.push(numberString);
        }        
        entries.push(entry);        
        number = []; 
        isNegative = false;  
        calculation.innerHTML = entries.join(" ");      

        if (entries.length < 3) {  // only left operand and operator in array      
            if (regExEquals.test(calculation.textContent))  { // previous calculation
                calculation.innerHTML = entries.join(" "); // show new calculation
            }                     
        } else { // right operand and equals sign (or new operator): make calculation
            var prop = entries[1];          
            calc = operators[prop](entries[0], entries[2]);  
            // spaces by formatting must be removed first
            c = calc.replace(/[\s]/g, "");

            if (regExEquals.test(entry)) { 
                output.innerHTML = calc;
                calculation.innerHTML += " " + calc;          
                

                entries.splice(0, 4, c);  
                current = calc;               
           } else {   
                calculation.innerHTML = c + " " + entry; }
                entries.splice(0, 3, c);     // calculation becomes left operand for next calculation        
        }       
    }
}

init();