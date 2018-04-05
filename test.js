/*var http = require('http');
http.createServer(function (request, response) {

    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // 发送响应数据 "Hello World"
    response.end('Hello World\n');
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');*/

var fs = require("fs");

var data = fs.readFileSync('t.bmp').toString();
var data_Bin = "";
        for(var i=0;i<data.length;i++){
              var num10 = data.charCodeAt(i);  ///< 以10进制的整数返回 某个字符 的unicode编码
              var str2 = num10.toString(2);   ///< 将10进制数字 转换成 2进制字符串

              if( data_Bin == "" ){
                data_Bin = '0'+str2;
              }else{
                data_Bin = data_Bin +'0'+ str2;
              }
        }
        file_Binary_head = data_Bin.substring(0,55);
        file_Binary = data_Bin.substring(55,data_Bin.length);
    var writeStream = fs.createWriteStream("outInput.bmp");
    //使用utf-8写入流    
    writeStream.write(file_Binary_head+file_Binary, "UTF8");
    //标记文件末尾
    writeStream.end();
    //处理事件流    
    writeStream.on("finish", () => console.log("写入完成")); 
    writeStream.on("error", err => console.log(err.stack));   
    console.log("程序2执行完毕");
//console.log(file_Binary_head);
console.log("程序执行结束!");

/*
var data = '';
// 创建一个可读流
var readerStream = fs.createReadStream('t.bmp');

// 创建一个可写流
var writerStream = fs.createWriteStream('output.bmp');

readerStream.pipe(writerStream);*/