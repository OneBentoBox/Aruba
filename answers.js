                  
    console.log("Ready to roll");
    
    // **********************
    // **** Answer to 1a ****
    // **********************
    
    $("#1a-submit").click(function(){
        var enteredIP = $("#1a-input").val();
                      
        if(verifyIP(enteredIP)){
            $("#1a-result").html("<strong>"+enteredIP+"</strong>" + " is a VALID IPv4 address").css({"color":"green"});
        }else{
            $("#1a-result").html("<strong>"+enteredIP+"</strong>"  + " is an INVALID IPv4 address").css({"color":"red"});
        }
    });
                  
    function verifyIP(inputIP){
        // ipaddr will be passed from text field, which has to be a string.
        
        var pattern = /^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/,
            ip_addr = new String(inputIP);

        if((!(ip_addr.match(pattern)) == false)){
            return true;  // Valid IP address form and range
        }else{
            return false;    // Invalid IP address form and range
        }
    };
    
    
    // **********************
    // **** Answer to 1b ****
    // **********************

    $("#1b-submit").click(function(){
       var enteredIP = $("#1b-input").val(), convertedIP=0;;
        if(verifyIP(enteredIP)){
            convertedIP = convertIPtoInt(enteredIP);
            if(!convertedIP){
                $("#1b-result").html("Error Converting <strong>"+enteredIP+"</strong>"  + " to 32bit Integer").css({"color":"red"});
            };
            $("#1b-result").html("<strong>"+enteredIP+"</strong>" + " is converted to <strong>"+convertedIP+"</strong>").css({"color":"green"});
        }else{
            $("#1b-result").html("<strong>"+enteredIP+"</strong>"  + " is an INVALID IPv4 address").css({"color":"red"});
        }
    });
    
    function convertIPtoInt(inputIP){
        var pattern =  /^([0-9]{0,3})\.([0-9]{0,3})\.([0-9]{0,3})\.([0-9]{0,3})$/,
            ip_addr = new String(inputIP),
            parsedIP = ip_addr.match(pattern),
            tempOctet = "",
            tempBinary = "";

        if((!(parsedIP) == false)){
            console.log(parsedIP);
            for(var i=1; i<5; i++){
                tempOctet = parseInt(parsedIP[i]).toString(2);
                if(tempOctet.length != 8){
                    for(var j=0; j<9; j++){
                        tempOctet = "0" + tempOctet;
                        if(tempOctet.length == 8) break;
                    }
                }
                tempBinary += tempOctet;
            };
            return parseInt(tempBinary,2);  // Valid IP address form and range
        }else{
            return false;    // Invalid IP address form and range
        }
    };
    
    // **********************
    // ****** 2a Answer *****
    // **********************

    document.getElementById('2a-fileinput').addEventListener('change', process2aAnswer, false);

    function process2aAnswer(evt){
        var f = evt.target.files[0];
        readSingleFile(f,"#2a-filedisplay","#2a-result");
    }
    
    function readSingleFile(f,filedisplay,resultdisplay) {
      //Retrieve the first (and only!) File from the FileList object
        var lowestSumPath = ""; 
  
        if(f){
            jQuery.get(f.name, function(data) {
                lowestSumPath = findLowestSumPath(data);
                if(filedisplay){
                    $(filedisplay).html("<pre>" + data + "</pre>").css({"border-width":"1px"});
//                    $("#"+filedisplay).html("<div id=\""+filedisplay+"\"><pre>" + data + "</pre></div>").css({"border-width":"1px"});
                }
                if(resultdisplay){
                    $(resultdisplay).html("Lowest Sum = " +
                                     lowestSumPath.data.sum + "</br>Lowest Sum Path = " +
                                     lowestSumPath.data.path.toString() +"</br>"
                                     );
                }
            });
        //  Note:   FileReader API does not work on Safari. Use 
        //if (f) {
        //    var r = new FileReader();
        //    r.onload = function(e) { 
        //            var contents = e.target.result;
        //      //alert( "Got the file.n" 
        //      //      +"name: " + f.name + "n"
        //      //      +"type: " + f.type + "n"
        //      //      +"size: " + f.size + " bytesn"
        //      //      + "starts with: " + contents.substr(1, contents.indexOf("n"))
        //      //);
        //          $("#2a-result").html("<pre>"+contents+"</pre>");
        //          findLowestSum(contents);
        //    }
        //    r.readAsText(f);
        //    r.readAsArrayBuffer(f);
        } else { 
            alert("Failed to load file");
        }
    };
    
    function findLowestSumPath(contents){
        
        var restOfContents = contents,
            oneString = "",
            regexpArray = [],
            parsedItems = [],
            pathArray = [],
            lowestSumPath = false,
            tempPath = "",
            i=0;
            
        if(contents.length < 1){
            return {response: false, message: "No Content in File"};
        }
        restOfContents = restOfContents.trim();
        restOfContents = restOfContents + "\n";

        do{
            firstNewline = restOfContents.indexOf("\n");
            oneString = restOfContents.slice(0,firstNewline);
            restOfContents = restOfContents.slice(firstNewline+1);
            parsedItems = [];
            
            do{
		regexpArray = oneString.match(/^\s*([0-9]{0,5})\s*\n*(.*)$/);
                parsedItems.push(regexpArray[1]);
		oneString = regexpArray[2];
            }while(!oneString == false);
            
            console.log("New Line Parsed: " + parsedItems.toString());
            
            if(parsedItems.length < 1){
                console.log("Error: File contains blank line.");
                return {response: False, message: "File contains blank line."}; 
            }
            
            if(parsedItems.length == 1){

                pathArray.push(
                        {
                            path : parsedItems[0],
                            lastPos: 0,
                            sum: parseInt(parsedItems[0])
                        });
                lowestSumPath = pathArray[0];
                console.log("path : "+pathArray[0].path + "   lastPos : " + pathArray[0].lastPos);
            }

            if(parsedItems.length > 1){
                
                for(i=0, limit = pathArray.length; i<limit; i++){
                    tempPath = pathArray.shift();
                    pathArray.push(
                            {
                                path: tempPath.path + "," + parsedItems[tempPath.lastPos],
                                lastPos: tempPath.lastPos,
                                sum: tempPath.sum + parseInt(parsedItems[tempPath.lastPos])
                            },
                            {
                                path: tempPath.path + "," + parsedItems[tempPath.lastPos + 1],
                                lastPos: tempPath.lastPos + 1,
                                sum: tempPath.sum + parseInt(parsedItems[tempPath.lastPos + 1])
                            });
                    

                    
                    console.log("Added -- path : "+pathArray[pathArray.length - 2].path + "   lastPos : " + pathArray[pathArray.length - 2].lastPos + " sum : " + pathArray[pathArray.length - 2].sum);                    
                    console.log("Added -- path : "+pathArray[pathArray.length - 1].path + "   lastPos : " + pathArray[pathArray.length - 1].lastPos + " sum : " + pathArray[pathArray.length - 1].sum);
                }
            }
            
            
        }while(!restOfContents == false);

        for(i=1, lowestSumPath = pathArray[0]; i<pathArray.length; i++){
            if(isNaN(pathArray[i].sum)){
               return {response: False, message: "NaN in one of the path."}; 
            }
            lowestSumPath = lowestSumPath.sum <= pathArray[i].sum? lowestSumPath: pathArray[i];
        }
        // Go through pathArray to add up the sum of each path and find the path with lowest sum.
        console.log("lowestSumPath -");
        console.log("   path : "+ lowestSumPath.path.toString());
        console.log("   sum : " + lowestSumPath.sum);
        
        return {response: true, message: "", data: lowestSumPath};
    };
    

    // **********************
    // ****** 2b Answer *****
    // **********************
    
    $("#2b-submit").click(process2bInput);
    
    function process2bInput(){
        var enteredNum = parseInt($("#2b-filelength").val()),
            randomnumber = 0,
            fileContent = "",
            result = "";
            
        if(isNaN(enteredNum)){
            $("#2b-filedisplay").html("Invalid Number Format Entered").css({"color":"red"});
            return;
        }
        
        if((enteredNum<1)||(enteredNum>10)){
            $("#2b-filedisplay").html("Invalid Number Range Entered").css({"color":"red"});
            return;
        }
        
        for(var i=1, limit=enteredNum+1; i<limit; i++){
            
            for(var j=0, upperBound = 301; j<i; j++){
                randomnumber = Math.floor(Math.random()* upperBound)
                fileContent += randomnumber + "\t";
            }
            fileContent += "\n";
            console.log(fileContent);
        }
        
        result = findLowestSumPath(fileContent);
        
        $("#2b-filedisplay").html("<div id=\"2a-filedisplay\"><pre>" + fileContent + "</pre></div>").css({"border-width":"1px","color":"black"});
        $("#2b-result").html("Lowest Sum = " +
                             result.data.sum + "</br>Lowest Sum Path = " +
                             result.data.path.toString() +"</br>"
                             );
    };   
                

