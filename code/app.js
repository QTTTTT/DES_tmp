const fs = require('fs');
const string_decoder = require('string_decoder');
const bmp = require('./bmp-js');
const des = require('./des');




function readBmpFromFile(fileName) {
  var file = fs.readFileSync(fileName);
  return bmp.decode(file);
}

function writeBmpToFile(fileName,content){
	var file = bmp.encode(content);
	fs.writeFileSync(fileName,file.data);
	return file;
}

function stringToHex(s) {
  var r = "0x";
  var hexes = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
  for (var i = 0; i < s.length; i++) {
    r += hexes[s.charCodeAt(i) >> 4] + hexes[s.charCodeAt(i) & 0xf];
  }
  return r;
}

function hexToString(h) {
  var r = "";
  for (var i = (h.substr(0, 2) == "0x") ? 2 : 0; i < h.length; i += 2) {
    r += String.fromCharCode(parseInt(h.substr(i, 2), 16));
  }
  return r;
}

function randomPlainText(length) {
  var Alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var le = Alphabet.length;
  var plaintext = '';
  for(var i=0;i<length;i++){
    plaintext += Alphabet[Math.floor(Math.random()*le)];
  }
  return plaintext;
}



function desTest(){
	var key = "this is a 24 byte key !!";
	var message = "12345678";
	console.log('明文：'+message);
	var ciphertext = des.encode(key,message,'ecb');
	console.log('ECB模式加密密文：'+ stringToHex(ciphertext));
	var plaintext = des.decode(key,ciphertext,'ecb');
	console.log('ECB模式解密明文：'+plaintext);
	ciphertext = des.encode(key,message,'cbc','00000000');
	console.log('CBC模式加密密文：'+ stringToHex(ciphertext));
	plaintext = des.decode(key,ciphertext,'cbc','00000000');
	console.log('CBC模式解密明文：'+plaintext);
	console.log('加密解密完成！')
}



//加密解密bmp文件
function endecodeBMP(){
	var key = "this is a 24 byte key !!";

	//ecb 模式
	var file = readBmpFromFile('../test1.bmp');
 	file = des.encodeBMP(key,file,'ecb');
 	writeBmpToFile('ecb加密后的1.bmp',file);
	file = des.decodeBMP(key,file,'ecb');
	writeBmpToFile('ecb解密后的1.bmp',file);


	//cbc 模式
	var file = readBmpFromFile('../test1.bmp');
 	file = des.encodeBMP(key,file,'cbc');
 	writeBmpToFile('cbc加密后的1.bmp',file);
	file = des.decodeBMP(key,file,'cbc');
	writeBmpToFile('cbc解密后的1.bmp',file);
	console.log('加密解密完成！');
}


endecodeBMP();