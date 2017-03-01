/**
 * WebCli
 */
/// <reference path="../typings/lib.d.ts" />

class WebCli {
    history   = [];
    cmdOffset = 0;

    ctrlEl;
    outputEl;
    inputEl;

    constructor(parameters) {
        let self = this;

        self.createEleents();
        self.wireEvents();
        self.showGreeting();
    }

    wireEvents()
    {
        let self = this;

        let keyDownHandler = function(e) { self.onKeyDown(e); };
        let  clickHandler   = function(e) { self.onClick(); };

        document.addEventListener('keydown', keyDownHandler);
        self.ctrlEl.addEventListener('click', clickHandler);
    }
    onClick()
    {
        this.focus();
    }
    focus()
    {
        this.inputEl.focus();
    }

    onKeyDown(e)
    {
        let self = this, ctrlStyle = self.ctrlEl.style;

        //Ctrl + Backquote (Document)
        if(e.ctrlKey && e.keyCode == 192)
        {
            if(ctrlStyle.display == "none")
            {
                ctrlStyle.display = "";
                self.focus();
            }
            else
            {
                ctrlStyle.display = "none";
            }
            return;
        }
        
        //Other keys (when input has focus)
        if (self.inputEl === document.activeElement)
        {
            switch(e.keyCode)  //http://keycode.info/
            {
                case 13: //Enter
                    return self.runCmd();

                case 38: //Up
                    if((self.history.length + self.cmdOffset) > 0)
                    {
                        self.cmdOffset--;
                        self.inputEl.value = self.history[self.history.length + self.cmdOffset];
                        e.preventDefault();
                    }
                    break;

                case 40: //Down
                    if(self.cmdOffset < -1)
                    {
                        self.cmdOffset++;
                        self.inputEl.value = self.history[self.history.length + self.cmdOffset];
                        e.preventDefault();
                    }
                    break;
            }
        }
    }
    runCmd()
    {
        let self = this, txt = self.inputEl.value.trim();

        self.cmdOffset = 0;         //Reset history index
        self.inputEl.value = "";    //Clear input
        self.writeLine(txt, "cmd"); //Write cmd to output
        if(txt === "") { return; }  //If empty, stop processing
        self.history.push(txt);     //Add cmd to history

        //Client command:
        let tokens = txt.split(" "),
            cmd    = tokens[0].toUpperCase();

        if(cmd === "CLS") { self.outputEl.innerHTML = ""; return; }
        if(cmd === "HELP") { self.listAllCommand(); return; }
        if(cmd === "ECHO") { 
            if(tokens[1]){
                self.writeLine(tokens[1],"ok");
            }
            return; }
        if(cmd === "CAT") { self.writeHTML("<img src='https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?w=470&h=325&auto=compress&cs=tinysrgb'>"); return; }

        self.writeLine( "'" + tokens[0] + "' is not recognized as a command", "error");
    }

    listAllCommand(){
        // should be use document.createElement in the future, but using string instead.
        let table = "<table>" +
                    "<tr>" +
                        "<td class='webcli-ok'>" + "help" + "</td>" + 
                         "<td>:</td>" + 
                         "<td class='webcli-val'>" + "list all available commands" + "</td>" +
                    "</tr>" +
                    "<tr>" +
                         "<td class='webcli-ok'>" + "echo" + "</td>" + 
                         "<td>:</td>" + 
                         "<td class='webcli-val'>" + "echo a string" + "</td>" +
                    "</tr>" +
                    "<tr>" +
                         "<td class='webcli-ok'>" + "cat" + "</td>" + 
                         "<td>:</td>" + 
                         "<td class='webcli-val'>" + "display a cat image in console" + "</td>" +
                    "</tr>" +
                    "<tr>" +
                         "<td class='webcli-ok'>" + "cls" + "</td>" + 
                         "<td>:</td>" + 
                         "<td class='webcli-val'>" + "clear console" + "</td>" +
                    "</tr>" + 
                    "<table/>";
        this.writeHTML(table);
        this.writeLine("all commands are NOT case sensitive", "ok");
        this.newLine();
    }
    
    scrollToBottom()
    {
        this.ctrlEl.scrollTop = this.ctrlEl.scrollHeight;
    }

    newLine()
    {
        this.outputEl.appendChild(document.createElement("br"));
        this.scrollToBottom();
    }

    writeLine(txt, cssSuffix)
    {
        let span = document.createElement("span");
        cssSuffix = cssSuffix || "ok";
        span.className = "webcli-" + cssSuffix;
        span.innerText = txt;
        this.outputEl.appendChild(span);
        this.newLine();
    }

    writeHTML(markup)
    {
        let div = document.createElement("div");
        div.innerHTML = markup;
        this.outputEl.appendChild(div);
        this.newLine();
    }

    showGreeting()
    {
        this.writeLine("Type help for list of available commands", "cmd");
        this.newLine();
    }
    createEleents(){
        let self = this, doc = document;
        //Create & store CLI elements
        self.ctrlEl   = doc.createElement("div");   //CLI control (outer frame)
        self.outputEl = doc.createElement("div");   //Div holding console output
        self.inputEl  = doc.createElement("input"); //Input control

        //Add classes
        self.ctrlEl.className   = "webcli";
        self.outputEl.className = "webcli-output";
        self.inputEl.className  = "webcli-input";
        
        //Add attribute
        self.inputEl.setAttribute("spellcheck", "false");

        //Assemble them
        self.ctrlEl.appendChild(self.outputEl);
        self.ctrlEl.appendChild(self.inputEl);
        
        //Hide ctrl & add to DOM
        self.ctrlEl.style.display = "none";
        doc.body.appendChild(self.ctrlEl);
        
    }
}