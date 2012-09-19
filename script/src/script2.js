// JavaScript Document
$(function() {
	timerBoxWidth = $("p#timerText").width();
	timerNumWidth = "";
	SETTINGANIMATIONSPEED = 500;
	
	timer = 0;
	timerCount = 0;
	timerString = "";
	targetTimerMin = 1;
	targetTimerSec = 0;
	targetTimer = "";
	
	timerHr = "";
	timerMin = "";
	timerSec = "";
	
	entryData = [];
	readJSON();

	$body = $("body");
	$timerText = $("#timerText");
//	var $timerTextHr = $("#hr");
	$timerTextMin = $("#min");
	$timerTextSec = $("#sec");
	
	var wWidth = $(window).width();
	var wHeight = $(window).height();
	
	/* set fitText */
	var $txt = $timerText.fitText(0.8).css("top",(wHeight - $timerText.height()) / 2);
	
	$("input#startButton").click(startTimer);
	$("input#stopButton").click(stopTimer);
	
	$("img#setting").click(settingOpener);

    var $add_o

	$("input.entryAddButton").bind("click",$("input.entryAddButton").parent("tr"),entryAdd);
	
	$("input.stopButton").click(function() {
		localStorage.clear();
		alert("クリア！！");
	});
	
	/* timerText design */
	$(window).load(function() {
		timerNumWidth = $("span#sec").width();	
//		$timerTextHr.css("width", timerNumWidth);
		$timerTextMin.css("width", timerNumWidth);
		$timerTextSec.css("width", timerNumWidth);
	});
});

function startTimer() {
	$body.removeAttr("id");
	jQuery(document).stopTime("timer01");
	targetTimer = (targetTimerMin * 60) + targetTimerSec;
	timer = targetTimer;
	
	jQuery(document).everyTime(1000,"timer01",function () {
		timer = targetTimer - timerCount;
		console.log(timer);
		if(timer < 0) {
			console.log("negative");
			$("body").attr("id", "over");
			timer = Math.abs(timer);
		}
//		timertHr = Math.floor(timer / 3660 % 60);
		timerMin = Math.floor(timer / 60 % 60);
		timerSec = Math.floor(timer % 60); 

//		$timerTextHr.text((timerHr > 0)? timerHr : "");
		$timerTextMin.text(timerMin);
		$timerTextSec.text(timerSec);
		timerCount++;
	});
}

function stopTimer() {
	jQuery(document).stopTime("timer01");
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

function entryAdd(obj) {
	var entryName = obj.children(".entryName");
	var entryMin = obj.$(".entryMin");
	var entrySec = obj.$(".entrySec");
	
	if(serchJSON(entryName) >= 0) {
		alert("既に存在する項目です");
		return;
	}
	
	addJSON(entryName, entryMin, entrySec);
	renderTable(entryName, entryMin, entrySec);
}

function renderTable(name, min, sec) {
	var $tr = $("<tr>");
	var $name = $("<td>").append($("<p>").text(name));
	var $time = $("<td>").append($("<p>").append($("<span>").text(min)).append($("<span>").text(" : ")).append($("<span>").text(sec)));
	var $editButton = $("<input>").attr({type:"button", value: "edit"});
	var $deleteButton = $("<input>").attr({type:"button", value: "delete"});
	var $button = $("<td>").append($("<p>").append($("<span>").append($editButton)).append($("<span>").append($deleteButton)));
	
	$deleteButton.bind("click",$tr,deleteTr);
	
	$tr.append($name).append($time).append($button);
	$("table#entryListTable tbody").append($tr);
}

function deleteTr($tr) {
	$tr.data.remove();
}

function addJSON(name, min, sec) {
	entryData.push({
		name: name,
		min: min,
		sec: sec
	});
	
	updateStorage();
}

function readJSON() {
	var jsonData = localStorage['entry.list'];
	if(jsonData) {
		JSON.parse(jsonData).forEach(function (item){
			renderTable(item.name, item.min, item.sec);
			entryData.push(item);
		});
	}
	alert(JSON.stringify(entryData));
}

function serchJSON(name) {
	var flg = -1;
	var i= 0;
	entryData.forEach(function(item) {
		if(item.name == name) {
			flg = i;
		}
		i++;
	});
	return flg;
}

function updateStorage() {
	localStorage['entry.list'] = JSON.stringify(entryData);
}
