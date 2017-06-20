/*jshint undef: false, unused: false */
/*globals w, h, loader, ultimo:true, txt, clickTime:true, moveScrollPasso:true, moveScrollObject:true, moveScrollLimit:true, moveScrollTempo:true, moveScrollInicio:true, showTxt, controle,stage, canvas, rybCtn, controlsCtn, loadCtn, coverCtn, sSCds, sSIcons, sSBgs, sSFgs, jukeBox, txt,CDS,PRECO_MUSICA,PRECO_ALBUM,CHAO_H, CHAO_COLOR, SOL_RADIUS, GAME_WIDTH, GAME_HEIGHT, BUILDINGS, ICON_MARGIN, WINDOW_WIDTH, WINDOW_HEIGHT, ITENS, MARGEM_TEXTO, MARGEM_GAME, MANIFEST, numeroDeFaixas:true, CD_SCALE, CD_SCALE_X, CD_SCALE_Y, CD_FATOR_X, CD_FATOR_Y, CD_POS_FATOR_X, BORDA_BTN,gameScnX, gameScnY, scaleScn, adjustW, adjustH, adjustA, rodaTela, meuJukebox, posicaoAtual, tocando:true, CDAtual:true, faixaAtual:true, origemRybCtn, origemControlsCtn, lock:true, CdsXML, TxtXML, Howl */

var mPressX,mPressY;

function initApp() {
	//"use strict";
    coverCtn.visible = false;
    tocando = false;
	if(CDAtual === 0){
		numeroDeFaixas = faixasDJ.length;
	} else {
		numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual-1].firstChild.nodeValue);
	}
    //alert("initApp "+numeroDeFaixas);
    //createjs.Ticker.framerate = 100;
	initListeners();
}

function initListeners() {
	//"use strict";
	drawTxt("\ninitListeners",true);
    //alert("initListeners");
	jukeboxMove = true;
	createjs.Ticker.addEventListener("tick", tick);
    
    if(controlsCtn.getChildByName("btnMusic")!== null){
       controlsCtn.getChildByName("btnMusic").on("click",doMusicas);
    }
    
    if(controlsCtn.getChildByName("btnLock")!== null){
       controlsCtn.getChildByName("btnLock").on("mousedown",doInitLock);
       controlsCtn.getChildByName("btnLock").on("click",doLock);
    }
    /*
    if(controlsCtn.getChildByName("btnSetup")!== null){
       controlsCtn.getChildByName("btnSetup").on("click",doSetup);
    }
    */
    if(controlsCtn.getChildByName("btnSetup")!== null){
       controlsCtn.getChildByName("btnSetup").on("click",doAgeCheck);
    }
	
    if(rybCtn.getChildByName("play") !== null){
       rybCtn.getChildByName("play").on("click",doPlayPause);
    }
    
    if(rybCtn.getChildByName("next") !== null){
       rybCtn.getChildByName("next").on("click",doNext);
    }
    
    if(rybCtn.getChildByName("back") !== null){
       rybCtn.getChildByName("back").on("click",doBack);
    }
    
    if(rybCtn.getChildByName("nextCd") !== null){
       rybCtn.getChildByName("nextCd").on("click",doNextCd);
    }
    
    if(rybCtn.getChildByName("backCd") !== null){
       rybCtn.getChildByName("backCd").on("click",doBackCd);
    }
    
	if(rybCtn.getChildByName("jukebox") !== null){
		rybCtn.getChildByName("jukebox").on("mousedown",onJukeboxMouseDown);
		rybCtn.getChildByName("jukebox").on("click",onJukeboxMouseUp);
	}
}


function tick(event) {
	//"use strict";
    //drawTxt("\ntick");
    if(jukeBox.getChildByName("cd"+CDAtual) !== null && tocando){
       jukeBox.getChildByName("cd"+CDAtual).rotation += 5;
        if(jukeBox.getChildByName("cd"+CDAtual).rotation === 360) {
            jukeBox.getChildByName("cd"+CDAtual).rotation = 0; 
        }
    }
    if(moveScrollPasso !== 0 && moveScrollTempo < 1000){
        
        //drawTxt("\npasso: "+moveScrollPasso+"\ntempo: "+moveScrollTempo,true);
        moveScrollObject.y += moveScrollPasso;
        moveScrollPasso = moveScrollPasso * 0.8;
        if(moveScrollPasso>0){
            moveScrollPasso = Math.floor(moveScrollPasso);
        }else{
            moveScrollPasso = Math.ceil(moveScrollPasso);
        }
        if(moveScrollObject.y > 0) {moveScrollObject.y = 0;}
        if(moveScrollObject.y < moveScrollLimit) {moveScrollObject.y = moveScrollLimit;}
    }
	if(tocando){
        var _o = rybCtn.getChildByName("play");
		if(ua.indexOf("android") > -1) {
            if(somAtual._position !== null && somAtual._position > 0){
                drawTxt("Android\n"+somAtual.getDuration()+"\n"+somAtual._position,false);
                _o.getChildByName("arco").graphics.clear();
                _o.getChildByName("arco").graphics.setStrokeStyle(GAME_HEIGHT*0.04*0.25).beginStroke("#"+CdsXML.getElementsByTagName("out")[CDAtual].firstChild.nodeValue).arc(0,0,GAME_HEIGHT*0.04*1.09,0*Math.PI,(somAtual._position/somAtual.getDuration())*2*Math.PI);
                if(somAtual._position >= somAtual.getDuration()*0.99){
                    onEndSound(botaoAtual);
                }
            }
        }else{
            if(somAtual.playing()){
                //drawTxt("\n"+somAtual.duration()+"\n"+somAtual.seek()+"\n"+(somAtual.seek()/somAtual.duration()),false);
                _o.getChildByName("arco").graphics.clear();
                _o.getChildByName("arco").graphics.setStrokeStyle(GAME_HEIGHT*0.04*0.25).beginStroke("#"+CdsXML.getElementsByTagName("out")[CDAtual].firstChild.nodeValue).arc(0,0,GAME_HEIGHT*0.04*1.09,0*Math.PI,(somAtual.seek()/somAtual.duration())*2*Math.PI);
				somAtualPosition = somAtual.seek();
            }
        }
	} 
    if(lockTimer !== null){
        if(lock){
			if((new Date() - lockTimer) / lockTime <= 1){
				drawTxt((new Date() - lockTimer)+"\n"+lockTime+"\n"+((new Date() - lockTimer)/lockTime),false);
				controlsCtn.getChildByName("btnLock").getChildByName("arco").graphics.clear();
				controlsCtn.getChildByName("btnLock").getChildByName("arco").graphics.clear(); controlsCtn.getChildByName("btnLock").getChildByName("arco").graphics.setStrokeStyle(GAME_HEIGHT*0.04*0.25).beginStroke("#"+CdsXML.getElementsByTagName("out")[CDAtual].firstChild.nodeValue).arc(0,0,GAME_HEIGHT*0.05*1.09,0*Math.PI,((new Date() - lockTimer) / lockTime ) * 2 * Math.PI);
			}else{
				controlsCtn.getChildByName("btnLock").getChildByName("arco").graphics.clear();
				lockTimer = null;
				changeIcon(controlsCtn,"btnLock","open",true);
				lock = false;
			}
		}
    }
    stage.update();
} 

function onJukeboxMouseDown(evt){
	drawTxt("\nonJukeboxMouseDown ",true);
	//alert("onJukeboxMouseDown");
	rybCtn.getChildByName("jukebox").inicio = evt.stageX;
	rybCtn.getChildByName("jukebox").on("pressmove",onJukeboxDrag);
}

function onJukeboxDrag(evt){
	drawTxt("\nonJukeboxDrag "+rybCtn.getChildByName("jukebox").inicio,true);
	//alert("onJukeboxDrag");
	var _d = rybCtn.getChildByName("jukebox").inicio - evt.stageX;
	if(_d > GAME_WIDTH * CD_POS_FATOR_X * scaleRes && jukeboxMove) {
		rybCtn.getChildByName("jukebox").removeEventListener("pressmove",onJukeboxDrag);
		jukeboxMove = false;
		doNextCd();
	}
	if(_d < - GAME_WIDTH * CD_POS_FATOR_X * scaleRes && jukeboxMove) {
		rybCtn.getChildByName("jukebox").removeEventListener("pressmove",onJukeboxDrag);
		jukeboxMove = false;
		doBackCd();
	}
	drawTxt(" - "+_d,true);
}

function onJukeboxMouseUp(evt){
    //rybCtn.getChildByName("jukebox").removeEventListener("pressmove",onJukeboxDrag);
}

function onListMouseDown(evt){
	//"use strict";
	drawTxt("\nonListMouseDown "+moveScrollTempo,true);
	o = evt.currentTarget;
	o.offset = {x: o.x - evt.stageX, y: o.y - evt.stageY};
    moveScrollObject = o;
    moveScrollPasso = 0;
    moveScrollInicio = evt.stageY; 
    moveScrollTempo = new Date();
}

function onListMouseUp(evt) {
	//"use strict";
	//drawTxt("\nonListMouseUp ",true);
	o = evt.currentTarget;
     moveScrollPasso = Math.round(evt.stageY - moveScrollInicio); 
     moveScrollTempo = new Date() - moveScrollTempo;
	//drawTxt("\nonListMouseUp "+"\n moveScroll: "+moveScrollPasso,true);
	stage.update();
}

function onListDrag(evt) {
	//"use strict";
	o = evt.currentTarget;
	o.y = Math.round(evt.stageY + o.offset.y);
    var _point1 = o.localToGlobal(o.getBounds().width,o.getBounds().height);
    var _point2 = o.parent.localToLocal(o.parent.getBounds().width,o.parent.getBounds().height,o);
    var _p = o.parent;
	if(o.y > 0){o.y = 0;}
	if(o.y < o.hC - _p.getBounds().height){o.y = o.hC - _p.getBounds().height;}
    moveScrollLimit = o.hC - _p.getBounds().height;
	stage.update();
}

function doListScroll(_o,_hC){
	//"use strict";
    drawTxt("\ndoListScroll "+_o.name+"\nhasEventListener: "+_o.hasEventListener(),true);
    if(_o.hasEventListener()){
        _o.removeAllEventListeners();
    }
    drawTxt("\nhasEventListener: "+_o.hasEventListener(),true);
    drawTxt("\nTamanho do Conteudo: "+_o.getBounds().height+"\nNome da Janela: "+_o+"\nTamanho da Janela: "+_hC+"\n"+(_o.getBounds().height > _hC),true);
    if(_o.getBounds().height > _hC){
        _o.hC = _hC - (MARGEM_TEXTO + GAME_HEIGHT*0.008)*2;
		_o.on("mousedown",onListMouseDown);
		_o.on("pressmove",onListDrag);
		_o.on("click",onListMouseUp);
	}
}

function doNext(){
	//"use strict";
    //alert("doNext "+CDAtual+"\nlock "+lock+"\nrybCtn.lock "+rybCtn.lock+"\n tocando "+tocando);
	
    if(!lock && !rybCtn.lock){
        var _o = controlsCtn.getChildByName(CdsXML.getElementsByTagName("id")[CDAtual].firstChild.nodeValue);
        if(_o !== null){
            controlsCtn.removeChild(_o);
            //tocando = true;
        }
		if(CDAtual === 0){
			//alert("CDAtual = 0");
            if(faixasDJ.length > 0){
				faixaAtual += 1;
				numeroDeFaixas = faixasDJ.length;
				if(faixaAtual >= numeroDeFaixas){
					faixaAtual = 0;
					numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual + 1].firstChild.nodeValue);
					moveJukebox("next");
				}else{
					redrawScn();
				}
            }else{
                faixaAtual = 0;
				numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual + 1].firstChild.nodeValue);
                moveJukebox("next");
            }
        }else{
			//alert("doNext CDAtual: "+CDAtual+"\nfaixaAtual: "+faixaAtual+"\nnumeroDeFaixas: "+numeroDeFaixas+"\n"+(CdsXML.getElementsByTagName("nome").length - 1));
            if(faixaAtual === CdsXML.getElementsByTagName("nome").length - 1){
				//alert("doNext faixaAtual: "+faixaAtual);
                faixaAtual = 0;
				numeroDeFaixas = faixasDJ.length;
				moveJukebox("next");
            } else {
                faixaAtual +=1;
				//alert("doNext faixaAtual: "+faixaAtual);
				if(CDAtual !== Math.floor(faixaAtual/numeroDeFaixas) + 1){
                    moveJukebox("next");
                }else{
                    if(somAtual !==null){
                        somAtual.pause();
                        somAtual = null;
                    }
                    redrawScn();
                }
                CDAtual = Math.floor(faixaAtual/numeroDeFaixas) + 1;
				numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual + 1].firstChild.nodeValue);
            }
			//alert("doNext CDAtual: "+CDAtual+"\nfaixaAtual: "+faixaAtual+"\nnumeroDeFaixas: "+numeroDeFaixas);
        }
        /*if(!tocando){
            alert("Está parado");*/
            somAtualPosition = 0;
            somAtual = null;
        /*}*/	
    }
}

function doNextCd(){
	//"use strict";
    //alert("doNextCd"+CDAtual);
    if(!lock && !rybCtn.lock){
		if(CDAtual === CdsXML.getElementsByTagName("id").length - 1){
			faixaAtual = 0;
			numeroDeFaixas = faixasDJ.length;
		}else{
			//Só funciona para numero de faixas iguais. Alterar parafaixas diferentes
			faixaAtual = Math.floor((CDAtual)*numeroDeFaixas);
			numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual].firstChild.nodeValue);
		}
		moveJukebox("next");
        if(!tocando){
            somAtualPosition = 0;
            somAtual = null;
        }
    }
}

function doBack(){
	//"use strict";
    //alert("doBack"+CDAtual);
    if(!lock && !rybCtn.lock){
		var _proximo;
        var _o = controlsCtn.getChildByName(CdsXML.getElementsByTagName("id")[CDAtual].firstChild.nodeValue);
        if(_o !== null){
            controlsCtn.removeChild(_o);
            //tocando = true;
        }
		//alert("Proximo CDAtual: " + (CDAtual - 1));
		switch(CDAtual){
			case 0:
				if(faixaAtual === 0){
					_proximo = CdsXML.getElementsByTagName("id").length - 1;
					faixaAtual = CdsXML.getElementsByTagName("nome").length - 1;
					numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[_proximo-1].firstChild.nodeValue);
					moveJukebox("back");
				}else{
					faixaAtual -= 1;
					numeroDeFaixas = faixasDJ.length;
                    somAtualPosition = 0;
                    somAtual = null;
					redrawScn();
				}
				break;
				
			case 1:
                //alert("doBack CDAtual: "+CDAtual+"\nfaixaAtual: "+faixaAtual+"\nnumeroDeFaixas: "+numeroDeFaixas);
				if(faixaAtual === 0){
					if(faixasDJ.length > 0){faixaAtual = faixasDJ.length - 1;}
					numeroDeFaixas = faixasDJ.length;
					moveJukebox("back");
				}else{
					faixaAtual -= 1;
					numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual].firstChild.nodeValue);
                    somAtualPosition = 0;
                    somAtual = null;
					redrawScn();
				}
				break;
				
			default:
				//alert("CDAtual = "+CDAtual);
				faixaAtual -=1;
				if(CDAtual - 1 !== Math.floor(faixaAtual/numeroDeFaixas)){
					numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual - 1].firstChild.nodeValue);
					moveJukebox("back");
				}else{
					numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual - 1].firstChild.nodeValue);
                    somAtualPosition = 0;
                    onEndSound(botaoAtual);
					redrawScn();
				}
				CDAtual = Math.floor(faixaAtual/numeroDeFaixas) + 1;
				numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual - 1].firstChild.nodeValue);
				break;
        }
    }
}

function doBackCd(){
	//"use strict";
    //alert("doBackCd ");
    if(!lock && !rybCtn.lock){
		switch(CDAtual){
			case 0:
				numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CdsXML.getElementsByTagName("id").length - 2].firstChild.nodeValue);
				faixaAtual = Math.floor((CdsXML.getElementsByTagName("id").length - 2)*numeroDeFaixas);
				break;
			case 1:				
				faixaAtual = 0;
				numeroDeFaixas = faixasDJ.length;
				break;
			default:
				//Só funciona para numero de faixas iguais. Alterar parafaixas diferentes
				faixaAtual = Math.floor((CDAtual-2)*numeroDeFaixas);
				numeroDeFaixas = Number(CdsXML.getElementsByTagName("faixas")[CDAtual-2].firstChild.nodeValue);
				break;
		}
        moveJukebox("back");
        if(!tocando){
            somAtualPosition = 0;
            somAtual = null;
        }
    }
}

function moveJukebox(_d){
	//"use strict";
	//alert("moveJukebox "+_d+"\n"+CDAtual+"\nfaixaAtual: "+faixaAtual+"\nnumeroDeFaixas: "+numeroDeFaixas);
	drawTxt("\nmoveJukebox "+_d,true);
	var _fundoFade,_baseFade,_frontFade,_cd,_bg;
	setLimits(rybCtn);
	_fundoFade = new createjs.Container();
	_fundoFade.name = "fundoFade";
	_fundoFade.alpha = 0;
	_baseFade = new createjs.Container();
	_baseFade.name = "baseFade";
	_baseFade.alpha = 0;
	_frontFade = new createjs.Container();
	_frontFade.name = "frontFade";
	_frontFade.alpha = 0;
	//somAtual.stop();
	switch(_d){
		case "next":
			_cd = CDAtual+1;
			if(_cd === CdsXML.getElementsByTagName("id").length){_cd = 0;}
			_bg = new createjs.Shape();
			_bg.graphics.beginFill("#"+CdsXML.getElementsByTagName("bg")[_cd].firstChild.nodeValue).drawRect(0,0, GAME_WIDTH, GAME_HEIGHT);
			_bg.name = "bg"+_d;	
			_fundoFade.addChild(_bg);
			drawSsImg(_fundoFade,"fundo"+_d,sSBgs,CdsXML.getElementsByTagName("id")[_cd].firstChild.nodeValue,0,rybCtn.maxY,1);
			drawBase(_baseFade,_cd);
			drawSsImg(_frontFade,"frente",sSFgs,CdsXML.getElementsByTagName("id")[_cd].firstChild.nodeValue,0,rybCtn.maxY,1);
			rybCtn.addChildAt(_fundoFade,rybCtn.getChildIndex(rybCtn.getChildByName("base")));
			rybCtn.addChildAt(_baseFade,rybCtn.getChildIndex(rybCtn.getChildByName("jukebox")));
			rybCtn.addChildAt(_frontFade,rybCtn.getChildIndex(rybCtn.getChildByName("jukebox"))+1);
			showChildren(rybCtn);
			for(i=1 ; i<CdsXML.getElementsByTagName("id").length ; i++) {
				jukeBox.getChildByName("cd"+i).rotation = 0;
				if(jukeBox.getChildByName("cd"+i).x < CD_POS_FATOR_X){jukeBox.getChildByName("cd"+i).visible = false;}else{jukeBox.getChildByName("cd"+i).visible = true;}
				createjs.Tween.get(jukeBox.getChildByName("cd"+i)).to({x:jukeBox.getChildByName("cd"+(i-1)).x , scaleX:jukeBox.getChildByName("cd"+(i-1)).scaleX , scaleY:jukeBox.getChildByName("cd"+(i-1)).scaleY}, 500);
			}
			if(jukeBox.getChildByName("cd"+0).x < CD_POS_FATOR_X){jukeBox.getChildByName("cd"+0).visible = false;}else{jukeBox.getChildByName("cd"+0).visible = true;}
			jukeBox.getChildByName("cd"+0).rotation = 0;
			createjs.Tween.get(jukeBox.getChildByName("cd"+0)).to({x:jukeBox.getChildByName("cd"+(CdsXML.getElementsByTagName("id").length - 1)).x , scaleX:jukeBox.getChildByName("cd"+(CdsXML.getElementsByTagName("id").length - 1)).scaleX , scaleY:jukeBox.getChildByName("cd"+(CdsXML.getElementsByTagName("id").length - 1)).scaleY}, 500);
            CDAtual = _cd;
		break;
		
		case "back":
			_cd = CDAtual-1;
			if(_cd < 0){_cd = CdsXML.getElementsByTagName("id").length-1;}
			_bg = new createjs.Shape();
			_bg.graphics.beginFill("#"+CdsXML.getElementsByTagName("bg")[_cd].firstChild.nodeValue).drawRect(0,0, GAME_WIDTH, GAME_HEIGHT);
			_bg.name = "bg"+_d;	
			_fundoFade.addChild(_bg);
			drawSsImg(_fundoFade,"fundo"+_d,sSBgs,CdsXML.getElementsByTagName("id")[_cd].firstChild.nodeValue,0,rybCtn.maxY,1);
			drawBase(_baseFade,_cd);
			drawSsImg(_frontFade,"frente",sSFgs,CdsXML.getElementsByTagName("id")[_cd].firstChild.nodeValue,0,rybCtn.maxY,1);
			rybCtn.addChildAt(_fundoFade,rybCtn.getChildIndex(rybCtn.getChildByName("base")));
			rybCtn.addChildAt(_baseFade,rybCtn.getChildIndex(rybCtn.getChildByName("jukebox")));
			rybCtn.addChildAt(_frontFade,rybCtn.getChildIndex(rybCtn.getChildByName("jukebox"))+1);
			showChildren(rybCtn);
			
			for(i=0 ; i < CdsXML.getElementsByTagName("id").length - 1; i++){
				jukeBox.getChildByName("cd"+i).rotation = 0;
				if(jukeBox.getChildByName("cd"+i).x >= GAME_WIDTH){jukeBox.getChildByName("cd"+i).visible = false;}else{jukeBox.getChildByName("cd"+i).visible = true;}
				createjs.Tween.get(jukeBox.getChildByName("cd"+i)).to({x:jukeBox.getChildByName("cd"+(i+1)).x , scaleX:jukeBox.getChildByName("cd"+(i+1)).scaleX , scaleY:jukeBox.getChildByName("cd"+(i+1)).scaleY}, 500);
			}
			if(jukeBox.getChildByName("cd"+(CdsXML.getElementsByTagName("id").length - 1)).x >= GAME_WIDTH){jukeBox.getChildByName("cd"+(CdsXML.getElementsByTagName("id").length - 1)).visible = false;}else{jukeBox.getChildByName("cd"+(CdsXML.getElementsByTagName("id").length - 1)).visible = true;}
			jukeBox.getChildByName("cd"+(CdsXML.getElementsByTagName("id").length - 1)).rotation = 0;
			createjs.Tween.get(jukeBox.getChildByName("cd"+(CdsXML.getElementsByTagName("id").length - 1))).to({x:jukeBox.getChildByName("cd"+0).x , scaleX:jukeBox.getChildByName("cd"+(0)).scaleX , scaleY:jukeBox.getChildByName("cd"+0).scaleY}, 500).call(redrawScn);
			
            CDAtual = _cd;
		break;
	}
		createjs.Tween.get(_fundoFade).to({alpha:1}, 500);
		createjs.Tween.get(_baseFade).to({alpha:1}, 500);
		createjs.Tween.get(_frontFade).to({alpha:1}, 500);
		createjs.Tween.get(rybCtn.getChildByName("frente")).to({alpha:0}, 500).call(redrawScn);
		tocando = false;
        onEndSound(botaoAtual);
}

function redrawScn(){
	//"use strict";
	//alert("redrawScn");
    rybCtn.removeAllChildren();
    controlsCtn.removeAllChildren();
    drawGameScreen();
    drawControlScreen();
    stage.update();
    initListeners();
}

function doMusicas() {
	//"use strict";
    clickTime = new Date() - clickTime;
	drawTxt("\ndoMusicas "+clickTime,false);
    //alert("doMusicas");
    setLimits(controlsCtn);
    if(!lock && clickTime > 10){
        var _o = controlsCtn.getChildByName(CdsXML.getElementsByTagName("id")[CDAtual].firstChild.nodeValue);
        setLimits(controlsCtn);
        var _cor = "#fff";
        if(testColor(CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue) === "black") {
            if(testColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue) === "white"){
                _cor = "#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue;
            } else {
                _cor = "#000";
            }
        }
        if(_o === null) {
            var _content, _itemLista, _itemH, _faixas;
            var _contentsCtn = new createjs.Container();
            var _itemY = 0;
            _contentsCtn.name = "janela";
            var _titulo = new createjs.Text(CdsXML.getElementsByTagName("titulo")[CDAtual].firstChild.nodeValue, "bold 35px Arial", _cor);
            _titulo.lineWidth = controlsCtn.maxX * 0.5 / scaleRes;
			_titulo.scaleX = _titulo.scaleY = scaleRes;
            _titulo.x = _titulo.getBounds().height * 0.5;
			_titulo.y = _titulo.getBounds().height * scaleRes * 0.7;
            _itemH = (controlsCtn.maxY - controlsCtn.minY - (_titulo.getBounds().height * scaleRes) * 2 -(numeroDeFaixas * GAME_HEIGHT*0.004) )/numeroDeFaixas;
            var _tituloBg = new createjs.Shape();
            _tituloBg.graphics.beginFill("#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue).drawRect(0,0,controlsCtn.maxX * 0.5,_titulo.getBounds().height * 2 * scaleRes);
            _contentsCtn.addChild(_tituloBg,_titulo);
            _itemY = _titulo.getBounds().height * 2 * scaleRes + GAME_HEIGHT*0.004;
			if(CDAtual === 0){
                //alert(faixasDJ.length);
				if(faixasDJ.length > 0){
                    _itemH = (controlsCtn.maxY - controlsCtn.minY - (_titulo.getBounds().height * scaleRes) * 2 - (12 * GAME_HEIGHT*0.004))/12;
                    if(faixasDJ.length < 12){_faixas = 12;}else{_faixas=faixasDJ.length;}
                    for(i=0; i < _faixas; i++) {
                        _content = new createjs.Shape();
                        _content.graphics.beginFill("#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue).drawRect(0,0,controlsCtn.maxX * 0.5,_itemH);
                        _content.y = i * (_itemH + GAME_HEIGHT*0.004) + _itemY;
                        _contentsCtn.addChild(_content);
                        if(i < faixasDJ.length){
                            drawTxt("\n"+faixasDJ.length+"\n"+faixasDJ[i].nome,true);
                            if(i === faixaAtual){
                                createBtn(_contentsCtn,"play"+i,"#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04, sSIcons, "playW", GAME_HEIGHT*0.065,_content.y + _itemH / 2 + GAME_HEIGHT*0.02,0.5);
                                
                                if(tocando){
                                    changeIcon(_contentsCtn,"play"+i,"pause",false);
                                }
                            }else{
                                createBtn(_contentsCtn,"play"+i,"#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,sSIcons,"playW",GAME_HEIGHT*0.065,_content.y + _itemH / 2 + GAME_HEIGHT*0.02,0.5);
                            }
                            _contentsCtn.getChildByName("play"+i).number = i;
                            _contentsCtn.getChildByName("play"+i).on("click",doPlayMusica);
                            createBtn(_contentsCtn,"text"+i,"#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"textW",(controlsCtn.maxX - controlsCtn.minX) * 0.5 - GAME_HEIGHT*0.02,_content.y + _itemH / 2 + GAME_HEIGHT*0.02,0.5);
                            _contentsCtn.getChildByName("text"+i).number = faixasDJ[i].faixa;
                            _contentsCtn.getChildByName("text"+i).on("click",doLetras);
                            _itemLista = new createjs.Text(faixasDJ[i].nome, "35px Arial", "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue);
                            _itemLista.lineWidth = ((controlsCtn.maxX - controlsCtn.minX) * 0.5 - GAME_HEIGHT*0.16) / scaleRes;
                            _itemLista.scaleX = _itemLista.scaleY = scaleRes;
                            _itemLista.y = _content.y + (_itemH - _itemLista.getBounds().height * scaleRes) * 0.5;
                            //alert("altura texto "+_itemLista.getBounds().height);
                            _itemLista.x = GAME_HEIGHT*0.085;
                            _contentsCtn.addChild(_itemLista);
                        }
                    }
				}else{
					//alert("DJ Vazio");
                    _itemH = (controlsCtn.maxY - controlsCtn.minY - (_titulo.getBounds().height * scaleRes) * 2 - (12 * GAME_HEIGHT*0.004))/12;
                    if(faixasDJ.length < 12){_faixas = 12;}else{_faixas=faixasDJ.length;}
                    for(i=0; i < 12; i++) {
                        _content = new createjs.Shape();
                        _content.graphics.beginFill("#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue).drawRect(0,0,controlsCtn.maxX * 0.5,_itemH);
                        _content.y = i * (_itemH + GAME_HEIGHT*0.004) + _itemY;
                        _contentsCtn.addChild(_content);
                    }
				}
			} else {
				var _n = CDAtual - 1;
                for(i=0; i < numeroDeFaixas; i++) {
					drawTxt("\nCD "+CdsXML.getElementsByTagName("id")[i].firstChild.nodeValue,true);
					_content = new createjs.Shape();
					_content.graphics.beginFill("#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue).drawRect(0,0,controlsCtn.maxX * 0.5,_itemH);
					_content.y = i * (_itemH + GAME_HEIGHT*0.004) + _itemY;
					_contentsCtn.addChild(_content);
					if(_n*numeroDeFaixas+i === faixaAtual){
						createBtn(_contentsCtn,"play"+i,"#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"playW",GAME_HEIGHT*0.065,_content.y + _itemH / 2 + GAME_HEIGHT*0.02,0.5);
						if(tocando){
							changeIcon(_contentsCtn,"play"+i,"pause",false);
						}
					}else{
						createBtn(_contentsCtn,"play"+i,"#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"playW",GAME_HEIGHT*0.065,_content.y + _itemH / 2 + GAME_HEIGHT*0.02,0.5);
					}
					_contentsCtn.getChildByName("play"+i).number = _n*numeroDeFaixas+i;
					_contentsCtn.getChildByName("play"+i).on("click",doPlayMusica);
					createBtn(_contentsCtn,"text"+i,"#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,GAME_HEIGHT*0.04,sSIcons,"textW",(controlsCtn.maxX - controlsCtn.minX) * 0.5 - GAME_HEIGHT*0.02,_content.y + _itemH / 2 + GAME_HEIGHT*0.02,0.5);
					_contentsCtn.getChildByName("text"+i).number = _n*numeroDeFaixas+i;
					_contentsCtn.getChildByName("text"+i).on("click",doLetras);
					_itemLista = new createjs.Text(CdsXML.getElementsByTagName("nome")[_n*numeroDeFaixas+i].firstChild.nodeValue, "35px Arial", "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue);
					_itemLista.lineWidth = ((controlsCtn.maxX - controlsCtn.minX) * 0.5 - GAME_HEIGHT*0.16) / scaleRes;
					_itemLista.scaleX = _itemLista.scaleY = scaleRes;
					_itemLista.y = _content.y + (_itemH - _itemLista.getBounds().height * scaleRes) * 0.5;
					//alert("altura texto "+_itemLista.getBounds().height);
					_itemLista.x = GAME_HEIGHT*0.085;
					_contentsCtn.addChild(_itemLista);
                }
			}
            drawWindow(_contentsCtn,CdsXML.getElementsByTagName("id")[CDAtual].firstChild.nodeValue, (controlsCtn.maxX - controlsCtn.minX) * 0.5, controlsCtn.maxY - controlsCtn.minY, controlsCtn.minX - (controlsCtn.maxX - controlsCtn.minX) * 0.5, controlsCtn.minY,false, "#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue);
            //alert("winW "+((controlsCtn.maxX - controlsCtn.minX) * 0.5)+" winX "+(controlsCtn.minX - (controlsCtn.maxX - controlsCtn.minX) * 0.5));
			moveWindowInOut(controlsCtn,_o,w+2,"leftIn",false,false);
        } else {
            drawTxt("\ndoMusicas - else",true);
            moveWindowInOut(controlsCtn,_o,controlsCtn.minX - (controlsCtn.maxX - controlsCtn.minX) * 0.5,"leftOut");
        }
        //showChildren(controlsCtn);
        clickTime = new Date();
    }
}

function doLetras(e) {
    "use strict";
    clickTime = new Date() - clickTime;
	drawTxt("\ndoLetras "+clickTime,true);
	var _n = e.currentTarget.number;
    if(!lock && clickTime > 10){
        var _o = controlsCtn.getChildByName("letras");
		setLimits(controlsCtn);
		if(_o === null) {
            var _contentsCtn = new createjs.Container();
            _contentsCtn.name = "janela";
            drawLetras(_contentsCtn,_n,(controlsCtn.maxX-controlsCtn.minX)*0.5, controlsCtn.maxY - controlsCtn.minY);
            drawWindow(_contentsCtn,"letras",(controlsCtn.maxX-controlsCtn.minX)*0.5, controlsCtn.maxY - controlsCtn.minY, controlsCtn.minX+(controlsCtn.maxX-controlsCtn.minX)*0.5, - controlsCtn.maxY + controlsCtn.minY,true,"#"+CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,true);
            moveWindowInOut(controlsCtn,controlsCtn.getChildByName("letras"),controlsCtn.minY,"topIn");
			ultimo = _n;
        } else {
			if (ultimo === _n ){
				drawTxt("\ndoLetras - else close",true);
				//alert(ultimo == ultimo);
				moveWindowInOut(controlsCtn,_o,controlsCtn.minY-controlsCtn.maxY,"topOut");
			} else {
				//alert("doLetras - change "+_o.getChildByName("content").getChildByName("janela"));
				_o.getChildByName("content").getChildByName("janela").removeAllChildren();
				drawLetras(_o.getChildByName("content").getChildByName("janela"),_n,(controlsCtn.maxX-controlsCtn.minX)*0.5,controlsCtn.maxY - controlsCtn.minY);
                ultimo = _n;
			}
        }
        clickTime = new Date();
    }
}

function drawLetras(_o,_n,_lw,_hC){
	//"use strict";
	var _texto,_subtitulo,_rodape,_content;
	var _itemY = MARGEM_TEXTO;
    var _cor = "#fff";
    
    if(testColor(CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue) === "black"){
        if(testColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue) === "white"){
            _cor = "#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue;
        } else {
            _cor = "#000";
        }
    }
    
	var _titulo = new createjs.Text(CdsXML.getElementsByTagName("nome")[_n].firstChild.nodeValue, "bold 40px Arial", _cor);
	_titulo.lineWidth = (_lw - MARGEM_TEXTO * 6) / scaleRes;
	_titulo.textAlign = "center";
	_titulo.scaleX = _titulo.scaleY = scaleRes;
	_titulo.x = _lw * 0.5;
	_titulo.y = _itemY * scaleRes;
	_itemY += _titulo.getBounds().height * scaleRes;
	_texto = CdsXML.getElementsByTagName("autor")[_n].firstChild.nodeValue;
	_subtitulo = new createjs.Text(_texto, "bold 30px Arial", _cor);
	_subtitulo.lineWidth = (_lw - MARGEM_TEXTO * 6) / scaleRes;
	_subtitulo.textAlign = "center";
	_subtitulo.scaleX = _subtitulo.scaleY = scaleRes;
	_subtitulo.x = _lw * 0.5;
	_subtitulo.y = _itemY * scaleRes;
	_itemY += _subtitulo.getBounds().height * scaleRes * 0.7;
	
	_texto = new createjs.Text(CdsXML.getElementsByTagName("letra")[_n].firstChild.nodeValue, "bold 35px Arial", _cor);
	_texto.lineWidth = (_lw - MARGEM_TEXTO * 2) / scaleRes;
	_texto.textAlign = "center";
	_texto.scaleX = _texto.scaleY = scaleRes;
	_texto.x = _lw * 0.5;
	_texto.y = _itemY;
	_itemY += _texto.getBounds().height * scaleRes;
	
	_rodape = new createjs.Text(CdsXML.getElementsByTagName("original")[_n].firstChild.nodeValue, "bold 25px Arial", _cor);
	_rodape.lineWidth = (_lw - MARGEM_TEXTO * 2) / scaleRes;
	_rodape.textAlign = "center";
	_rodape.scaleX = _rodape.scaleY = scaleRes;
	_rodape.x = _lw * 0.5;
	_rodape.y = _itemY;
    
    _content = new createjs.Shape();
    _content.graphics.beginFill("#"+CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue).drawRect(0,0,_lw,_itemY+_rodape.getBounds().height+MARGEM_TEXTO);
    _o.y = 0;
	_o.hitArea = _content;
    _o.addChild(_titulo,_subtitulo,_texto,_rodape);
	doListScroll(_o,_hC);
}

function doXMLList() {
	//"use strict";
	drawTxt("\ndoXMLList",true);
    //alert("doLetras");
    if(!lock){
        var _o = controlsCtn.getChildByName("letras");

        if(_o === null) {
            var _contentsCtn = new createjs.Container();
            var _itemY = 0;
            _contentsCtn.name = "janela";
            var _docXML = CdsXML.getElementsByTagName("letra");
			var _texto = ""; 
            for(i = 0; i < _docXML.length; i++) {
                if (_docXML[i].nodeType !== 3) {
                    _texto += " "+i+" Name: " + _docXML[i].nodeName;
                    if(_docXML[i].childNodes.length === 1){
                        _texto += " : " + _docXML[i].childNodes[0].nodeValue + "\n";
                    } else {
                      _texto += "\n";  
                    }
                }
                for(z = 0; z < _docXML[i].childNodes.length; z++) {
                    if (_docXML[i].childNodes[z].nodeType !== 3) {
                        _texto += " "+i+" node "+z+" Name: " + _docXML[i].childNodes[z].nodeName;
                        if(_docXML[i].childNodes[z].childNodes.length === 1){
                            _texto += " : " + _docXML[i].childNodes[z].childNodes[0].nodeValue + "\n";
                        } else {
                            _texto += "\n"; 
                             for(k=0;k<_docXML[i].childNodes[z].childNodes.length;k++){
                                if (_docXML[i].childNodes[z].childNodes[k].nodeType !== 3) {
                                    _texto += " "+i+" node "+z+" item "+k+" Name: " + _docXML[i].childNodes[z].childNodes[k].nodeName +
                                    " : " + _docXML[i].childNodes[z].childNodes[k].childNodes[0].nodeValue+"\n";
                                }
                            }
                        }
                    }
                }
            }
            var _titulo = new createjs.Text(_texto, "bold 30px Arial", "#fff");
            _titulo.lineWidth = controlsCtn.maxX * 0.5 - 100;
            var _itemH = (controlsCtn.maxY - controlsCtn.minY - (_titulo.getBounds().height + GAME_HEIGHT*0.004) * 2 - (numeroDeFaixas * GAME_HEIGHT*0.004) )/numeroDeFaixas;
            var _tituloBg = new createjs.Shape();
            _tituloBg.graphics.beginFill("#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue).drawRect(GAME_HEIGHT*0.004,GAME_HEIGHT*0.004,controlsCtn.maxX * 0.5,_titulo.getBounds().height * 2);
            _contentsCtn.addChild(_tituloBg,_titulo);
            _itemY = _titulo.getBounds().height * 2 + GAME_HEIGHT*0.008;
            drawWindow(_contentsCtn,"letras", controlsCtn.maxX * 0.5 , controlsCtn.maxY - controlsCtn.minY, controlsCtn.maxX * 0.5 ,controlsCtn.minY,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue);
            //moveWindowIn(w+2);
        } else {
            drawTxt("\ndoLetras - else",true);
            moveWindowOut(controlsCtn,_o);
        }
    }
}

function doClose(e){
	//"use strict";
    drawTxt("\ndoClose "+e.currentTarget.parent.name,true);
	switch(e.currentTarget.parent.name){
		case "letras":
			e.currentTarget.number = ultimo;
			doLetras(e);
		break;
        case "setup":
            doSetup();
        break;
        case "sale":
            doSale();
        break;
        case "age":
            doAgeCheck(e);
        break;
	}
}

function doSetup() {
	//"use strict";
    var _btnW = 300;
    var _btnH = 100;
    var _btnR = 10;
    clickTime = new Date() - clickTime;
	drawTxt("\ndoSetup "+clickTime,true);
    //alert("doSetup");
    if(!lock && clickTime > 10){
        var _o = controlsCtn.getChildByName("setup");
		setLimits(controlsCtn);
        if(_o === null ) {
            var _contentsCtn = new createjs.Container();
            _contentsCtn.name = "janela";
            var _itemY = MARGEM_TEXTO;
            
            createTxtBtn(_contentsCtn,"setup","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue),doColor(CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue),_btnW,_btnH,_btnR,TxtXML.getElementsByTagName("descartar")[0].firstChild.nodeValue, (controlsCtn.maxX - controlsCtn.minX) * 0.25, (_btnH * 0.5 + 2 *  MARGEM_TEXTO)*scaleRes,1);
            
            createTxtBtn(_contentsCtn,"setup","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue),doColor(CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue),_btnW,_btnH,_btnR,TxtXML.getElementsByTagName("restaurar")[0].firstChild.nodeValue, (controlsCtn.maxX - controlsCtn.minX) * 0.25, (_btnH + 5 * MARGEM_TEXTO)*scaleRes,1);
            
            var _facebook, _instagram, _twitter;
            var _corIcon = "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue;
            if(testColor(CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue) === "white" || CDAtual === 1  || CDAtual === 4 || CDAtual===7 || CDAtual === 12 ){
                _facebook = new createjs.Sprite(sSIcons,"facebookW");
                _instagram = new createjs.Sprite(sSIcons,"instagramW");
                _twitter = new createjs.Sprite(sSIcons,"twitterW");
            } else {
                _facebook = new createjs.Sprite(sSIcons,"facebookB");
                changeColor(_facebook,_corIcon);
                _instagram = new createjs.Sprite(sSIcons,"instagramB");
                changeColor(_instagram,_corIcon);
                _twitter = new createjs.Sprite(sSIcons,"twitterB");
                changeColor(_twitter,_corIcon);
            }
            
			_facebook.name = "facebook";
            _facebook.scaleX = _facebook.scaleY = scaleRes;
            _facebook.regX = _facebook.getBounds().width * 0.5;
            _facebook.regY = _facebook.getBounds().height * 0.5;
            _facebook.x = (controlsCtn.maxX - controlsCtn.minX) * 0.25;
            _facebook.y = (controlsCtn.maxY - controlsCtn.minY) * 0.5 - _facebook.getBounds().height;
            _facebook.on("click",function(){window.open('https://www.facebook.com/rockyourbabies','_blank');},false);

            _instagram.name = "instagram";
            _instagram.scaleX = _instagram.scaleY = scaleRes;
            _instagram.regX = _instagram.getBounds().width * 0.5;
            _instagram.regY = _instagram.getBounds().height * 0.5;
            _instagram.x = _facebook.x - (MARGEM_TEXTO + _instagram.getBounds().width) * scaleRes;
            _instagram.y = (controlsCtn.maxY - controlsCtn.minY) * 0.5 - _instagram.getBounds().height;
            _instagram.on("click",function(){window.open('https://www.instagram.com/rockyourbabies','_blank');},false);

            _twitter.name = "twitter";
            _twitter.scaleX = _twitter.scaleY = scaleRes;
            _twitter.regX = _twitter.getBounds().width * 0.5;
            _twitter.regY = _twitter.getBounds().height * 0.5;
            _twitter.x = _facebook.x + (MARGEM_TEXTO + _twitter.getBounds().width) * scaleRes;
            _twitter.y = (controlsCtn.maxY - controlsCtn.minY) * 0.5 - _twitter.getBounds().height;
            _twitter.on("click",function(){window.open('https://twitter.com/rockyourbabies','_blank');},false);

            _contentsCtn.addChild(_instagram, _facebook, _twitter);
			
            
			drawWindow(_contentsCtn,"setup", (controlsCtn.maxX - controlsCtn.minX) * 0.5, (controlsCtn.maxY - controlsCtn.minY) * 0.5, controlsCtn.minX + (controlsCtn.maxX - controlsCtn.minX) * 0.5, controlsCtn.minY - (controlsCtn.maxY - controlsCtn.minY) * 0.25, true, "#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, true, true);
            moveWindowInOut(controlsCtn,controlsCtn.getChildByName("setup"), controlsCtn.minY + (controlsCtn.maxY - controlsCtn.minY) * 0.5, "topIn");
		} else{
            drawTxt("\ndoSetup - else close",true);
            moveWindowInOut(controlsCtn,_o,controlsCtn.minY - (controlsCtn.maxY - controlsCtn.minY) * 0.5,"topOut");
        } 
        clickTime = new Date();
    }
}

function doAgeCheck(e) {
	//"use strict";
    
    var _btnW = 300;
    var _btnH = 100;
    var _btnR = 20;
    clickTime = new Date() - clickTime;
	drawTxt("\ndoAgeCheck "+e.currentTarget.name+"\n"+clickTime,true);
    //alert("doAgeCheck");
    if(!lock && clickTime > 10){
        var _o = controlsCtn.getChildByName("age");
		setLimits(controlsCtn);
        if(_o === null ) {
            var _contentsCtn = new createjs.Container();
            _contentsCtn.name = "janela";
            var _itemY = (MARGEM_TEXTO + 2 * BORDA_BTN) * scaleRes;
            
            _titulo = new createjs.Text(TxtXML.getElementsByTagName("idade")[0].firstChild.nodeValue, "bold 50px Arial", doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue));
            //_titulo.regX = _titulo.getBounds().width * 0.5;
            //_titulo.regY = _titulo.getBounds().height * 0.5;
            _titulo.textAlign = "center";
            _titulo.scaleX = _titulo.scaleY = scaleRes;
            _titulo.x = (controlsCtn.maxX - controlsCtn.minX) * 0.2;
            _titulo.y = _itemY;
            _itemY = _titulo.y + _titulo.getBounds().height * 0.6 * scaleRes;
            
            _texto = new createjs.Text(TxtXML.getElementsByTagName("sequencia")[0].firstChild.nodeValue, "45px Arial", doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue));
            //_texto.regX = _titulo.getBounds().width * 0.5;
            //_texto.regY = _titulo.getBounds().height * 0.5;
            _texto.textAlign = "center";
            _texto.scaleX = _texto.scaleY = scaleRes;
            _texto.x = (controlsCtn.maxX - controlsCtn.minX) * 0.2;
            _texto.y = _itemY + _texto.getBounds().height;
            _itemY = _texto.y + _texto.getBounds().height + 2.5 * (MARGEM_TEXTO + BORDA_BTN) * scaleRes;
            
            _contentsCtn.addChild(_titulo,_texto);
            var _v,_n;
            for(i=0; i < 3; i++){
                _v = Math.floor(Math.random()*10);
                sequenciaIdade.push(_v);
                _n = readNumber(_v);
                _texto.text += " " + _n;
            }
			
           createTxtBtn(_contentsCtn,"display","#"+CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue, doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue), doColor(CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue),_btnW,_btnH,_btnR,"-", (controlsCtn.maxX - controlsCtn.minX) * 0.2, _itemY,1,2);
            
            _itemY = _contentsCtn.getChildByName("display").y + _contentsCtn.getChildByName("display").getBounds().height + 2.5 * (MARGEM_TEXTO + BORDA_BTN) * scaleRes;
			
            createNumberBtn(_contentsCtn, "btn1", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"1", (controlsCtn.maxX - controlsCtn.minX) * 0.2 - GAME_HEIGHT*0.056, _itemY, 0.6);	
            
            createNumberBtn(_contentsCtn, "btn2", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"2", (controlsCtn.maxX - controlsCtn.minX) * 0.2 + GAME_HEIGHT*0.026, _itemY, 0.6);	
            
            createNumberBtn(_contentsCtn, "btn3", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"3", (controlsCtn.maxX - controlsCtn.minX) * 0.2 + GAME_HEIGHT*0.108, _itemY, 0.6);	
            
            _itemY = _contentsCtn.getChildByName("btn1").y + GAME_HEIGHT*0.08;
            
            createNumberBtn(_contentsCtn, "btn4", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"4", (controlsCtn.maxX - controlsCtn.minX) * 0.2 - GAME_HEIGHT*0.056, _itemY, 0.6);	
            
            createNumberBtn(_contentsCtn, "btn5", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"5", (controlsCtn.maxX - controlsCtn.minX) * 0.2 + GAME_HEIGHT*0.026, _itemY, 0.6);	
            
            createNumberBtn(_contentsCtn, "btn6", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"6", (controlsCtn.maxX - controlsCtn.minX) * 0.2 + GAME_HEIGHT*0.108, _itemY, 0.6);	
            
            _itemY = _contentsCtn.getChildByName("btn4").y + GAME_HEIGHT*0.08;
            
            createNumberBtn(_contentsCtn, "btn7", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"7", (controlsCtn.maxX - controlsCtn.minX) * 0.2 - GAME_HEIGHT*0.056, _itemY, 0.6);	
            
            createNumberBtn(_contentsCtn, "btn8", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"8", (controlsCtn.maxX - controlsCtn.minX) * 0.2 + GAME_HEIGHT*0.026, _itemY, 0.6);	
            
            createNumberBtn(_contentsCtn, "btn9", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"9", (controlsCtn.maxX - controlsCtn.minX) * 0.2 + GAME_HEIGHT*0.108, _itemY, 0.6);	
            
            _itemY = _contentsCtn.getChildByName("btn7").y + GAME_HEIGHT*0.08;
                        
            createNumberBtn(_contentsCtn, "btn0", "#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,"#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, GAME_HEIGHT*0.04,"0", (controlsCtn.maxX - controlsCtn.minX) * 0.2 + GAME_HEIGHT*0.026, _itemY, 0.6);	

            var _w = (controlsCtn.maxX - controlsCtn.minX) * 0.4;
            if((_texto.getBounds().width + GAME_HEIGHT*0.04)>_w){
                _w = _texto.getBounds().width + GAME_HEIGHT*0.04;
                _contentsCtn.x = GAME_HEIGHT*0.04;
            }
            
			drawWindow(_contentsCtn,"age", (_w*scaleRes + GAME_HEIGHT*0.04), (controlsCtn.maxY - controlsCtn.minY) * 0.7, controlsCtn.minX + (controlsCtn.maxX - controlsCtn.minX) * 0.5, controlsCtn.minY - (controlsCtn.maxY - controlsCtn.minY) * 0.25, true, "#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue, true, true);
            moveWindowInOut(controlsCtn,controlsCtn.getChildByName("age"), controlsCtn.minY + (controlsCtn.maxY - controlsCtn.minY) * 0.5, "topIn");
		} else{
            drawTxt("\ndoAgeCheck - else close",true);
            moveWindowInOut(controlsCtn,_o,controlsCtn.minY - (controlsCtn.maxY - controlsCtn.minY) * 0.5,"topOut");
        } 
        clickTime = new Date();
    }
}

function doSale() {
	//"use strict";
    var _btnW = 300;
    var _btnH = 100;
    var _btnR = 20;
	drawTxt("\ndoSale ",true);
    //alert("doSale");
    
    var _o = controlsCtn.getChildByName("sale");
    setLimits(controlsCtn);
    if(_o === null ) {
        var _contentsCtn = new createjs.Container();
        _contentsCtn.name = "janela";
        var _itemY = MARGEM_TEXTO * scaleRes;
        
        var _valor, _largura, _textoX;
        
        _titulo = new createjs.Text(TxtXML.getElementsByTagName("gostou")[0].firstChild.nodeValue, "bold 50px Arial", doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue));
        _titulo.regX = _titulo.getBounds().width * 0.5;
        _titulo.regY = _titulo.getBounds().height * 0.5;
        _titulo.scaleX = _titulo.scaleY = scaleRes;
        _titulo.y = _itemY + _titulo.getBounds().height * 0.5;
        _itemY = _titulo.y + _titulo.getBounds().height * 0.5 + 2 * (MARGEM_TEXTO + BORDA_BTN) * scaleRes;
        
        _contentsCtn.addChild(_titulo);
        
        if(ua.indexOf("android") > -1){
            _valor = TxtXML.getElementsByTagName("moedaAndroid")[0].firstChild.nodeValue + TxtXML.getElementsByTagName("musicaAndroid")[0].firstChild.nodeValue;
        } else {
            _valor = TxtXML.getElementsByTagName("moedaIOS")[0].firstChild.nodeValue + TxtXML.getElementsByTagName("musicaIOS")[0].firstChild.nodeValue;
        }
        
        _largura = (controlsCtn.maxX - controlsCtn.minX) * 0.5;
        drawTxt("\nLargura: "+_largura,true);
        
        createTxtBtn(_contentsCtn,"saleTrack","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue),doColor(CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue),_btnW,_btnH,_btnR,TxtXML.getElementsByTagName("musica")[0].firstChild.nodeValue + _valor, (controlsCtn.maxX - controlsCtn.minX) * 0.25, _itemY,1);
        
        if(ua.indexOf("android") > -1){
            _valor = TxtXML.getElementsByTagName("moedaAndroid")[0].firstChild.nodeValue + TxtXML.getElementsByTagName("cdAndroid")[0].firstChild.nodeValue;
        } else {
            _valor = TxtXML.getElementsByTagName("moedaIOS")[0].firstChild.nodeValue + TxtXML.getElementsByTagName("cdIOS")[0].firstChild.nodeValue;
        }
        
        _contentsCtn.getChildByName("saleTrack").on("click",doAgeCheck,false);
        _textoX = _contentsCtn.getChildByName("saleTrack").getBounds().width + 4 * MARGEM_TEXTO;
        _itemY += (_btnH + MARGEM_TEXTO)*scaleRes;
        if(_largura < _textoX) {_largura = _textoX;}
        drawTxt("\nLargura: "+_largura,true);
        
        createTxtBtn(_contentsCtn,"saleCD","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue),doColor(CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue),_btnW,_btnH,_btnR,TxtXML.getElementsByTagName("cd")[0].firstChild.nodeValue+_valor, _largura * 0.5, _itemY,1);
        
        if(ua.indexOf("android") > -1){
            _valor = TxtXML.getElementsByTagName("moedaAndroid")[0].firstChild.nodeValue + TxtXML.getElementsByTagName("colecaoAndroid")[0].firstChild.nodeValue;
        } else {
            _valor = TxtXML.getElementsByTagName("moedaIOS")[0].firstChild.nodeValue + TxtXML.getElementsByTagName("colecaoIOS")[0].firstChild.nodeValue;
        }
        
        _contentsCtn.getChildByName("saleCD").on("click",doAgeCheck,false);
        _textoX = _contentsCtn.getChildByName("saleCD").getBounds().width + 4 * MARGEM_TEXTO;
        _itemY += (_btnH + MARGEM_TEXTO)*scaleRes;
        if(_largura < _textoX) {_largura = _textoX;}
        drawTxt("\nLargura: "+_largura,true);

        createTxtBtn(_contentsCtn,"saleRYB","#"+CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue,doColor(CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue),doColor(CdsXML.getElementsByTagName("icon")[CDAtual].firstChild.nodeValue),_btnW,_btnH,_btnR,TxtXML.getElementsByTagName("colecao")[0].firstChild.nodeValue+_valor, _largura * 0.5, _itemY,1);
        
        _contentsCtn.getChildByName("saleRYB").on("click",doAgeCheck,false);
        _textoX = _contentsCtn.getChildByName("saleRYB").getBounds().width + 4 * MARGEM_TEXTO;
        _itemY += (_btnH + MARGEM_TEXTO)*scaleRes;
        if(_largura < _textoX) {_largura = _textoX;}
        drawTxt("\nLargura: "+_largura,true);
        
        _contentsCtn.getChildByName("saleTrack").x = _contentsCtn.getChildByName("saleCD").x = _titulo.x = _largura * 0.5;
        
        drawWindow(_contentsCtn,"sale", _largura, (controlsCtn.maxY - controlsCtn.minY) * 0.5, (controlsCtn.maxX - controlsCtn.minX) * 0.5 + controlsCtn.minX, controlsCtn.minY - (controlsCtn.maxY - controlsCtn.minY) * 0.25, true, "#"+CdsXML.getElementsByTagName("fg")[CDAtual].firstChild.nodeValue, "#"+CdsXML.getElementsByTagName("letter")[CDAtual].firstChild.nodeValue,true,true);
        
        moveWindowInOut(controlsCtn,controlsCtn.getChildByName("sale"), controlsCtn.minY + (controlsCtn.maxY - controlsCtn.minY) * 0.5, "topIn");
    } else{
        drawTxt("\ndoSale - else close",true);
        moveWindowInOut(controlsCtn,controlsCtn.getChildByName("sale"), controlsCtn.minY - (controlsCtn.maxY - controlsCtn.minY) * 0.5,"topOut");
    } 
}

function doInitLock(){
    if(lockTimer === null){
        lockTimer = new Date();
    }
}

function doLock(){
	//"use strict";
    drawTxt("\ndoLock",false);
	if(!lock){
        changeIcon(controlsCtn,"btnLock","lock",true);
        lock = true;
		clearTimeout(saleTimer);
	}else{
		controlsCtn.getChildByName("btnLock").getChildByName("arco").graphics.clear();
	}
    lockTimer = null;
}

function doPlayMusica(e){
	var _nPlay = Math.floor(((faixaAtual/numeroDeFaixas) - Math.floor(faixaAtual/numeroDeFaixas))*numeroDeFaixas);
	alert(e.currentTarget.number+"\n"+e.currentTarget.name+"\n"+_nPlay);
	var _o = e.currentTarget.parent.getChildByName("play"+_nPlay);
	showChildren(_o);
	//_o.getChildByName("arco").alpha = 0;
	if(e.currentTarget.number !== faixaAtual) {
		if(tocando){
			changeIcon(e.currentTarget.parent,"play"+_nPlay,"play",false);
			onEndSound(e);
		} else {
			somAtualPosition = 0;
		}
	} 
	faixaAtual = e.currentTarget.number;
    if(CDAtual === 0){
        drawFaixa(rybCtn,faixasDJ[faixaAtual].nome);
    }else{
        drawFaixa(rybCtn,CdsXML.getElementsByTagName("nome")[faixaAtual].firstChild.nodeValue);
    }
	doPlayPause(e);
	//alert(e.currentTarget.number+"\n"+e.currentTarget.name+"\n"+_nPlay);
}

function doPlayPause(e){
	//"use strict";
    drawTxt("doPlayPause "+tocando+"\n"+e.currentTarget.name,false);
    if((!lock && !rybCtn.lock) || (rybCtn.lock && e.currentTarget.name !== "play")){       
        if(!tocando){
            changeIcon(rybCtn,"play","pause",false);
			if(e.currentTarget.name !== "play"){
				changeIcon(e.currentTarget.parent,e.currentTarget.name,"pause",false);
			}
            if(CDAtual === 0){
                drawTxt("\n"+faixaAtual+"\n"+tracksDJ[faixaAtual].name,true);
                initSound(TxtXML.getElementsByTagName("musicas")[0].firstChild.nodeValue+tracksDJ[faixaAtual].name,e);
            }else{
                drawTxt("\n"+faixaAtual+"\n"+CdsXML.getElementsByTagName("sample")[faixaAtual].firstChild.nodeValue,true);
                initSound(TxtXML.getElementsByTagName("samples")[0].firstChild.nodeValue+CdsXML.getElementsByTagName("sample")[faixaAtual].firstChild.nodeValue,e);
            }
        }else{
            changeIcon(rybCtn,"play","play",false);
            if(e.currentTarget.name !== "play"){
                changeIcon(e.currentTarget.parent,e.currentTarget.name,"play",false);
            }
			somAtual.pause();
        }
        tocando = !tocando;
        botaoAtual = e;
    }
}

function initSound(_s){
    //alert("initSound");
    if(somAtual === null){
        if(ua.indexOf("android") > -1){
            //alert("Android"+"\n"+somAtualPosition);
            var _src = getPhoneGapPath() + _s;
            somAtual = new Media(_src);
            var _pause = somAtualPosition;
            somAtual.play();
            if (mediaTimer === null) {
                mediaTimer = setInterval(function() {
                    // get my_media position
                    somAtual.getCurrentPosition(
                        // success callback
                        function(position) {
                            if (position > -1) {
                                somAtual._position = position;
                                somAtualPosition = position;
                            }
                        },
                        // error callback
                        function(e) {
                            alert("Error: " + e);
                        }
                    );
                }, 500);
            }
        } else {
            somAtual = new Howl({
                                src:[_s,"asset/samples/paralamas_05_UmaBrasileira.wav"],
                                onloaderror:onMediaError,
                                onload:onPlaySound,
                                onend:onEndSound
                                });
        }
        if(CDAtual !== 0 && saleTimer === null){
            saleTimer = setTimeout(doSale, saleTime);
        } else {
            clearTimeout(saleTimer);
            saleTimer = null;
        }
    } else {
        somAtual.play();
        if(ua.indexOf("android") > -1){
           /* setTimeout(function () {
                //alert("seekTo "+somAtualPosition);
                somAtual.seekTo(somAtualPosition);
            }, 100);*/
        }else{
            somAtual.seek(somAtualPosition);
        }
    }
}

function onPlaySound(e){
    //alert("onPlaySound "+somAtualPosition);
    somAtual.play();
}

function onMediaError(e){
    alert("onMediaError" + e + "\ncode: " + e.code + "\nmessage: " + e.message);
}

function onMediaStatus(e){
    alert("MediaStatus "+e);
    switch (e){
        case somAtual.MEDIA_RUNNING :
            somAtual.seekTo(somAtualPosition); 
        break;
    }
}

function onEndSound(e){
    somAtualPosition = 0;
    somAtual.stop();
    somAtual = null;
    tocando = false;
    changeIcon(rybCtn,"play","play",false);
    rybCtn.getChildByName("play").getChildByName("arco").graphics.clear();
    drawTxt("\nonEndSound: "+botaoAtual.currentTarget.name,false);
    
    if(botaoAtual.currentTarget.name !== "play"){
        changeIcon(botaoAtual.currentTarget.parent,botaoAtual.currentTarget.name,"play",false);
    }
    
    if(ua.indexOf("android") > -1) {
        clearInterval(mediaTimer);
        somAtual._position = null;
        mediaTimer = null;
    }
    
    if(saleTimer !== null){
        clearTimeout(saleTimer);
        saleTimer = null;
    }
    if(CDAtual === 0){
        doLoop();
    }
}

function doLoop(){
    somAtualPosition = 0;
    if(botaoAtual.currentTarget.name !== "play"){
        changeIcon(botaoAtual.currentTarget.parent,botaoAtual.currentTarget.name,"play",false);
    }
    if(CDAtual === 0){
        //alert("doLoop");
        //changeIcon(faixasDJ[faixaAtual].ctn,faixasDJ[faixaAtual].ctn.getChildByName("play"+faixaAtual),"pause",false);
        showChildren(controlsCtn);
        faixaAtual += 1;
        if(faixaAtual === faixasDJ.length){faixaAtual = 0;}
        //changeIcon(faixasDJ[faixaAtual].ctn,faixasDJ[faixaAtual].ctn.getChildByName("play"+faixaAtual),"play",false);
        tocando = true;
        changeIcon(rybCtn,"play","pause",false);
        //drawFaixa(rybCtn,faixasDJ[faixaAtual][0]);
        drawFaixa(rybCtn,faixasDJ[faixaAtual].nome);
        initSound(TxtXML.getElementsByTagName("musicas")[0].firstChild.nodeValue+tracksDJ[faixaAtual].name,botaoAtual);
    }
}

function initFaixas(){
    alert("initFaixas\n"+tracksDJ.length);
    for(i=0; i< CdsXML.getElementsByTagName("nome").length;i++){
        for(j=0; j<tracksDJ.length; j++){
            if(tracksDJ[j].name == CdsXML.getElementsByTagName("sample")[i].firstChild.nodeValue){
                faixasDJ.push({
                    nome:CdsXML.getElementsByTagName("nome")[i].firstChild.nodeValue,
                    faixa:i
                });
                drawTxt("\n"+(faixasDJ.length-1)+"\n Faixa: "+faixasDJ[faixasDJ.length-1].nome+"\nFaixa: "+faixasDJ[faixasDJ.length-1].faixa,true);
            }
        }  
    }
}

function readNumber(_n){
    var _numero = "";
    //alert("readNumber "+_n+"\n"+TxtXML.getElementsByTagName("um")[0].firstChild.nodeValue);
    switch(_n){
        case 1:
            _numero = TxtXML.getElementsByTagName("um")[0].firstChild.nodeValue;
            break;
        case 2:
            _numero = TxtXML.getElementsByTagName("dois")[0].firstChild.nodeValue;
            break;
        case 3:
            _numero = TxtXML.getElementsByTagName("tres")[0].firstChild.nodeValue;
            break;
        case 4:
            _numero = TxtXML.getElementsByTagName("quatro")[0].firstChild.nodeValue;
            break;
        case 5:
            _numero = TxtXML.getElementsByTagName("cinco")[0].firstChild.nodeValue;
            break;
        case 6:
            _numero = TxtXML.getElementsByTagName("seis")[0].firstChild.nodeValue;
            break;
        case 7:
            _numero = TxtXML.getElementsByTagName("sete")[0].firstChild.nodeValue;
            break;
        case 8:
            _numero = TxtXML.getElementsByTagName("oito")[0].firstChild.nodeValue;
            break;
        case 9:
            _numero = TxtXML.getElementsByTagName("nove")[0].firstChild.nodeValue;
            break;
        case 0:
            _numero = TxtXML.getElementsByTagName("zero")[0].firstChild.nodeValue;
            break;
    }
    //alert("readNumber "+_numero);
    return _numero;
}

function changeColor(_o,_c){
    _o.filters = [new createjs.ColorFilter(0, 0, 0, 1, hexToRgb(_c).r, hexToRgb(_c).g, hexToRgb(_c).b)];
    _o.cache(_o.x,_o.y,_o.getBounds().width,_o.getBounds().height);  
}

function changeIcon(_op,_n,_in,_t){
	//"use strict";
	var _cIcon,_newIcon;
    var _o = _op.getChildByName(_n);
	
    _o.removeChild(_o.getChildByName("icon"));
	//drawTxt("changeIcon: "+_o,false);
	if(_t) {
		if(testColor(CdsXML.getElementsByTagName("bg")[CDAtual].firstChild.nodeValue) === "white"){_cIcon = _in+"W";} else {_cIcon = _in+"B";}
	} else {
		_cIcon = _in+"W";
	}
    _newIcon = new createjs.Sprite(sSIcons,_cIcon);
    _newIcon.name = "icon";
    _newIcon.regX = _newIcon.getBounds().width / 2;
    _newIcon.regY = _newIcon.getBounds().height / 2;
    _o.addChild(_newIcon);
}

function doColor(_c){
    var _cor = "#fff";
    if(testColor(_c) === "black") {_cor = "#000";}
    return _cor;
}

function testColor(_c){
	//"use strict";
    var _r = parseInt(_c.substr(0,2),16);
    var _g = parseInt(_c.substr(2,2),16);
    var _b = parseInt(_c.substr(4,2),16);
    var _yiq = ((_r*299)+(_g*587)+(_b*114))/1000;
    // O correto é return (_yiq >= 128) ? "black" : "white";
    return (_yiq >= 180) ? "black" : "white";
}

function testSaleTimer(){
    if(saleTimer !== null){
        //alert("Sale");
        clearTimeout(saleTimer);
		saleTimer = setTimeout(doSale, 500);
	}
}

function showChildren(_o){
	//"use strict";
        drawTxt("\nObjeto: "+_o.name,false);
    for(i=0;i<_o.numChildren;i++){
        drawTxt("\nFilho"+i+": "+_o.getChildAt(i).name,true);
    }
}

function getPhoneGapPath() {

    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path;

}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}