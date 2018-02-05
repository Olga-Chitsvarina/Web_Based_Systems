
function getStats(txt) {

    let arrayOfWords = [];

    //-----------------------------------------------------------------------------------------------------
    // Return true if char is a number, false otherwise:
    function isNumber(char){
        let ascii = char.charCodeAt(0);
        return ascii >= 48 && ascii <= 57;
    }

    // Return true if char is a letter, false otherwise:
    function isLetter(char){
        let ascii = char.charCodeAt(0);
        return ascii >= 97 && ascii <= 122;
    }

    //  returns the total number of words in the text:
    function returnNWordsAndFillArrayOfWords(txt){
        txt = txt + " ";                            // Make sure to finish with a symbol, which is not a word
        let char;
        let processingWord = false;
        let word = "";

        let i = 0;
        while(i<txt.length){
            char = txt.charAt(i);
            char = char.toLowerCase();

            if (isLetter(char) || isNumber(char)){
                processingWord=true;
                word = word + char;
            }
            else if (processingWord){
                processingWord = false;
                arrayOfWords.push(word);
                word = "";
            }
            i++;
        }
        return arrayOfWords.length;
    }
    //-------------------------------------------------------------------------------------------------------------
    // Calculate and return the number of lines:
    function returnNLines(txt){
        let strLength = txt.length;
        if(strLength<1){
            return 0;
        }
        let i=0;
        let char;
        let count = 1;                      // If there is at least one symbol, there is at least one line
        while(i<strLength ){
            char = txt.charAt(i);
            if(char === '\n'){
                count ++;
            }
            i++;
        }
        return count;
    }

    //---------------------------------------------------------------------------------------------------------------
    // Return true if char is a white space, false otherwise:
    function isWhiteSpace(char){
        return(char ==='\n' || char ==='\t' || char ===' ');
    }


    //Return the number of lines in the text containing at least one visible character.
    function returnNNonEmptyLines(txt){
        txt = txt + '\n';                          // Makes sure that string is at least 1 line (either empty or not)

        let strLength = txt.length;
        let processingLine = false;
        let char;
        let count=0;

        let i = 0;
        while(i<strLength){
            char = txt.charAt(i);

            if(!isWhiteSpace(char)){
                processingLine = true;
            }

            else if (processingLine && char=== '\n'){
                count ++;
                processingLine = false;
            }
            i++;
        }
        return count;
    }
    //-----------------------------------------------------------------------------------------------------------------
    //Returns the length of the longest line. Line length is computed by counting the number of
    //characters in the line, including any trailing white spaces, but excluding the newline character ‘\n’.
    function returnMaxLineLength(txt){
        txt = txt + '\n';
        let strLength = txt.length;
        let count = 0;
        let max=0;
        let char;

        let i = 0;
        while(i<strLength){
            char = txt.charAt(i);
            if (char === '\n'){
                if(count>max){
                    max = count;
                }
                count = 0;
            }
            else{
                count++;
            }
            i++
        }
        return max;
    }
    //--------------------------------------------------------------------------------------------------------------
    //  Returns the average word length in the text.
    function returnAverageWordLength(){
        let arrayLength = arrayOfWords.length;

        if(arrayLength === 0){
            return 0;
        }

        let i = 0;
        let sum = 0;
        while(i< arrayLength){
            sum = sum + arrayOfWords[i].length;
            i++
        }
        return sum/arrayLength;
    }
    //-----------------------------------------------------------------------------------------------------------------

    // Returns the reversed copy of the string
    function reverseStr(string){
        let i = 0;
        let newString = "";

        while(i<string.length){
            newString = string.charAt(i) + newString;
            i++;
        }
        return newString;
    }


    // Returns true if string is a palindrome, false otherwise
    function isPalindrome(string){
        let strLength = string.length;

        if (strLength < 3){
            return false;
        }

        return string === reverseStr(string);
    }


    // Returns true if element is already in the array:
    function isAnElement(string, array){
        let i = 0;
        let element;
        while(i< array.length){
            element = array[i];
            if(element === string){
                return true;
            }
            i++;
        }
        return false;
    }


    //Returns  a list of unique palindromes in the text. Palindrome is a word with length > 2, which reads the
    // same forward and backwards.
    function returnPalindromes(){
        let arrayLength = arrayOfWords.length;
        let arrayPalindromes = [];
        let string = "";

        let i = 0;
        while(i < arrayLength){
            string  = arrayOfWords[i];
            if(isPalindrome(string) && !isAnElement(string, arrayPalindromes)){
                arrayPalindromes.push(string);
            }
            i++;
        }
        return arrayPalindromes;
    }
    //-----------------------------------------------------------------------------------------------------------------
    // Removes duplicates from the array
    function removeDuplicates(array){
        let char;
        let newArray = [];

        let i = 0;
        while(i<array.length){
            char = array[i];
            if (! isAnElement(char, newArray)){
                newArray.push(char);
            }
            i++;
        }

        return newArray;
    }


    // Returns the 10 longest words in the text. In case of ties, the secondary sorting criteria should be
    // alphabetical sorting.
    // Sorting is based on: https://stackoverflow.com/questions/10630766/sort-an-array-based-on-the-length-of-each-element
    function return10Longest(){
        let removedDuplicates = removeDuplicates(arrayOfWords);
        let sorted = removedDuplicates.sort(function(a,b){return b.length - a.length ||  a.localeCompare(b)});
        return sorted.slice(0,10);
    }
    //-----------------------------------------------------------------------------------------------------------------

    //Constructor for object Word:
    function Word(word){
        this.word = word;
        this.frequency = 1;
    }

    // Update frequency, if word is already in the array, or add a new object to the array:
    function update(element, arrayOfObjects){
        let i = 0;
        let obj;
        while(i< arrayOfObjects.length){
            obj = arrayOfObjects[i];
            if(obj.word === element){
                arrayOfObjects[i].frequency = arrayOfObjects[i].frequency + 1;
                return arrayOfObjects;
            }
            i++;
        }
        let newObj = new Word(element);
        arrayOfObjects.push(newObj);

        return arrayOfObjects;
    }

    // Based on array of words, create the array of Word objects with frequency:
    function fillArrayOfObjects(){
        let arrayOfObjects = [];
        let element;
        let i = 0;
        while(i< arrayOfWords.length){
            element = arrayOfWords[i];
            arrayOfObjects = update(element,arrayOfObjects);
            i++;
        }
        return arrayOfObjects;
    }

    // Create the array of strings based on array of Word objects
    function adjustFormatting(arrayOfObjects){
        let i = 0;
        let newArray =[];
        let newElement;
        let word;
        let frequency;
        while(i< arrayOfObjects.length){
            word = arrayOfObjects[i].word;
            frequency = arrayOfObjects[i].frequency;
            newElement = word + "(" + frequency +")";
            newArray.push(newElement);
            i++;
        }
        return newArray;
    }

    // Return 10 most frequent words
    function returnMostFrequentWords(){
        let arrayOfObjects = fillArrayOfObjects();
        let sorted = arrayOfObjects.sort(function(a,b){return b.frequency - a.frequency ||  a.word.localeCompare(b.word)});
        return adjustFormatting(sorted).slice(0,10);
    }


    //-----------------------------------------------------------------------------------------------------------------
    //
    return {
        nChars: txt.length,
        nWords: returnNWordsAndFillArrayOfWords(txt),
        nLines: returnNLines(txt),
        nNonEmptyLines: returnNNonEmptyLines(txt),
        maxLineLength: returnMaxLineLength(txt),
        averageWordLength: returnAverageWordLength(),
        palindromes: returnPalindromes(),
        longestWords: return10Longest(),
        mostFrequentWords: returnMostFrequentWords()
    };
}




