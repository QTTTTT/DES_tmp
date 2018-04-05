//读取文件
var file_Binary,file_Binary_head;
var filename = document.getElementById('fileId');
filename.addEventListener("change",function(){
var reader = new FileReader();
var img = document.getElementById("img");
reader.readAsDataURL(filename.files[0]);//发起异步请求
reader.onload = function(){
//读取完成后，数据保存在对象的result属性中
img.src = this.result;
}
})


function freadAsBinaryString(){  
    var file = document.getElementById("fileId").files[0];  
    var reader1 = new FileReader();  
    //将文件以文本形式读入页面  
    reader1.readAsText(file,'gb2312');  
    reader1.onload=function(){  
        //var result=document.getElementById("result");  
        //显示文件  
        var tmp=this.result;
        var total2str = "";
        for(var i=0;i<tmp.length;i++){
              var num10 = tmp.charCodeAt(i);  ///< 以10进制的整数返回 某个字符 的unicode编码
              var str2 = num10.toString(2);   ///< 将10进制数字 转换成 2进制字符串

              if( total2str == "" ){
                total2str = '0'+str2;
              }else{
                total2str = total2str +'0'+ str2;
              }
        }
        //result.innerHTML=total2str;  
        file_Binary_head = total2str.substring(0,55);
        file_Binary = total2str.substring(55,total2str.length);
    } 
}  

//64位的秘钥首先根据表格PC-1进行变换。
var PC_1_perm = new Array( -1, 
	57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18,
	10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36,
	63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22,
	14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4 );

//子秘钥有56位，但PC-2仅仅使用其中的48位。
var PC_2_perm = new Array( -1, 
	14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10,
	23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2,
	41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48,
	44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32 );

//对明文数据M，我们计算一个初始变换IP
var IP_perm = new Array( -1,
	58, 50, 42, 34, 26, 18, 10, 2,
	60, 52, 44, 36, 28, 20, 12, 4,
	62, 54, 46, 38, 30, 22, 14, 6,
	64, 56, 48, 40, 32, 24, 16, 8,
	57, 49, 41, 33, 25, 17, 9, 1,
	59, 51, 43, 35, 27, 19, 11, 3,
	61, 53, 45, 37, 29, 21, 13, 5,
	63, 55, 47, 39, 31, 23, 15, 7 );

//Ri-1 32->48
var E_perm = new Array( -1,
	32, 1, 2, 3, 4, 5,
	4, 5, 6, 7, 8, 9,
	8, 9, 10, 11, 12, 13,
	12, 13, 14, 15, 16, 17,
	16, 17, 18, 19, 20, 21,
	20, 21, 22, 23, 24, 25,
	24, 25, 26, 27, 28, 29,
	28, 29, 30, 31, 32, 1 );

//S盒
var S1 = new Array(
	14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7,
	0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8,
	4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0,
	15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13 );
var S2 = new Array(
	15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10,
	3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5,
	0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15,
	13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9 );
var S3 = new Array(
	10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8,
	13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1,
	13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7,
	1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12 );
var S4 = new Array(
	7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15,
	13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9,
	10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4,
	3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14 );
var S5 = new Array(
	2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9,
	14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6,
	4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14,
	11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3 );
var S6 = new Array(
	12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11,
	10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8,
	9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6,
	4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13 );
var S7 = new Array(
	4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1,
	13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6,
	1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2,
	6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12 );
var S8 = new Array(
	13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7,
	1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2,
	7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8,
	2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11 );

var P_perm = new Array( -1,
	16, 7, 20, 21, 29, 12, 28, 17,
	1, 15, 23, 26, 5, 18, 31, 10,
	2, 8, 24, 14, 32, 27, 3, 9,
	19, 13, 30, 6, 22, 11, 4, 25 );

var FP_perm = new Array( -1,
	40, 8, 48, 16, 56, 24, 64, 32,
	39, 7, 47, 15, 55, 23, 63, 31,
	38, 6, 46, 14, 54, 22, 62, 30,
	37, 5, 45, 13, 53, 21, 61, 29,
	36, 4, 44, 12, 52, 20, 60, 28,
	35, 3, 43, 11, 51, 19, 59, 27,
	34, 2, 42, 10, 50, 18, 58, 26,
	33, 1, 41, 9, 49, 17, 57, 25 );




function strToBinary(str){
	var c;
	var total2str = "";
	for(var i=0;i<str.length;i++){
    	  var num10 = str.charCodeAt(i);  ///< 以10进制的整数返回 某个字符 的unicode编码
	      var str2 = num10.toString(2);   ///< 将10进制数字 转换成 2进制字符串

	      if( total2str == "" ){
	      	total2str = '0'+str2;
	      }else{
	      	total2str = total2str +'0'+ str2;
	      }
    }
	return total2str;

}
function binaryToStr(total2str){
	var goal = "";
	var str2 = "";
	var k=0;
	for(var i=0; i < total2str.length; i++){
		if((i+1)%9!=0){
			str2 += total2str[i-k];
		}
    	else{
    		var num10 = parseInt(str2, 2); ///< 2进制字符串转换成 10进制的数字
    		goal += String.fromCharCode(num10); ///< 将10进制的unicode编码, 转换成对应的unicode字符
    		str2="";
    		k++;
    	}
    	
	}
	return goal;
	//console.log('解码后:'+ goal );
}

var bfk //=strToBinary(inputk);

function change64k(beforek){
	if(beforek.length<64){
		while(beforek.length !=64){
			//console.log("自动添加");
			beforek+=0;
		}
	}
	else{
		beforek=beforek.substring(0,64);
	}
	return beforek;
}
var afk //=change64k(bfk);

function getNewKey(key){
	var n;
	var newKey = "";
	for(var i=1;i<57;i++){
		n = PC_1_perm[i];
		newKey +=key[n-1];
	}
	//console.log(newKey);
	return newKey;
}
var newKey //=getNewKey(afk);
var C0 //=newKey.substring(0,28);
var D0 //=newKey.substring(28,56);
//console.log(C0);
//console.log(D0);
var C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13,C14,C15,C16;
var D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14,D15,D16;


function shift_CD_1( CD )
{
	var k="";
   var i;
   var CD0 =CD[0]
   for( i=0; i<=26; i++ )
      k += CD[i+1];
   k += CD0;
   return k;
}

function shift_CD_2( CD )
{
   var i;
   var k = "";
   var CD0 = CD[0];
   var CD1 = CD[1]; 

   for( i=0; i<=25; i++ )
      k += CD[i+2];
   k += CD0;
   k += CD1;
   return k;

}

function getPC2 ( ) {
	var i,j;
	var k,tmp;
	var result = "";
	for(i=1;i<17;i++){
		//var window["CD"+i];	
		window["CD"+i]=window["C"+i]+window["D"+i];
		for (j=1;j<49;j++){
			k =PC_2_perm[j];
			result += window["CD"+i][k-1];
		}
		//console.log(result);
		window["k"+i] = result;
		result = "";

	}
}


var M = "mingwenceshi";
var MtoB = strToBinary(M);
var Mto64B = change64k(MtoB);   
var IP = "";
var L0,R0;


function RiTo48 ( str ) {
	var result="";
	var i,k;
	for(i=1; i<=48; i++){
		k=E_perm[i];
		result += str[k-1];
	}
	return result;
}

function xor (str1,str2){
	var i;
	var result = "";
	for(i=0; i<str1.length; i++){
		if(str1[i]==str2[i]){
			result += "0";
		}else{
			result += "1";
		}
	}
	return result;
}

function f(i){
	var tmpresult;
	var result="";
	window["RR"+i]=RiTo48(window["R"+(i-1)]);
	window["F"+i]=xor(window["RR"+i], window["k"+i]);
	window["P"+i]=S_box(window["F"+(i)],i,0);
	for(var ptmp = 0; ptmp<32; ptmp++){
		tmpresult = P_perm[ptmp+1];
		window["FF"+i] +=window["P"+i][tmpresult-1];
	}
	result = xor(window["FF"+i],window["L"+(i-1)]);
	return result;
}

function f_back(i){
	var tmpresult;
	var result = "";
	window["ecbRR"+i]=RiTo48(window["ecbR"+(i-1)]);
	window["ecbF"+i]=xor(window["ecbRR"+i], window["k"+(17-i)]);
	window["ecbP"+i]=S_box(window["ecbF"+(i)],i,1);
	window["ecbFF"+i]="";
	for(var ptmp = 0; ptmp<32; ptmp++){
		tmpresult = P_perm[ptmp+1];
		window["ecbFF"+i] +=window["ecbP"+i][tmpresult-1];
	}
	result = xor(window["ecbFF"+i],window["ecbL"+(i-1)]);
	return result;
}

function S_box( str , i ,flag){
	var tmp,row,col,ws,bin2;
	var result = "";
	for(tmp=1; tmp<=8; tmp++){
		if(flag == 0)
		window["D"+i] = window["F"+(i)].substring(6*(tmp-1),6*tmp);
		else window["D"+i] = window["ecbF"+(i)].substring(6*(tmp-1),6*tmp);		
		row = parseInt(window["D"+(i)][0]+window["D"+(i)][5] , 2); 
		col = parseInt(window["D"+(i)][1]+window["D"+(i)][2]+window["D"+(i)][3]+window["D"+(i)][4] , 2); 
		ws = row * 16 + col; 
		bin2 = window["S"+tmp][ws].toString(2);
		for(var r = bin2.length; r < 4; r++) {
           bin2 = "0"+bin2;
        }
        result += bin2;
        //console.log(bin2+" "+i +" "+tmp);
	}
	//console.log(result+" "+i);
	return result;
}

function change_FP( beforeFP ){
	var final_tmp;
	var result="";
	for(var tmpk=0; tmpk<beforeFP.length; tmpk++){
		final_tmp = FP_perm[tmpk+1];
		result += beforeFP[final_tmp-1];
	}
	return result;
}

var ECB_Bin_result;
var IV;

function encode_ECB(flag){
	var kkk=document.getElementById('key').value;
	bfk=strToBinary(kkk);
	afk=change64k(bfk);
	newKey=getNewKey(afk);
	C0=newKey.substring(0,28);
    D0=newKey.substring(28,56);
    for(var i=1; i<=16; i++ )
	{
		if ( i==1 || i==2 || i==9 || i == 16 ){
		    window["C"+i]=shift_CD_1(window["C"+(i-1)]);
		    window["D"+i]=shift_CD_1(window["D"+(i-1)]);
		}

		else{
		    window["C"+i]=shift_CD_2(window["C"+(i-1)]);
		    window["D"+i]=shift_CD_2(window["D"+(i-1)]);
		}

	}
	getPC2(); //ki

	var ecbtmp;
	var codeblocks;
	IV = '0110110001101001011101010111001001110101011010010110100001100001'; //伪随机
	codeblocks = Mto64B;
	if(flag==0) {
			codeblocks = xor(codeblocks,IV);
	}
	//codeblocks = '0110110001101001011101010111001001110101011010010110100001100001';
	IP = "";
	for(var a=1; a<=64; a++){
		var tmp = IP_perm[a];
		IP += codeblocks[tmp-1];
	}
	//!!!!!!!IP = codeblocks;
	//console.log("IP变换后明文"+IP);
	L0 = IP.substring(0,32);
	R0 = IP.substring(32,64);
	for(var a=1; a<=16; a++){
		var tmpresult;
		window["FF"+a]="";
		window["L"+a]=window["R"+(a-1)];
		window["R"+a] = f(a);
	}
	var change_LR = R16+L16;
	var final_result = change_FP(change_LR);
	//!!!!!!!final_result = change_LR;
	//console.log(final_result);
	ECB_Bin_result =final_result;     //文件头没加
	IV = final_result;
	if(flag==1){
    	document.getElementById('deent_button').hidden = false;
    	document.getElementById('deent_img').hidden = false;
	}
	else {
		document.getElementById('decbt_button').hidden = false;
		document.getElementById('decbt_img').hidden = false;
	}
}
var de_ECB_Bin
var ecbR0,ecbL0;
function decode_ECB(flag){
	var detmp;
	var codeblocks="";
	var deresult="";
	ECB_Bin_result=ECB_Bin_result.substring(55,ECB_Bin_result.length);
	for(demp=0;detmp<ECB_Bin_result/64;demp+=64){
		if(decb<ECB_Bin_result.length/64 -1){
			codeblocks = ECB_Bin_result.substring(decb*64,(decb+1)*64);
		}
		else {
			codeblocks = ECB_Bin_result.substring(decb*64, ECB_Bin_result.length);
		}
		if(flag==0) {
				codeblocks = xor(codeblocks,IV);
		}
	

		de_ECB_Bin = ECB_Bin_result;
		var codeblocks = "";
		for(var a=1; a<=64; a++){
				var tmp = IP_perm[a];
				codeblocks += de_ECB_Bin[tmp-1];
		}
		ecbL0 = codeblocks.substring(0,32);
		ecbR0 = codeblocks.substring(32,64);
		for(var a=1;a<=16;a++){
			window["ecbL"+a]=window["ecbR"+(a-1)];
			window["ecbR"+a] = f_back(a);
		}
		var ecbIP = ecbR16+ecbL16;
		ecbIP = change_FP(ecbIP);	
		console.log(ecbIP);
		deresult+=ecbIP;
	}
	/* 放进文件failed */
	if(flag==1){
    	document.getElementById('deent').hidden = false;
    	document.getElementById('deent').src = document.getElementById('img').src;
	}
	else {
		document.getElementById('decbt').hidden = false;
		document.getElementById('decbt').src = document.getElementById('img').src;
	}
}

function snowbeng(){
	var tmpnum;
	var str1,str2;
	var random_number="";
	for(var tmp=0;tmp<63;tmp++){
		tmpnum = parseInt(Math.random()*2,10);
		random_number+=tmpnum;
	}
	str1 = random_number +'0';
	str2 = random_number +'1';
	Mto64B = str1;
	encode_ECB(1);
	for(tmp=1; tmp<=16; tmp++){
		window["str1LR"+tmp] = window["L"+tmp]+window["R"+tmp];
	}
	Mto64B = str2;
	encode_ECB(1);
	for(tmp=1; tmp<=16; tmp++){
		window["str2LR"+tmp] = window["L"+tmp]+window["R"+tmp];
	}
	for(var i=1;i<=16;i++){
		window["count"+i] = 0;
		for(tmp=0; tmp<64; tmp++){
			if(window["str1LR"+i][tmp]!=window["str2LR"+i][tmp])
				window["count"+i]++;
		}
		console.log("第"+i+"轮加密后，不同位数为："+window["count"+i]);
	}
	
}
function S1box(str){
	var row,col,ws,bin;
	row = parseInt(str[0]+str[5] , 2); 
	col = parseInt(str[1]+str[2]+str[3]+str[4] , 2); 
	ws = row * 16 + col; 
	bin = S1[ws].toString(2);
	return bin;
}
var cfArray = new Array();
for(var arrtmp=0;arrtmp<16;arrtmp++){
	cfArray[arrtmp] = new Array(); 
	for(var arrtmpj=0;arrtmpj<64;arrtmpj++){   //一维数组里面每个元素数组可以包含的数量p，p也是一个变量；
		cfArray[arrtmp][arrtmpj]=0;  
	}
}

function chafen(){
	var test1,test2;
	var cf1,cf2;
	var cfw,cfx,cfy,cfz;
	var row,col;
	for(cfw=0; cfw<64; cfw++){
		for(cfx=0; cfx<64; cfx++){
			cf1 =cfw.toString(2);
    		while(cf1.length<6){
        		cf1='0'+cf1;
    		}
		    cf2 =cfx.toString(2);
		    while(cf2.length<6){
		        cf2='0'+cf2;
		    }
			cfy = xor(cf1,cf2);
			test1=S1box(cf1);
			while(test1.length<6){
        		test1='0'+test1;
    		}
			test2=S1box(cf2);
			while(test2.length<6){
        		test2='0'+test2;
    		}
			cfz = xor(test1,test2);
			row=parseInt(cfy , 2); 
			col=parseInt(cfz , 2);
			cfArray[col][row]++;
		}

	}
}

var S_random = new Array(16);
function randomS_box(){
	var numberk = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15);
	var randomS_tmp,scount;	
	scount = 0;
	do{
		var k0=parseInt(Math.random()*16,10);
		if(numberk[k0]==-1) continue;
		else S_random[scount]=k0;
		numberk[k0]=-1;
		scount++;
	}while(scount!=16);
	return S_random;
}
function turn16(){
	var turnx =0;
	var turny,turnz;
	for(turnx=1;turnx<=8;turnx++){
		for(turny=0;turny<4;turny++){
			randomS_box();
			for(turnz=0;turnz<16;turnz++){
				window["S"+turnx][turny*16+turnz]=S_random[turnz];
			}
		}
	}
}
function xianxing16(){
	var numberk = new Array(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15);
	var turnz,turnx,turny;
	for(turnx=1;turnx<=8;turnx++){
		for(turny=0;turny<4;turny++){
			for(turnz=0;turnz<16;turnz++){
				window["S"+turnx][turny*16+turnz]=turnz;
			}
		}
	}
}
var count1,count0;
count1=0;
count0=0;
function integrity(){
	var intx,inty,intz;
	for(intx=0;intx<256;intx++){
		Mto64B = "0";
		for(inty=0;inty<63;inty++){
			var k0=parseInt(Math.random()*2,10);
			Mto64B+=k0;
		}
		encode_ECB(1);
		for(intz=0;intz<64;intz++){
			if(ECB_Bin_result[intz]==0) count0++;
			else count1++;
		}
	}
}