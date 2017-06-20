/*jshint undef: false, unused: false*/
/*globals w:true, h:true, loader:true, ultimo:true, txt:true, clickTime:true, moveScrollPasso:true, moveScrollObject:true, moveScrollLimit:true, moveScrollTempo:true, moveScrollInicio:true, showTxt:true, controle:true, stage:true, canvas:true, rybCtn:true, controlsCtn:true, loadCtn:true, coverCtn:true, sSCds:true, sSIcons:true, sSBgs:true, sSFgs:true, jukeBox:true, txt:true, CDS, PRECO_MUSICA, PRECO_ALBUM, CHAO_H, CHAO_COLOR, SOL_RADIUS, GAME_WIDTH, GAME_HEIGHT, BUILDINGS, ICON_MARGIN, WINDOW_WIDTH, WINDOW_HEIGHT, ITENS, MARGEM_TEXTO, MARGEM_GAME, MANIFEST, numeroDeFaixas, CD_SCALE, CD_SCALE_X, CD_SCALE_Y, CD_FATOR_X, CD_FATOR_Y, BORDA_BTN,gameScnX, gameScnY, scaleScn:true, adjustW:true, adjustH:true, adjustA:true, rodaTela:true,meuJukebox, posicaoAtual, tocando, CDAtual, faixaAtual, origemRybCtn:true, origemControlsCtn:true, lock, CdsXML, TxtXML,my_media,initApp,createjs,testColor,window,doClose,rybApp,*/

function rybApp() {
    //"use strict";
	//alert("rybApp");
	drawGameScreen();
    drawControlScreen();
	initApp();
}

function drawGameScreen() {
	//"use strict";
	drawTxt("\ndrawGameScreen "+w+" , "+h+" CD Atual "+"#"+CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue,true);
    //alert("drawGameScreen "+CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue);
	rybCtn.regX = GAME_WIDTH * 0.5;
	rybCtn.regY = GAME_HEIGHT * 0.5;
	setLimits(rybCtn);
	var _bg = new createjs.Shape();
	_bg.graphics.beginFill("#"+CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue).drawRect(0,0, GAME_WIDTH, GAME_HEIGHT);
	_bg.name = "bg";	
	rybCtn.addChild(_bg);
	drawSsImg(rybCtn,"fundo",sSBgs,CdsXML.getElementsByTagName("id")[CDAtual].firstChild.nodeValue,0,rybCtn.maxY,1);
    drawBase(rybCtn,CDAtual);
    drawJukebox();
    drawSsImg(rybCtn,"frente",sSFgs,CdsXML.getElementsByTagName("id")[CDAtual].firstChild.nodeValue,0,rybCtn.maxY,1);
	//alert(CDAtual+"\n"+faixasDJ.length);
	if(CDAtual === 0){
		if(faixasDJ.length > 0){
			//alert("Existe Música");
            drawFaixa(rybCtn,faixasDJ[faixaAtual].nome);
		}else{
			//alert("DJ Vazio");
		}
	} else {
        //numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual-1].firstChild.nodeValue);
        //faixaAtual = Math.floor((CDAtual-1)*numeroDeFaixas);
		drawFaixa(rybCtn,CdsXML.getElementsByTagName("nome")[faixaAtual].firstChild.nodeValue);
		//alert("drawGameScreen faixaAtual: "+faixaAtual);
	}
}

function drawFaixa(_o,_n){
	setLimits(_o);
	var _faixa = new createjs.Text(_n, "35px Arial", "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue);
	_faixa.name = "faixa";
	_faixa.regX = _faixa.getBounds().width* 0.5;
	_faixa.regY = _faixa.getBounds().height* 0.5;
	_faixa.scaleX = _faixa.scaleY = scaleRes;
	if(_o.getChildByName("faixa") !== null){
		drawTxt(_o.getChildByName("faixa").x,false);
		_faixa.x = _o.getChildByName("faixa").x;
		_faixa.y = _o.getChildByName("faixa").y;
		_o.removeChild(_o.getChildByName("faixa"));
		_o.removeChild(_o.getChildByName("baseFaixa"));
	} else {
		_faixa.y = _o.maxY - _faixa.getBounds().height * 0.5 * scaleRes - GAME_HEIGHT*0.03;
		//_faixa.x = (_o.maxX - _o.minX) * 0.5;
        _faixa.x = GAME_WIDTH * 0.5;
	}
	var _baseFaixa = new createjs.Shape();
	_baseFaixa.graphics.beginFill("#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue).drawRoundRect(_faixa.x - (_faixa.getBounds().width * scaleRes + GAME_HEIGHT*0.04) * 0.5, _faixa.y - (_faixa.getBounds().height * scaleRes + GAME_HEIGHT*0.02)* 0.5, _faixa.getBounds().width * scaleRes + GAME_HEIGHT*0.04, _faixa.getBounds().height * scaleRes + GAME_HEIGHT*0.02, GAME_HEIGHT*0.01, GAME_HEIGHT*0.01);
    _baseFaixa.name ="baseFaixa";
	_o.addChild(_baseFaixa,_faixa);
}

function drawControlScreen() {
	//"use strict";
	drawTxt("\ndrawControlScreen",true);
    //alert("drawControlScreen");
    var _cor = "#fff";
	if(testColor(CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue) === "black") {
        if(testColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue) === "white"){
            _cor = "#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue;
        } else {
            _cor = "#000";
        }
    }
    
    if(CDAtual === 7){_cor = "#fff";}
    if(CDAtual === 10){_cor = "#"+CdsXML.getElementsByTagName("out")[CDAtual].firstChild.nodeValue;}
    if(CDAtual === 12){_cor = "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue;}
    
    controlsCtn.regX = GAME_WIDTH * 0.5;
	controlsCtn.regY = GAME_WIDTH * 0.5;      
	
    setLimits(controlsCtn);
		
    controlsCtn.x = w * 0.5;
	controlsCtn.y = h * 0.5;
        
	var _titulo = new createjs.Text(CdsXML.getElementsByTagName("titulo")[CDAtual].firstChild.nodeValue, "bold 55px Arial", _cor);
    _titulo.name = "titulo";
    _titulo.scaleX = _titulo.scaleY = scaleRes;
    _titulo.x = (controlsCtn.maxX + controlsCtn.minX - _titulo.getBounds().width*scaleRes)* 0.5;
    _titulo.y = controlsCtn.maxY - (controlsCtn.maxY - controlsCtn.minY)*0.109 - _titulo.getBounds().height*scaleRes*0.55;
	_titulo.shadow = new createjs.Shadow("rgba(0, 0, 0, .25)", -1.5, 1.5, 0);
    controlsCtn.addChild(_titulo); 
	
    var _black = new createjs.Shape();
    _black.graphics.beginFill("#000000").drawRect(controlsCtn.minX,controlsCtn.minY, controlsCtn.maxX, controlsCtn.maxY);
    _black.name = "black";	
    _black.alpha = 0;

    if(testColor(CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue) === "black" || CDAtual === 11 || CDAtual === 7 || CDAtual === 1){
        drawImg(controlsCtn,"logo","logoPreto",controlsCtn.minX + GAME_HEIGHT*0.155,controlsCtn.minY + GAME_HEIGHT*0.08,0.75);
        controlsCtn.addChild(_black);
        createBtn(controlsCtn,"btnSetup",
		"#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#000000","#000000",GAME_HEIGHT*0.05,sSIcons,"setupB", controlsCtn.maxX - GAME_HEIGHT*0.03, controlsCtn.maxY - GAME_HEIGHT*0.03, 0.7);
        createBtn(controlsCtn,"btnLock","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#000000","#000000",GAME_HEIGHT*0.05,sSIcons,"openB", controlsCtn.maxX - GAME_HEIGHT*0.03, controlsCtn.minY + GAME_HEIGHT*0.1, 0.7); 
        createBtn(controlsCtn,"btnMusic","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#000000","#000000",GAME_HEIGHT*0.05,sSIcons,"musicB", controlsCtn.minX + GAME_HEIGHT*0.10, controlsCtn.maxY - GAME_HEIGHT*0.03, 0.7);  
    }else{
        drawImg(controlsCtn,"logo","logoBranco",controlsCtn.minX + GAME_HEIGHT*0.155,controlsCtn.minY + GAME_HEIGHT*0.08,0.75);
        controlsCtn.addChild(_black);
        createBtn(controlsCtn,"btnSetup",
		"#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,
		"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,
		"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,
		GAME_HEIGHT*0.05,sSIcons,"setupW", controlsCtn.maxX - GAME_HEIGHT*0.03, controlsCtn.maxY - GAME_HEIGHT*0.03, 0.7);
        createBtn(controlsCtn,"btnLock","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,GAME_HEIGHT*0.05,sSIcons,"openW", controlsCtn.maxX - GAME_HEIGHT*0.03, controlsCtn.minY + GAME_HEIGHT*0.1, 0.7); 
        createBtn(controlsCtn,"btnMusic","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,GAME_HEIGHT*0.05,sSIcons,"musicW", controlsCtn.minX + GAME_HEIGHT*0.10, controlsCtn.maxY - GAME_HEIGHT*0.03, 0.7); 
    }
}

function drawJukebox() {
	////"use strict";
    //alert("drawJukebox "+CdsXML.getElementsByTagName("id").length);
    drawTxt("\ndrawJukebox "+CdsXML.getElementsByTagName("id").length+" discos",true);
    jukeBox = new createjs.Container();
    jukeBox.name = "jukebox"; 
    jukeBox.y = GAME_HEIGHT * 0.04;
    jukeBox.X = GAME_WIDTH * 0.5;
    var _cds,_cda;
	if(Math.floor(CdsXML.getElementsByTagName("id").length * 0.5) === CdsXML.getElementsByTagName("id").length * 0.5){
        _cds = Math.floor(CdsXML.getElementsByTagName("id").length * 0.5) - 1;
		_cda = CDAtual - _cds - 1;
		if(_cda<0){_cda += CdsXML.getElementsByTagName("id").length;}
		drawCD(jukeBox,_cda,CdsXML.getElementsByTagName("id")[_cda].firstChild.nodeValue,GAME_WIDTH*((-1)*CD_POS_FATOR_X),GAME_HEIGHT * 0.39,CD_SCALE,CD_SCALE_X-((_cds)*CD_FATOR_X),CD_SCALE_Y-((_cds)*CD_FATOR_Y));
	}else{
        _cds = Math.floor(CdsXML.getElementsByTagName("id").length * 0.5);
        _cda = CDAtual - _cds;
        //alert("drawJukebox "+_cda);
		if(_cda<0){_cda += CdsXML.getElementsByTagName("id").length;}
	}
	CD_POS_FATOR_X = 0.071*4.84/_cds;
    for(var i = _cds; i > 0 ; i--){
        var _cde = CDAtual - i;
        if(_cde<0){_cde += CdsXML.getElementsByTagName("id").length;}
        drawCD(jukeBox,_cde,CdsXML.getElementsByTagName("id")[_cde].firstChild.nodeValue,GAME_WIDTH*((_cds-i)*CD_POS_FATOR_X),GAME_HEIGHT * 0.39,CD_SCALE,CD_SCALE_X-((i-1)*CD_FATOR_X),CD_SCALE_Y-((i-1)*CD_FATOR_Y));
        //alert(_cde);
        var _cdd = CDAtual + i;
        if(_cdd >= CdsXML.getElementsByTagName("id").length){_cdd -= CdsXML.getElementsByTagName("id").length;}
        //alert(_cdd);
        drawCD(jukeBox,_cdd,CdsXML.getElementsByTagName("id")[_cdd].firstChild.nodeValue,GAME_WIDTH*(1-(_cds-i)*CD_POS_FATOR_X),GAME_HEIGHT * 0.39,CD_SCALE,CD_SCALE_X-((i-1)*CD_FATOR_X),CD_SCALE_Y-((i-1)*CD_FATOR_Y));
	}
    drawCD(jukeBox,CDAtual,CdsXML.getElementsByTagName("id")[CDAtual].firstChild.nodeValue,GAME_WIDTH*0.5,GAME_HEIGHT * 0.39,CD_SCALE,0.98,0.98);
    //jukeBox.scaleX = 0.5;
	rybCtn.addChild(jukeBox);
}

function drawCD(_o,_cd,_n,_x,_y,_s,_sx,_sy){
	//"use strict";
    //alert("drawCD");
    var _disco = new createjs.Container();
    _disco.name = "cd"+_cd;
    var _miolo = new createjs.Sprite(sSCds,_n);
    _miolo.regX = _miolo.getBounds().width *0.5;
    _miolo.regY = _miolo.getBounds().height *0.5;

    var _bolacha = new createjs.Bitmap(loader.getResult("bolacha"));
    _bolacha.regX = _bolacha.getBounds().width *0.5;
    _bolacha.regY = _bolacha.getBounds().height *0.5;
    _bolacha.name = "bolacha"+_cd;
    _bolacha.scaleX = _bolacha.scaleY = 0.99;
        
    _bolacha.x = _bolacha.regX;
    _bolacha.y = _bolacha.regY;
    _miolo.x = _bolacha.regX;
    _miolo.y = _bolacha.regY;
        
    var _scaleDisco = (GAME_HEIGHT * _s)/_bolacha.getBounds().width;

    _disco.addChild(_miolo,_bolacha);
    _disco.regX = _bolacha.regX;
    _disco.regY = _bolacha.regY;
    _disco.x = _x;
    _disco.y = _y;
    _disco.scaleX = _sx * _scaleDisco;
    _disco.scaleY = _sy * _scaleDisco;

    _o.addChild(_disco);
}

function drawBase(_o,_n){
	//"use strict";
    //alert("drawBase");
    var _base = new createjs.Shape();
    setLimits(rybCtn);
	_base.graphics.beginFill("#"+CdsXML.getElementsByTagName("fg")[_n].firstChild.nodeValue).drawRoundRect(-GAME_WIDTH * 0.125,-(rybCtn.maxY - rybCtn.minY)*0.04, GAME_WIDTH * 0.25, (rybCtn.maxY - rybCtn.minY) * 0.47, GAME_HEIGHT*0.04, GAME_HEIGHT*0.04);
    _base.name ="base";
    _base.x = rybCtn.minX + (rybCtn.maxX - rybCtn.minX) * 0.5;
    _base.y = GAME_HEIGHT * 0.5 - GAME_HEIGHT * 0.075;
    _o.addChild(_base); 
    
	createBtn(_o,"backCd","#"+CdsXML.getElementsByTagName("icon")[_n].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"backCdW", _base.x-GAME_HEIGHT*0.14, _base.y+GAME_HEIGHT * 0.5-GAME_HEIGHT*0.133, 0.6);
    createBtn(_o,"back","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"backW", _base.x-GAME_HEIGHT*0.065, _base.y+GAME_HEIGHT * 0.5-GAME_HEIGHT*0.133, 0.6);
    createBtn(_o,"play","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("out")[_n].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"playW", _base.x+GAME_HEIGHT*0.03, _base.y+GAME_HEIGHT * 0.5-GAME_HEIGHT*0.123, 0.8);
    createBtn(_o,"next","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"nextW", _base.x+GAME_HEIGHT*0.11, _base.y+GAME_HEIGHT * 0.5-GAME_HEIGHT*0.133, 0.6);
    createBtn(_o,"nextCd","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[_n].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"nextCdW", _base.x+GAME_HEIGHT*0.185, _base.y+GAME_HEIGHT * 0.5-GAME_HEIGHT*0.133, 0.6);
}

function createBtn(_o,_n,_c,_cb,_ca,_r,_ss,_nss,_x,_y,_s){
	//"use strict";
    //alert("createBtn");
    drawTxt("\ncreateBtn "+_n,true);
    var _newBtn = new createjs.Container();
    _newBtn.name = _n;
    var _halo = new createjs.Shape();
	_halo.graphics.beginFill(_cb).drawCircle(0, 0,_r*1.2);
	var _arco = new createjs.Shape();
	_arco.graphics.setStrokeStyle(_r*0.25).beginStroke(_ca).arc(0,0,_r*1.09,0*Math.PI,0*Math.PI);
    _arco.name = "arco";
    //_arco.alpha = 0.8;
    var _bola = new createjs.Shape();
	_bola.graphics.beginFill(_c).drawCircle(0, 0,_r);
    var _newIcon = new createjs.Sprite(_ss,_nss);
    _newIcon.name = "icon";
    _newIcon.regX = _newIcon.getBounds().width / 2;
    _newIcon.regY = _newIcon.getBounds().height / 2;
    _newBtn.addChild(_halo,_arco,_bola,_newIcon);
    _newBtn.regX = _newBtn.regY = _r;
    _newBtn.x = _x;
    _newBtn.y = _y;
    _newBtn.scaleX = _newBtn.scaleY = _newBtn.scale = _s;
    _o.addChild(_newBtn);
}

function createNumberBtn(_o,_n,_c,_cb,_cn,_r,_nb,_x,_y,_s){
	//"use strict";
    //alert("createNumberBtn");
    drawTxt("\ncreateNumberBtn "+_n+"\ncor halo "+_cb+"\n"+_nb,true);
    var _newBtn = new createjs.Container();
    _newBtn.name = _n;
    var _halo = new createjs.Shape();
	_halo.graphics.beginFill(_cb).drawCircle(0, 0,_r*1.2);
    var _bola = new createjs.Shape();
	_bola.graphics.beginFill(_c).drawCircle(0, 0,_r);
    var _newNumber = new createjs.Text(_nb, "bold 70px Arial", _cn);
    _newNumber.name = "number";
    //_newNumber.textAlign = "center";
    _newNumber.regX = _newNumber.getBounds().width * 0.5;
    _newNumber.regY = _newNumber.getBounds().height * 0.5;
    _newNumber.scaleX = _newNumber.scaleY = scaleRes;
    //_newNumber.x = _newNumber.getBounds().width * 0.5;
    _newBtn.addChild(_halo,_bola,_newNumber);
    _newBtn.regX = _newBtn.regY = _r;
    _newBtn.x = _x;
    _newBtn.y = _y;
    _newBtn.number = Number(_nb);
    _newBtn.scaleX = _newBtn.scaleY = _newBtn.scale = _s;
    _o.addChild(_newBtn);
}

function createTxtBtn(_o,_n,_c,_cb,_ct,_w,_h,_r,_txt,_x,_y,_s,_st){
	//"use strict";
	_st = typeof _st !== 'undefined' ? _st : 1;
	
    var _newBtn = new createjs.Container();
    _newBtn.name = _n;
	var _newTxt = new createjs.Text(_txt, "bold 35px Arial", _ct);
	_newTxt.name = "text";
	//_newTxt.lineWidth = _w - MARGEM_TEXTO * 2;
	_newTxt.textAlign = "center";
	_newTxt.scaleX = _newTxt.scaleY = _st * scaleRes;
	
	if(_newTxt.getBounds().height > 0){_newTxt.regY = _newTxt.getBounds().height * 0.5;}
	
	var _wBtn = _w * scaleRes;
	var _hBtn = _h * scaleRes;

	if(_newTxt.getBounds().width > 0){
		//_newTxt.regX = _newTxt.getBounds().width * 0.5;
		if (_wBtn < (_newTxt.getBounds().width + 2*BORDA_BTN + 2*MARGEM_TEXTO) * scaleRes){
			_wBtn = (_newTxt.getBounds().width + 2*BORDA_BTN + 2*MARGEM_TEXTO) * scaleRes;
		}
	}
	if(_newTxt.getBounds().height > 0){
		_newTxt.regY = _newTxt.getBounds().height * 0.5;
		if (_hBtn < (_newTxt.getBounds().height + 2*BORDA_BTN) * scaleRes){
			_hBtn = (_newTxt.getBounds().height + 2*BORDA_BTN * scaleRes);
		}
	}	
	_newTxt.x = _wBtn * 0.5;
	_newTxt.y = _hBtn * 0.5;
	
	
    var _halo = new createjs.Shape();
	_halo.graphics.beginFill(_cb).drawRoundRect(0, 0,_wBtn,_hBtn,_r * scaleRes);
    var _miolo = new createjs.Shape();
	_miolo.graphics.beginFill(_c).drawRoundRect(BORDA_BTN * scaleRes, BORDA_BTN * scaleRes,_wBtn - 2*BORDA_BTN * scaleRes,_hBtn -2*BORDA_BTN * scaleRes, (_r - BORDA_BTN) * scaleRes);
    
    _newBtn.addChild(_halo,_miolo,_newTxt);
    _newBtn.regX = _wBtn / 2;
    _newBtn.regY = _hBtn / 2;
    _newBtn.x = _x;
    _newBtn.y = _y;
    _newBtn.scaleX = _newBtn.scaleY = _newBtn.scale = _s;
    _o.addChild(_newBtn);
}

function createTxtScn(_o,_n,_c,_cb,_ct,_w,_h,_r,_txt,_x,_y,_s){
	//"use strict";
    var _newBtn = new createjs.Container();
    _newBtn.name = _n;
    
    var _newTxt = new createjs.Text(_txt, "bold 35px Arial", _ct);
    _newTxt.name = "text";
    //_newTxt.lineWidth = _w - MARGEM_TEXTO * 2;
    //_newTxt.textAlign = "center";
    _newTxt.regX = _newTxt.getBounds().width * 0.5;
    _newTxt.regY = _newTxt.getBounds().height * 0.5;
    _newTxt.scaleX = _newTxt.scaleY = scaleRes;
    
    var _wBtn = _w * scaleRes;
    if (_wBtn < (_newTxt.getBounds().width + 2*BORDA_BTN + 2*MARGEM_TEXTO) * scaleRes){
        _wBtn = (_newTxt.getBounds().width + 2*BORDA_BTN + 2*MARGEM_TEXTO) * scaleRes;
    }
    var _hBtn = _h * scaleRes;
    if (_hBtn < (_newTxt.getBounds().height + 6*BORDA_BTN) * scaleRes){
        _hBtn = (_newTxt.getBounds().height + 6*BORDA_BTN * scaleRes);
    }
    
    _newTxt.x = _wBtn * 0.5;
    _newTxt.y = _hBtn * 0.53 - BORDA_BTN * scaleRes;
    
    var _halo = new createjs.Shape();
	_halo.graphics.beginFill(_cb).drawRoundRect(0, 0,_wBtn,_hBtn,_r * scaleRes);
    var _miolo = new createjs.Shape();
	_miolo.graphics.beginFill(_c).drawRoundRect(BORDA_BTN * scaleRes, BORDA_BTN * scaleRes,_wBtn - 2*BORDA_BTN * scaleRes,_hBtn -2*BORDA_BTN * scaleRes, (_r - BORDA_BTN) * scaleRes);
    
    _newBtn.addChild(_halo,_miolo,_newTxt);
    _newBtn.regX = _wBtn / 2;
    _newBtn.regY = _hBtn / 2;
    _newBtn.x = _x;
    _newBtn.y = _y;
    _newBtn.scaleX = _newBtn.scaleY = _newBtn.scale = _s;
    _o.addChild(_newBtn);
}

function drawImg(_o,_n,_ni,_x,_y,_s){
	//"use strict";
    var _img = new createjs.Bitmap(loader.getResult(_ni));
    _img.name = _n;
    _img.regX = _img.getBounds().width * 0.5;
    _img.regY = _img.getBounds().height * 0.5;
    _img.x = _x;
    _img.y = _y;
	_img.scaleX = _img.scaleY = _img.scale = _s;
    _o.addChild(_img);
}

function drawSsImg(_o,_n,_sS,_sSn,_x,_y,_s){
	//"use strict";
    var _img = new createjs.Sprite(_sS,_sSn);
	_img.name = _n;
	_img.x = _x;
	_img.y = _y - _img.getBounds().height;
	_img.scaleX = _img.scaleY = _img.scale = _s;
	_o.addChild(_img);
}

function initImages() {
	//"use strict";
	drawTxt("\ninitImages",true);
    sSCds = new createjs.SpriteSheet({
        images: [loader.getResult("arteCds")],
        frames: {"width":Math.floor(630*scaleRes), "height":Math.floor(630*scaleRes)},
        animations: { "dj":[0], "barao":[1], "biquini":[2], "engenheiros":[3], "jotaquest":[4], "legiao":[5], "paralamas":[6], "ritalee":[7],"skank":[8], "titas":[9], "ryb1":[10], "ryb2":[11], "ryb3":[12] }
	});
	
	sSBgs = new createjs.SpriteSheet({
        images: [loader.getResult("arteFundos")],
        frames: {"width":Math.floor(2208*scaleRes), "height":Math.floor(1242*scaleRes)},
        animations: { "dj":[0], "barao":[1], "biquini":[2], "engenheiros":[3], "jotaquest":[4], "legiao":[5], "paralamas":[6], "ritalee":[7],"skank":[8], "titas":[9], "ryb1":[10], "ryb2":[11], "ryb3":[12] }
	});
	
	sSFgs = new createjs.SpriteSheet({
        images: [loader.getResult("arteFrente")],
        frames: {"width":Math.floor(2208*scaleRes), "height":Math.floor(1242*scaleRes)},
        animations: { "dj":[0], "barao":[1], "biquini":[2], "engenheiros":[3], "jotaquest":[4], "legiao":[5], "paralamas":[6], "ritalee":[7],"skank":[8], "titas":[9], "ryb1":[10], "ryb2":[11], "ryb3":[12] }
	});
	var _iconRes;
	if(scaleRes === 1){_iconRes = 110;} else {_iconRes = 65;}
    sSIcons = new createjs.SpriteSheet({
        images: [loader.getResult("arteIcons")],
        frames: {"width":_iconRes, "height":_iconRes},
        animations: { "playW":[0], "playB":[1], "pauseW":[2], "pauseB":[3], "nextW":[4], "nextB":[5], "backW":[6],"backB":[7], "lockW":[8], "lockB":[9], "textW":[10], "textB":[11], "musicW":[12], "musicB":[13], "setupW":[14], "setupB":[15], "openW":[16], "openB":[17], "closeW":[18], "closeB":[19], "nextCdW":[20], "nextCdB":[21], "backCdW":[22], "backCdB":[23], "youtubeW":[24], "youtubeB":[25], "twitterW":[26], "twitterB":[27], "instagramW":[28], "instagramB":[29], "webW":[30], "webB":[31], "facebookW":[32], "facebookB":[33] }
	});
}

function drawCover() {
	//"use strict";
    var _telaW,_telaH;
    var _carregando = new createjs.Container();
    _carregando.name = "carregando";
    
    setLimits(coverCtn);
    if(rodaTela === 0 ){
        _telaW = coverCtn.maxX - coverCtn.minX;
        _telaH = coverCtn.maxY - coverCtn.minY; 
        _carregando.y = _telaH * 0.38;
    } else {
        _telaH = coverCtn.maxX - coverCtn.minX;
        _telaW = coverCtn.maxY - coverCtn.minY;
        _carregando.y = - _telaH * 0.38;
    }
    
    var coverImg = new createjs.Bitmap(loader.getResult("cover"));
    coverImg.name = "cover";
    coverImg.regX = GAME_WIDTH * 0.5;
    coverImg.regY = GAME_HEIGHT * 0.5;
    
    var _texto = TxtXML.getElementsByTagName("carregando")[0].firstChild.nodeValue;
    
    var _titulo = new createjs.Text(_texto, "32px Arial", "#fff");
    _titulo.name = "titulo";
    _titulo.shadow = new createjs.Shadow("rgba(0, 0, 0, .35)", -1, 1, 0);
	_titulo.x = 10;
	_titulo.y = 3;
    
    var _borda = new createjs.Shape();
	_borda.graphics.beginFill("#fff").drawRect(0, -10, _telaW * 0.55, 40);
    
    var _barra = new createjs.Shape();
    _barra.name = "barra";
	_barra.graphics.beginFill("#317abe").drawRect(0, -10, _telaW * 0.55, 40);
    _borda.y = _barra.y = 12;
    _borda.x = _barra.x = 0;
	_barra.scaleX = 0;
    
    _carregando.addChild(_borda,_barra,_titulo);
    
    coverCtn.addChild(coverImg,_carregando);
    
    _carregando.regX = (_telaW * 0.55) * 0.5;
    _carregando.x = 0; 
        
	//rescaleScn(coverImg,scaleScn);
    stage.update();
    //alert("drawCover"+"\nminX "+coverCtn.minX+" , minY "+coverCtn.minY+"\nmaxX "+coverCtn.maxX+" , maxY "+coverCtn.maxY+"\nimagem "+coverImg.getBounds().width * 0.5+" , game width "+ GAME_WIDTH+" , scale "+ scaleScn);
}

function drawWindow(_o,_n,_wC,_hC,_xC,_yC,_bg,_cbg,_co,_c,_cW) {
	//"use strict";
    //drawTxt("\ndrawWindow"+"\n "+_o+"\n "+_n+"\n W: "+_wC+"\n H: "+_hC+"\n x: "+_xC+"\n y: "+_yC+"\n Bg: "+_bg+"\n cor bg: "+_cbg+"\n cor outline: "+_co,true);
    _c = typeof _c !== 'undefined' ? _c : false;
    _cW = typeof _cW !== 'undefined' ? _cW : false;
    
	var _winCtn = new createjs.Container();
	_winCtn.name = _n;
    
	var _contentCtn = new createjs.Container();
	_contentCtn.name = "content";
	
    var _maskCtn = new createjs.Shape();
	_maskCtn.name = "mask";
	_maskCtn.graphics.beginFill(_cbg).drawRect(GAME_HEIGHT*0.004,GAME_HEIGHT*0.004,_wC-GAME_HEIGHT*0.008,_hC-GAME_HEIGHT*0.008);
	
    var _fundoCtn = new createjs.Shape();
	_fundoCtn.name = "fundoCtn";
	_fundoCtn.graphics.beginFill(_co).drawRect(0,0,_wC,_hC);
    
	_contentCtn.mask = _maskCtn;
	_contentCtn.addChild(_o);
	_winCtn.addChild(_fundoCtn);
    
    if(_bg){
        var _fundoCor = new createjs.Shape();
		_fundoCor.name = "fundoCor";
        _fundoCor.graphics.beginFill(_cbg).drawRect(GAME_HEIGHT*0.004,GAME_HEIGHT*0.004,_wC-GAME_HEIGHT*0.008,_hC-GAME_HEIGHT*0.008);
        _winCtn.addChild(_fundoCor);
    }
    
    _winCtn.addChild(_contentCtn);
	_fundoCtn.shadow = new createjs.Shadow("rgba(0, 0, 0, .35)", 5, 5, 10);
	controlsCtn.addChild(_winCtn);
    
    if(_cW){
        //alert("Centralizado");
        _winCtn.regX = _wC * 0.5;
        _winCtn.regY = _hC * 0.5;
    }
    
    _winCtn.x = _xC;
	_winCtn.y = _yC;
    
    if(_c){
        createBtn(_winCtn,"close","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"closeW", _wC - GAME_HEIGHT*0.016,GAME_HEIGHT*0.065, 0.6);
        _winCtn.getChildByName("close").on("click",doClose);
    }
}

function moveWindowInOut(_o,_w,_x,_d) {
	//"use strict";
    drawTxt("\nmoveWindowInOut"+"\n"+_o+"\n"+_w+"\n"+_x+"\n"+_d,true);
    switch(_d){
    case "leftIn":
        origemRybCtn = rybCtn.x;
        origemControlsCtn = controlsCtn.x;
        testSaleTimer();
        createjs.Tween.get(controlsCtn).to({x:_x}, 500);
        createjs.Tween.get(rybCtn).to({x:_x}, 500);
        createjs.Tween.get(controlsCtn.getChildByName("black")).to({alpha:0.5}, 500);
		var _obj = controlsCtn.getChildByName(CdsXML.getElementsByTagName("id")[CDAtual].firstChild.nodeValue);
		controlsCtn.getChildByName("black").addEventListener("click",function(){
            moveWindowInOut(controlsCtn,_obj,controlsCtn.minX - (controlsCtn.maxX - controlsCtn.minX) * 0.5,"leftOut");
			});
        rybCtn.lock = true;
        if(controlsCtn.getChildByName("sale") !== null){
            controlsCtn.setChildIndex(controlsCtn.getChildByName("sale"),controlsCtn.numChildren-1);
            createjs.Tween.get(controlsCtn.getChildByName("sale")).to({x:controlsCtn.minX}, 500);
            //alert("Janela Sale Aberta");
        } 
        if(controlsCtn.getChildByName("setup") !== null){
            //alert("Janela do Setup aberta");
            doSetup();
        }
        break;
    case "topIn":
        createjs.Tween.get(_w).to({y:_x}, 500);
        break;
    case "leftOut":
		if(controlsCtn.getChildByName("black").hasEventListener("click")){
		controlsCtn.getChildByName("black").removeEventListener("click",function(){
            moveWindowInOut(controlsCtn,_obj,controlsCtn.minX - (controlsCtn.maxX - controlsCtn.minX) * 0.5,"leftOut");
			});}
        createjs.Tween.get(controlsCtn)
            .to({x:origemControlsCtn}, 500)
            .call(cleanObject,[_o,_w]);
        createjs.Tween.get(rybCtn)
            .to({x:origemRybCtn}, 500);
        createjs.Tween.get(controlsCtn.getChildByName("black")).to({alpha:0}, 500);
        rybCtn.lock = false;
        if(controlsCtn.getChildByName("sale") !== null){
            controlsCtn.setChildIndex(controlsCtn.getChildByName("sale"),controlsCtn.numChildren-1);
            createjs.Tween.get(controlsCtn.getChildByName("sale")).to({x: GAME_WIDTH * 0.5}, 500);
            //alert("Janela Sale Aberta");
        } 

        break;
    case "topOut":
        createjs.Tween.get(_w)
        .to({y:_x}, 500)
        .call(cleanObject,[_o,_w]);
        break;
    }
}

function cleanObject(_o,_w){
	//"use strict";
    //alert("cleanObject "+_o+" - "+_w);
    _o.removeChild(_w);
}

function onResize() {
	//"use strict";
    //alert("onResize");
    if(window.innerHeight < window.innerWidth){
        rodaTela = 0;
        w = window.innerWidth;
        h = window.innerHeight; 
        canvas.width = w;
        canvas.height = h;
        if(rybCtn !== null && controlsCtn !== null && coverCtn !== null){
            rybCtn.rotation = controlsCtn.rotation = coverCtn.rotation = rodaTela;
            canvas.x = rybCtn.x = controlsCtn.x = coverCtn.x = w * 0.5;
            canvas.y = rybCtn.y = controlsCtn.y = coverCtn.y = h * 0.5;
        }
    } else {
        rodaTela = 90;
        h = window.innerWidth;
        w = window.innerHeight;
        canvas.width = h;
        canvas.height = w; 
        //if(rybCtn != null && controlsCtn != null && coverCtn != null){
            rybCtn.rotation = controlsCtn.rotation = coverCtn.rotation = rodaTela;
            canvas.x = rybCtn.x = controlsCtn.x = coverCtn.x = h * 0.5;
            canvas.y = rybCtn.y = controlsCtn.y = coverCtn.y = w * 0.5;
       // }
    }
    
    adjustW = GAME_WIDTH;
    adjustH = GAME_WIDTH * h / w + 40;
    if(adjustH/GAME_HEIGHT > 1){
        adjustA = adjustH/GAME_HEIGHT;
    } else {
        adjustA = 1;
    }
    scaleScn = w/GAME_WIDTH*adjustA;
    rescaleScn(coverCtn,scaleScn);
	rescaleScn(rybCtn,scaleScn);
	rescaleScn(controlsCtn,scaleScn);
    //alert("onResize " + rodaTela + " W " + w  + " H " + h );
    stage.update();
}

function rescaleScn(_o,_s) {
	//"use strict";
    if(_o !== null){
        drawTxt("\nrescaleScn "+_o.name+" - Escala: "+_s,true);
        _o.scaleX = _o.scaleY = _o.scale = _s;
        //alert("rescaleScn "+_o);
        //stage.update(); 
    }
}

function setLimits(_o){
	//"use strict";
    var _point1, _point2;
    if(rodaTela === 0){
        _point1 = _o.globalToLocal(0,0);
        _point2 = _o.globalToLocal(w,h); 
    } else {
        _point1 = _o.globalToLocal(0,0);
        _point2 = _o.globalToLocal(w,h);  
    }
    _o.minX = _point1.x;
    _o.minY = _point1.y;
    _o.maxX = _point2.x;
    _o.maxY = _point2.y;
}

function drawTxt(_t,_c){
	//"use strict";
    setLimits(controlsCtn);
    if(showTxt){
        if( controlsCtn.getChildByName("controle") === null){
            txt = new createjs.Text(_t, "bold 30px Arial", "#fff");
            txt.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 10);
            txt.name = "controle";
			txt.scaleX = txt.scaleY = scaleRes;
            txt.x = controlsCtn.minX + 20;
            txt.y = controlsCtn.minY + 30;
            
            controle = new createjs.Text("", "bold 30px Arial", "#fff");
            controle.shadow = new createjs.Shadow("rgba(0, 0, 0, 1)", 0, 0, 10);
            controle.name = "topo";
            controle.x = controlsCtn.minX + 20;
            controlsCtn.addChild(txt,controle);
            controle.text = "\ntamanho do texto: "+txt.getBounds().height+" - Tamanho da Janela: "+controlsCtn.getBounds().height;
        } else {
            if(!_c){
                txt.text = _t;
                txt.x = controlsCtn.minX + 20;
                txt.y = controlsCtn.minY + 30;
            } else {
                txt.text += _t;
                controle.text = "\ntamanho do texto: "+txt.getBounds().height+" - Tamanho da Janela: "+controlsCtn.getBounds().height;
                if(txt.getBounds().height > GAME_HEIGHT){
                    txt.y = controlsCtn.minY - Math.floor(txt.getBounds().height/GAME_HEIGHT)*GAME_HEIGHT;
                }
            } 
        }
        controlsCtn.setChildIndex(txt,controlsCtn.numChildren-1);
    }
}