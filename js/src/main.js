// JavaScript Document
$(function() {

    audio = new Audio("./js/src/end.wav");

    timerBoxWidth = $("p#timerText").width();
    timerNumWidth = "";
    SETTINGANIMATIONSPEED = 500;

    timerString = "";
    targetTimerMin = 1;
    targetTimerSec = 0;
    targetTimer = "";
    entryId = 0;

    startFlag = 0;

    var $o;

//    localStorage.clear();

    timerHr = "";
    timerMin = "";
    timerSec = "";

    //mainArea
    $timerTextMin = $("#min");
    $timerTextSec = $("#sec");


    entryData = [];
    readJSON();

    $body = $("body");
    $timerText = $("#timerText");
//    var $timerTextHr = $("#hr");

    var wWidth = $(window).width();
    var wHeight = $(window).height();

    /* set fitText */
    var $txt = $timerText.fitText(0.4).css("top",(wHeight - $timerText.height()) / 2);
    // var $txt = $timerText.fitText(0.5);

    $("input#startButton").click(headerStartTimer);
    $("input#resetButton").click(resetTimer);
    $("input#endButton").click(endTimer);

    $("img#setting").click(settingOpener);
    $("input.entryAddButton1").bind("click",{obj:$("input.entryAddButton1").closest("tr")},entryAdd);
    $("input.entryAddButton2").bind("click",{obj:$("input.entryAddButton2").closest("tr")},entryAdd);
    $("input.entryAddButton3").bind("click",{obj:$("input.entryAddButton3").closest("tr")},entryAdd);

    /* timerText design */
    $(window).load(function() {
        timerNumWidth = $("span#sec").width();
//        $timerTextHr.css("width", timerNumWidth);
        //$timerTextMin.css("width", timerNumWidth);
        //$timerTextSec.css("width", timerNumWidth);
    });
});

function resetTimer(){
        console.log('acrionin'+$o.tmMin[0].innerHTML+':'+$o.tmSec[0].innerHTML);
        endTimer();

        var set_min =  eval($o.find('.setMin')[0].innerHTML);
        var set_sec =  eval($o.find('.setSec')[0].innerHTML);
        
        console.log(set_min);
        $timerTextMin.text(set_min);
        $timerTextSec.text(zeroformat(set_sec,2));
        timerCount=0;
    //    eval($o.tmMin[0].innerHTML) = set_min;
     //   eval($o.tmSec[0].innerHTML) = set_sec;
        $o.tmSec.html(set_sec);
        $o.tmMin.html(set_min);
}

function headerStartTimer() {
    if(startFlag == 0 && $o.length){
        timerAction();
    }
    return false;
}

function startTimer(evt) {
    if(startFlag == 0){

        var name = evt.data.name;
        $o = evt.data.obj;
        $o.tmMin = $o.find('.tmMin');
        $o.tmSec = $o.find('.tmSec');
        $o.setMin = $o.find('.setMin');
        $o.setSec = $o.find('.setSec');
        
        //ヘッダーの文字設定
        $("#targetNameText").text(name);
        $("#yoteiMin").text(eval(evt.data.min));
        $("#yoteiSec").text(zeroformat(eval(evt.data.sec),2));

        timerAction();


    }
}

function timerAction(){
        console.log('acrionin'+$o.tmMin[0].innerHTML+':'+$o.tmSec[0].innerHTML);

        var min = isFinite((eval($o.tmMin[0].innerHTML))) ? eval($o.tmMin[0].innerHTML) : eval($o.find('.setMin')[0].innerHTML);
        var sec = isFinite((eval($o.tmSec[0].innerHTML))) ? eval($o.tmSec[0].innerHTML) : eval($o.find('.setSec')[0].innerHTML);
        console.log('min+sec'+min+':'+sec);

        $timerTextMin.text(min);
        $timerTextSec.text(zeroformat(sec,2));

        targetTimer = (min * 60) + sec;

        //画面遷移
        $("div#mainArea").animate({left: "0%"}, SETTINGANIMATIONSPEED);
        $("div#settingArea").animate({left: "100%"}, SETTINGANIMATIONSPEED);
        $body.removeClass("setting");

        //タイマー
        if($o.hasClass('over') == false ){
            $body.removeAttr("id");
        }else{
            $("body").attr("id", "over");
            targetTimer *= -1;
        }
        jQuery(document).stopTime("timer01");

        var timer = targetTimer;
        var timerCount = 0;

        startFlag = 1;

        jQuery(document).everyTime(1000,"timer01",function () {
            timer = targetTimer - timerCount;
            //console.log(timer);
            if(timer == 0) {
                //console.log("negative");
                $("body").attr("id", "over");
                $o.addClass("over");
                audio.play();
                console.log("play audio"+audio);
            }
            timer = Math.abs(timer);
    //        timertHr = Math.floor(timer / 3660 % 60);
            timerMin = Math.floor(timer / 60 % 60);
            timerSec = Math.floor(timer % 60);

    //        $timerTextHr.text((timerHr > 0)? timerHr : "");
            $timerTextMin.text(timerMin);
            $timerTextSec.text(zeroformat(timerSec,2));
            $o.tmMin.text(timerMin);
            $o.tmSec.text(zeroformat(timerSec,2));
            timerCount++;
        });

}


function endTimer() {
    if(startFlag){
        jQuery(document).stopTime("timer01");
        var isNagative = $o.hasClass('over');
        addJSON(
            $o.find('.entryId')[0].innerHTML,
            $o.find('.trName')[0].innerHTML,
            $o.find('.setMin')[0].innerHTML,
            $o.find('.setSec')[0].innerHTML,
            $o.find('.tmMin')[0].innerHTML,
            $o.find('.tmSec')[0].innerHTML,
            isNagative
        );
        startFlag =0;
    }
}

function settingOpener() {
    if($body.attr("class") == "setting") {
        $("div#mainArea").animate({left: "0%"}, SETTINGANIMATIONSPEED);
        $("div#settingArea").animate({left: "100%"}, SETTINGANIMATIONSPEED);
        $body.removeClass("setting");
    } else {
        $("div#mainArea").animate({left: "-100%"}, SETTINGANIMATIONSPEED);
        $("div#settingArea").animate({left: "0%"}, SETTINGANIMATIONSPEED);
        $body.addClass("setting");
    }
}

function entryAdd(evn) {
    var entryName = evn.data.obj.find(".entryName").val();
    var entryMin = evn.data.obj.find(".entryMin").val();
    var entrySec = evn.data.obj.find(".entrySec").val();

    if(!isFinite(entryMin) || entryMin == ""){
        alert("半角で数値を入力して下さい");
        return;
    }

    if(!isFinite(entrySec || entrySec == "")){
        alert("半角で数値を入力して下さい");
        return;
    }

    if(entrySec >= 60){
        entryMin++;
        entrySec-=60;
    }

    if(serchJSON(entryId) >= 0) {
        alert("既に存在する項目です");
        return;
    }

    addJSON(entryId,entryName, entryMin, entrySec, "", "", false);
    renderTable(entryId, entryName, entryMin, entrySec, "", "", false);
}

function renderTable(id, name, min, sec, nowMin, nowSec, isNagative) {
    if(!nowMin){
        nowMin = min;
    }
    if(!nowSec){
        nowSec = sec;
    }
    var isNagativeClass = (isNagative) ? ' over' : "";
    var $tr = $("<tr class='listItem"+isNagativeClass+"'>");

    var $startButton = $("<td>").append($('<p class="entryId">').text(id)).append($("<span>").append($("<input>").attr({class:"startButton", type:"button", value: "start"})));
    var $name = $("<td>").append($("<p class=\"trName\">").text(name));
    var $timersTime = $("<td>").append($("<p>").append($("<span>").attr({class:"tmMin"}).text(eval(nowMin))).append($("<span>").text(" : ")).append($("<span>").attr({class:"tmSec"}).text(zeroformat(nowSec,2))));
    var $setTime    = $("<td>").append($("<p>").append($("<span>").attr({class:"setMin"}).text(eval(min))).append($("<span>").text(" : ")).append($("<span>").attr({class:"setSec"}).text(zeroformat(sec,2))));
    var $deleteButton = $("<input>").attr({id:"setButton", type:"button", value: "delete"});
    var $button = $("<td>").append($("<p>").append($("<span>").append($deleteButton)));

    $tr.append($startButton).append($name).append($timersTime).append($setTime).append($button);
    $("table#entryListTable tbody").append($tr);

    $startButton.bind("click",{name:name,min:min,sec:sec,obj:$tr},startTimer);
    $deleteButton.bind("click",{obj:$tr},deleteTr);

    entryId++;
    return this;
}

function deleteTr(evt) {
    var id = evt.data.obj.find('.entryId')[0].innerHTML;
    console.log(id);
    console.log("entryData");
    console.log(entryData);
    entryData.splice(id, 1,undefined);
    console.log("entryData");
    console.log(entryData);
    updateStorage();
    evt.data.obj.remove();
}

function addJSON(id ,name, min, sec, nowMin, nowSec, isNagative) {
    //console.log(id);
    id = Number(id);
    entryData[id]={
        name: name,
        nowMin: nowMin,
        nowSec: nowSec,
        min: min,
        sec: sec,
        isNagative: isNagative,
    };
    console.log("entryData");
    console.log(entryData);

    updateStorage();
}

function readJSON() {
    var jsonData = localStorage['entry.list'];
    console.log("jsonData");
    console.log(jsonData);
    if(jsonData) {
        var data = JSON.parse(jsonData);
        for (var key in data){
            if(data[key]){
                entryData[entryId]=data[key];
                renderTable(entryId, data[key].name, data[key].min, data[key].sec, data[key].nowMin, data[key].nowSec, data[key].isNagative);
            }
        }
    }
    //alert(JSON.stringify(entryData));
}

function serchJSON(id) {
    var flg = -1;
    var i= 0;

    for (var key in entryData){
        if(key == id) {
            flg = i;
        }
        i++;
    }
    return flg;
}

function updateStorage() {
    localStorage['entry.list'] = JSON.stringify(entryData);
}


function zeroformat(v, n) {
    vl = String(v).length;
    if(n > vl) {
        return (new Array((n - vl) + 1).join(0)) + v;
    } else {
        return v;
    }
}


