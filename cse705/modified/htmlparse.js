const fs = require('fs');
const htmlparser2 = require('htmlparser2');
const html = require('htmlparser-to-html');
//var DomParser = require('dom-parser');
var path = require('path');

//var parser = new DomParser();


input_file_with_path = 'Y40_80.html';
output_file_with_path = 'Y40_80_trns.html';
var html_str = fs.readFileSync(input_file_with_path, 'utf-8');
var handler = new htmlparser2.DomHandler();
var HTMLparser = new htmlparser2.Parser(handler);
HTMLparser.parseComplete(html_str);

var classMap = {};

var walkDOM = function(node, isInitialNode, func, final) {
	if(isInitialNode) node = initialize(node);
	func(node);

	node = (node.hasOwnProperty('children'))
		? node.children[0]
		: null;

	while (node) {
	    walkDOM(node, false, func);
	    node = node.next;
	}
	if(typeof(final) == 'function') final();
};

var initialize = function(node){
	return {
		name: 'initial',
	    data: 'initial',
	    type: 'initial',
	    children: node,
	    next: null,
	    prev: null,
	    parent: null
	}
}

walkDOM(handler.dom, true, function(node){
    if (node.attribs) {
        let attribNodeArray = [];
        if(node.attribs.class)
        {
            let attribArray = node.attribs.class.split(' ');
            attribArray.forEach(resp => {
                if (resp) {
                    if (resp in classMap) {
                        attribNodeArray.push(classMap[resp]);
                    }
                    else {
                        attribNodeArray.push(randomClassGen());
                        classMap[resp] = randomClassGen();
                    }
                }
            });

            node.attribs.class = attribNodeArray.toString();
        }
    }
  }, function(){
    var randomized = html(handler.dom);
            try {
                fs.writeFileSync(input_file_with_path, randomized);
            }
            catch (err) { console.log(err); }
  });

  console.log(classMap);
  var dir = 'Y40_80_files';
  fs.readdir(dir, function(err, files){
    if(err) console.log(err);
    filesList = files.filter(function(e){
      return path.extname(e).toLowerCase() === '.css'
    });
    
    filesList.forEach(file =>{
        var file_path = dir + '\\'+ file;
        var css_str = fs.readFileSync(file_path, 'utf-8');
        var regex = new RegExp(/(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\{\>#\:]{1})/igm);
        css_str.match(regex).forEach(m =>{
            var str = m.replace('.', "");
            if (str.trim() in classMap) {
                css_str = css_str.replace(str, classMap[str.trim()]);
            }
        });
        fs.writeFileSync(file_path, css_str);
    })
    
  });
  

function randomClassGen() {
    return 'rand-class-' + Math.floor(1000 + Math.random() * 9000);
}




