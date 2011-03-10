/*!
 * jsPOS
 *
 * Copyright 2010, Percy Wegmann
 * Licensed under the GNU LGPLv3 license
 * http://www.opensource.org/licenses/lgpl-3.0.html
 */

module.exports = Lexer;

function LexerNode(string, regex, regexs){
	this.string = string;
    this.children = [];
	if (string) {
		this.matches = string.match(regex);
		var childElements = string.split(regex);
	}
	if (!this.matches) {
		this.matches = [];
		var childElements = [string];
	}
	if (regexs.length > 0) {
        var nextRegex = regexs[0];
		var nextRegexes = regexs.slice(1);
		for (var i in childElements) {
			this.children.push(new LexerNode(childElements[i], nextRegex, nextRegexes));
        }
    }
    else {
        this.children = childElements;
    }
}

LexerNode.prototype.fillArray = function(array){
    for (var i in this.children) {
        var child = this.children[i];
        if (child.fillArray) 
            child.fillArray(array);
        else if (/[^ \t\n\r]+/i.test(child))
            array.push(child);
        if (i < this.matches.length) {
			var match = this.matches[i];
			if (/[^ \t\n\r]+/i.test(match))
                array.push(match);
        }
    }
}

LexerNode.prototype.toString = function(){
    var array = [];
    this.fillArray(array);
    return array.toString();
}

function Lexer(){
	// Split by numbers, then whitespace, then punctuation
    this.regexs = [/[0-9]*\.[0-9]+|[0-9]+/ig, /[ \t\n\r]+/ig, /[\.\,\?\!]/ig];
}

Lexer.prototype.lex = function(string){
	var array = [];
    var node = new LexerNode(string, this.regexs[0], this.regexs.slice(1));
    node.fillArray(array);
    return array;
}

//var lexer = new Lexer();
//print(lexer.lex("I made $5.60 today in 1 hour of work.  The E.M.T.'s were on time, but only barely.").toString());
