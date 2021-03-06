/*jshint undef: false, unused: false */
/*globals document,window,createjs,onResize,navigator,drawTxt,onResize,initImages,rybApp,drawCover,alert*/

var w, h, loader, ultimo, txt, clickTime, moveScrollPasso, moveScrollObject, moveScrollLimit, moveScrollTempo, moveScrollInicio, showTxt, controle, jukeboxMove;
var stage, canvas, rybCtn, controlsCtn, loadCtn, coverCtn, sSCds, sSIcons, sSBgs, sSFgs, jukeBox, txt;
var CDS,PRECO_MUSICA,PRECO_ALBUM,CHAO_H, CHAO_COLOR, SOL_RADIUS, GAME_WIDTH, GAME_HEIGHT, BUILDINGS, ICON_MARGIN, WINDOW_WIDTH, WINDOW_HEIGHT, ITENS, MARGEM_TEXTO, MARGEM_GAME, MANIFEST, numeroDeFaixas, CD_SCALE, CD_SCALE_X, CD_SCALE_Y, CD_FATOR_X, CD_FATOR_Y, CD_POS_FATOR_X, BORDA_BTN;
var gameScnX, gameScnY, scaleScn, scaleRes, adjustW, adjustH, adjustA, rodaTela, ua, tracksDJ, faixasDJ, directoryReader;
var meuJukebox,inicioMov, posicaoAtual, botaoAtual, tocando, CDAtual, faixaAtual, origemRybCtn, origemControlsCtn, lock, CdsXML, TxtXML, somAtual, somAtualPosition, mediaTimer, saleTimer, saleTime, lockTimer, lockTime, sequenciaIdade;

// Função inicial - pode ser colocada no HTML

(function() {
	//"use strict";
    //alert("principal");
    document.addEventListener('DOMContentLoaded', function() {
        // get a reference to the canvas we'll be working with:
        canvas = document.getElementById("rybCanvas");
        // set canvas width
        canvas.width = window.innerWidth;
        // set canvas height
        canvas.height = window.innerHeight;
        
        window.addEventListener("resize", onResize);
        
        // create a stage object to work with the canvas. This is the top level node in the display list:
        stage = new createjs.Stage(canvas);
        stage.name = "Tela Principal";
        createjs.Touch.enable(stage);
        stage.enableMouseOver(10);
        //stage.mouseMoveOutside = true;
        
        rybCtn = new createjs.Container();
        rybCtn.name = "RYB";
        rybCtn.lock = false;

        coverCtn = new createjs.Container();
        coverCtn.name = "Cover";
        
        controlsCtn = new createjs.Container();
        controlsCtn.name = "Controls";
        controlsCtn.lock = false;
        
        stage.addChild(rybCtn,controlsCtn,coverCtn);
        
        ua = navigator.userAgent.toLowerCase();
        
        drawTxt("Rock Your Babies "+ua,false);
        //alert(ua);

        initVar();
        
    }, false);
    document.addEventListener("deviceready", onDeviceReady, false);
    
}());
// fim da Função inicial

function initVar() {
	//"use strict";
    //alert("initVar");
    
    // Constantes
	MARGEM_TEXTO = 30;
    BORDA_BTN = 5;
    CD_SCALE = 0.60;
    CD_SCALE_X = 0.45;
    CD_SCALE_Y = 0.8;
    CD_FATOR_X = 0.035;
    CD_FATOR_Y = 0.025;
    CD_POS_FATOR_X = 0.071;
    PRECO_MUSICA = 2.5;
    PRECO_ALBUM = 10;
	/*
    if(canvas.width > 1024){
		GAME_WIDTH = 2208;
		GAME_HEIGHT = 1242;
		scaleRes = 1;
		MANIFEST = [
			{src: "asset/images/capa_app.png", id: "cover"},
			{src: "asset/data/cds.xml", id: "cds"},
			{src: "asset/data/textos.xml", id: "textos"},
			{src: "asset/images/bolacha.png", id: "bolacha"},
			{src: "asset/images/arte_cd.png", id: "arteCds"},
			{src: "asset/images/icones_app.png", id: "arteIcons"},
			{src: "asset/images/fundos.png", id: "arteFundos"},
			{src: "asset/images/frente.png", id: "arteFrente"},
			{src: "asset/images/logo_ryb_branco.png", id: "logoBranco"},
			{src: "asset/images/logo_ryb_preto.png", id: "logoPreto"}
		];
    } else {
		GAME_WIDTH = 1334;
		GAME_HEIGHT = 750;
		scaleRes = 0.604;
		MANIFEST = [
			{src: "asset/images/capa_app_low.png", id: "cover"},
			{src: "asset/data/cds.xml", id: "cds"},
			{src: "asset/data/textos.xml", id: "textos"},
			{src: "asset/images/bolacha_low.png", id: "bolacha"},
			{src: "asset/images/arte_cd_low.png", id: "arteCds"},
			{src: "asset/images/icones_app_low.png", id: "arteIcons"},
			{src: "asset/images/fundos_low.png", id: "arteFundos"},
			{src: "asset/images/frente_low.png", id: "arteFrente"},
			{src: "asset/images/logo_ryb_branco_low.png", id: "logoBranco"},
			{src: "asset/images/logo_ryb_preto_low.png", id: "logoPreto"}
		]; 
    }
	*/
	if(canvas.width > 1024){
		GAME_WIDTH = 2208;
		GAME_HEIGHT = 1242;
		scaleRes = 1;
		MANIFEST = [
			{src: "asset/images/capa_app.png", id: "cover"},
			{src: "asset/images/bolacha.png", id: "bolacha"},
			{src: "asset/images/arte_cd.png", id: "arteCds"},
			{src: "asset/images/icones_app.png", id: "arteIcons"},
			{src: "asset/images/fundos.png", id: "arteFundos"},
			{src: "asset/images/frente.png", id: "arteFrente"},
			{src: "asset/images/logo_ryb_branco.png", id: "logoBranco"},
			{src: "asset/images/logo_ryb_preto.png", id: "logoPreto"}
		];
    } else {
		GAME_WIDTH = 1334;
		GAME_HEIGHT = 750;
		scaleRes = 0.604;
		MANIFEST = [
			{src: "asset/images/capa_app_low.png", id: "cover"},
			{src: "asset/images/bolacha_low.png", id: "bolacha"},
			{src: "asset/images/arte_cd_low.png", id: "arteCds"},
			{src: "asset/images/icones_app_low.png", id: "arteIcons"},
			{src: "asset/images/fundos_low.png", id: "arteFundos"},
			{src: "asset/images/frente_low.png", id: "arteFrente"},
			{src: "asset/images/logo_ryb_branco_low.png", id: "logoBranco"},
			{src: "asset/images/logo_ryb_preto_low.png", id: "logoPreto"}
		]; 
    }
    // Variáveis
    moveScrollPasso = 0;
    mediaTimer = null;
	saleTimer = null;
    lockTimer = null;
    lockTime = 1000;
    saleTime = 10000;
    clickTime = new Date();
    showTxt = false;
    CDAtual = 0;
	faixaAtual = 0;
	somAtualPosition = 0;
    somAtual = null;
    lock = false;
	tracksDJ = [];
	faixasDJ = [];
    sequenciaIdade = [];
    WINDOW_WIDTH = GAME_WIDTH * 0.5;
    WINDOW_HEIGHT = GAME_HEIGHT;
    tocando = true;
    onResize();
	loadXMLDoc("textos");
}

function onDeviceReady() {
    //var _src = "asset/music/";
    screen.lockOrientation('landscape');
    var _src = getPhoneGapPath()+"/asset/music/";
    window.resolveLocalFileSystemURL(_src,onReadDir,onFailReader);
    
}

function onReadDir(dirEntry){
    directoryReader = dirEntry.createReader();
    directoryReader.readEntries(onReader,onFailReader);
    //alert("directoryReader");
}

function loadContent(){
	//"use strict";
    //alert("loadContent");
    loader = new createjs.LoadQueue(false);
	loader.on("complete", handleComplete);
	loader.on("error", errorLoad);
	loader.on("fileload", onLoad);
	loader.on("progress", onProgress);
	loader.loadManifest(MANIFEST,false);
	loader.load();
}

function handleComplete(evt) {
	//"use strict";
    //alert("handleComplete");
	drawTxt("\nHandle Complete ",true);
	initImages();
	rybApp();
}

function onLoad(evt){
	//"use strict";
    //alert("onLoad "+evt.item.src);
	//drawTxt("\nonLoad "+evt.item.id,true);
    console.log(evt.item.id);
    switch(evt.item.id){
        case "cover":
            drawCover();
            break;
        /*case "cds":
            doXML("cds");
            break;
        case "textos":
            doXML("textos");
            break;*/
    }
}

function onProgress (evt){
	//"use strict";
    var _o = coverCtn.getChildByName("carregando");
    if(_o !== null){
        //drawTxt("\nonProgress "+evt.loaded+"\n barra "+_o.getChildByName("barra"),true);
        _o.getChildByName("barra").scaleX = evt.loaded;
        stage.update();
    }
}

function errorLoad(evt) {
	//"use strict";
    alert("errorLoad "+"\n"+evt.title+" "+evt.data.id+" "+evt.data.src);
	//drawTxt("\n"+evt.title+" "+evt.data.id+" "+evt.data.src,true);
	stage.update();
}

function onReader(entries) {
    //alert("successReader ");
    tracksDJ = entries;
    initFaixas();
   /* var i;
    for (i=0; i<entries.length; i++) {
        drawTxt("\n"+entries[i].name,true);
    }*/
}

function onFailReader(error) {
    alert("Failed to list directory contents: " + error.code+"\n"+error.title);
}
/*
function doXML(_id){
	//"use strict";
	//alert("doXML "+ _id);
    switch(_id){
        case "cds":
            CdsXML = loader.getResult("cds").documentElement;
            break;
        case "textos":
            TxtXML = loader.getResult("textos").documentElement;
            break;
    }
}
*/
function loadXMLDoc(_name) {
    //alert("loadXMLDoc: "+_name);
	var xmlhttp;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
    } else {
		// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
    
  	xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			switch(_name){
				case "cds":
					CdsXML = xmlhttp.responseXML;
				break;
				case "textos":
					TxtXML = xmlhttp.responseXML;
					loadXMLDoc("cds");
    				loadContent();
				break;
			}
		}
    };
  xmlhttp.open("GET", "asset/data/"+_name+".xml", true);
  xmlhttp.send();
}
