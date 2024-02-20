function createTocList(itemsArray) {
	const navList = document.getElementById("document-toc-list");
	//const items = ["All Quotes", "All Projects"];

	//Build the nav
	itemsArray.forEach((item, i) => {
		const el = document.createElement("a");
		el.innerText = item;
		el.classList.add("document-toc-link");
		el.setAttribute("id", `menu-${i + 1}`);
		el.href = `#section${i + 1}`;

		const li = document.createElement("li");
		li.classList.add("document-toc-item");
		li.appendChild(el);
		li.setAttribute("id", `${i + 1}`);
		li.appendChild(el);

		// Append the list item to the list
		navList.appendChild(li);
	});

	//Make Nav Active when Clicked and scrolls down to section
	navList.addEventListener("click", function (event) {
		const targetItem = event.target.closest(".document-toc-item");
		if (targetItem) {
			const activeItem = navList.querySelector(".active");
			if (activeItem) {
				activeItem.classList.remove("active");
			}
			targetItem.classList.add("active");
			window.location.href = `#${targetItem.id}`;
		}
	});

	const topMenu = document.getElementById("document-toc-list");
	const topMenuHeight = topMenu.offsetTop + 1;
	const menuItems = document.querySelectorAll(".document-toc-link");
	const scrollItems = document.querySelectorAll("section");

	// Bind to scroll
	window.addEventListener("scroll", function () {
		// Get container scroll position
		const mainHeroHeight = document.querySelector(
			".main-page-content-header"
		).offsetTop;
		let fromTop = window.scrollY + topMenuHeight + mainHeroHeight;

		// Get id of current scroll item
		let id = "";

		[...scrollItems].forEach((item) => {
			if (item.offsetTop < fromTop) {
				id = item.id;
			}
		});

		let lastId;

		if (lastId !== id) {
			lastId = id;

			// Loop through menuItems and update aria-current accordingly
			menuItems.forEach((item) => {
				const shouldBeCurrent = item.getAttribute("href") === `#${id}`;

				// Update aria-current attribute
				item.setAttribute("aria-current", shouldBeCurrent ? "true" : "false");
			});
		}
	});
}

$(function () {
	$(".pat1").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/1.png) repeat"
		);
		return false;
	});

	$(".pat2").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/2.png) repeat"
		);
		return false;
	});

	$(".pat3").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/3.png) repeat"
		);
		return false;
	});

	$(".pat4").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/4.png) repeat"
		);
		return false;
	});

	$(".pat5").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/5.png) repeat"
		);
		return false;
	});

	$(".pat6").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/6.png) repeat"
		);
		return false;
	});

	$(".pat7").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/7.png) repeat"
		);
		return false;
	});

	$(".pat8").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/8.png) repeat"
		);
		return false;
	});

	$(".pat9").on("click", function () {
		$("html").css(
			"background",
			"url(images/backgrounds/patterns/9.png) repeat"
		);
		return false;
	});

	$(".pat10").on("click", function () {
		$("html").css("background", "url(images/backgrounds/bg.jpg) repeat");
		return false;
	});

	$("#leftSide");

	/* Form related plugins
  ================================================== */

	//===== Input limiter =====//

	$(".lim").inputlimiter({
		limit: 100,
		//boxClass: 'limBox',
		//boxAttach: false
	});

	//===== Multiple select with dropdown =====//

	$(".chzn-select").chosen();

	//===== Placeholder =====//

	$("input[placeholder], textarea[placeholder]").placeholder();

	//===== Autocomplete =====//

	var address = [
		"Precise Tile & Contracting Inc.",
		"Precision Building Products",
		"Centura (Quebec) Limited - Montreal",
		"Centura (Quebec) Limited - Quebec",
		"Centura (Toronto) Limited",
		"Centura (Vancouver) Limited",
		"Centura Limited",
		"Centura Peterborough",
		"Centura Western - Calgary",
		"Centura Western - Edmonton",
	];

	$("#centura_address").autocomplete({
		source: address,
	});

	var contractor = [
		"Ashlee Archibald",
		"Andrew Batey",
		"Alexandra Bolduc",
		"Anthony Campbell",
		"Angela Cozzi",
		"Allen Czerwinski",
		"Albert DeRosa",
		"PowerCerv Administrator",
		"Administrator Administrator",
		"Anna Jagielomicz",
		"Alan Lee",
		"Annick Martel",
		"Amanda Masih",
		"Al McLeod",
		"Angela Molezzi",
		"Alan Morin",
		"Angus Morrison",
		"Amanda Plati",
		"Alan Postma",
		"Alexandre Rochon",
		"Anne Upson",
		"Alain Verreault",
		"Alain Viel",
		"Bill Allen",
		"Bill Blake",
		"Bien Cardona",
		"Ben Causer",
		"Bob Christian",
		"Brian Cowie",
		"Brian Ehler",
		"Brian Fenton",
		"Bill Gailer",
		"Bert Green",
	];

	$("#contractor,#contractor_b").autocomplete({
		source: contractor,
	});

	//===== Masked input =====//

	$.mask.definitions["~"] = "[+-]";
	$(".maskDate").mask("99/99/9999", {
		completed: function () {
			alert("Callback when completed");
		},
	});
	$(".maskPhone").mask("(999) 999-9999");
	$(".maskPhoneExt").mask("(999) 999-9999? x99999");
	$(".maskIntPhone").mask("+33 999 999 999");
	$(".maskTin").mask("99-9999999");
	$(".maskSsn").mask("999-99-9999");
	$(".maskProd").mask("a*-999-a999", { placeholder: " " });
	$(".maskEye").mask("~9.99 ~9.99 999");
	$(".maskPo").mask("PO: aaa-999-***");
	$(".maskPct").mask("99%");
	$(".maskid").mask("99999");

	//===== Dual select boxes =====//

	$.configureBoxes();

	//===== Wizards =====//

	$("#wizard1").formwizard({
		formPluginEnabled: true,
		validationEnabled: false,
		focusFirstInput: false,
		disableUIStyles: true,

		formOptions: {
			success: function (_data) {
				$("#status1").fadeTo(500, 1, function () {
					$(this).html("<span>Form was submitted!</span>").fadeTo(5000, 0);
				});
			},
			beforeSubmit: function (data) {
				$("#w1").html(
					"<span>Form was submitted with ajax. Data sent to the server: " +
					$.param(data) +
					"</span>"
				);
			},
			resetForm: true,
		},
	});

	$("#wizard2").formwizard({
		formPluginEnabled: true,
		validationEnabled: true,
		focusFirstInput: false,
		disableUIStyles: true,

		formOptions: {
			success: function (_data) {
				$("#status2").fadeTo(500, 1, function () {
					$(this).html("<span>Form was submitted!</span>").fadeTo(5000, 0);
				});
			},
			beforeSubmit: function (data) {
				$("#w2").html(
					"<span>Form was submitted with ajax. Data sent to the server: " +
					$.param(data) +
					"</span>"
				);
			},
			dataType: "json",
			resetForm: true,
		},
		validationOptions: {
			rules: {
				bazinga: "required",
				email: { required: true, email: true },
			},
			messages: {
				bazinga: "Bazinga. This note is editable",
				email: {
					required: "Please specify your email",
					email: "Correct format is name@domain.com",
				},
			},
		},
	});

	$("#wizard3").formwizard({
		formPluginEnabled: false,
		validationEnabled: false,
		focusFirstInput: false,
		disableUIStyles: true,
	});

	//===== Validation engine =====//

	$("#validate,#quote_content,#project_content").validationEngine();

	//===== WYSIWYG editor =====//

	$("#editor").cleditor({
		width: "100%",
		height: "100%",
		bodyStyle: "margin: 10px; font: 12px Arial,Verdana; cursor:text",
	});

	//===== File uploader =====//

	$("#uploader").pluploadQueue({
		runtimes: "html5,html4",
		url: "php/upload.php",
		max_file_size: "1mb",
		unique_names: true,
		filters: [
			{ title: "Image files", extensions: "jpg,gif,png" },
			//{title : "Zip files", extensions : "zip"}
		],
	});

	//===== Tags =====//

	$("#tags").tagsInput({ width: "100%" });

	//===== Autogrowing textarea =====//

	$(".autoGrow").autoGrow();

	/* General stuff
  ================================================== */

	//===== Left navigation styling =====//

	$("li.this").prev("li").css("border-bottom-color", "#2c3237");
	$("li.this").next("li").css("border-top-color", "#2c3237");

	/*$('.smalldd ul li').mouseover(
	  function() { $(this).prev('li').css('border-bottom-color', '#3d434a') }
	  );
  	
	  $('.smalldd ul li').mouseout(
	  function() { $(this).prev('li').css('border-bottom-color', '#1c252a') }
	  );*/

	//$('.smalldd ul li').next('li').css('border-top-color', '#2c3237');

	/*$('ul.nav li a').mouseover(
		  function(){
		  $(this).parent().prev('li').children("> a").addClass('bottomBorder'); 
		  }
		  );
	  	
		  $('ul.nav li a').mouseout(
		  function(){
		  $(this).parent().prev('li').children("a").removeClass('bottomBorder'); 
		  }
	  );*/

	//===== User nav dropdown =====//

	$(".dd").on("click", function () {
		$(".userDropdown").slideToggle(200);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("dd")) $(".userDropdown").slideUp(200);
	});

	//===== Statistics row dropdowns =====//

	$(".ticketsStats > h2 a").on("click", function () {
		$("#s1").slideToggle(150);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("ticketsStats")) $("#s1").slideUp(150);
	});

	$(".visitsStats > h2 a").on("click", function () {
		$("#s2").slideToggle(150);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("visitsStats")) $("#s2").slideUp(150);
	});

	$(".usersStats > h2 a").on("click", function () {
		$("#s3").slideToggle(150);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("usersStats")) $("#s3").slideUp(150);
	});

	$(".ordersStats > h2 a").on("click", function () {
		$("#s4").slideToggle(150);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("ordersStats")) $("#s4").slideUp(150);
	});

	//===== Collapsible elements management =====//

	$(".exp").collapsible({
		defaultOpen: "current",
		cookieName: "navAct",
		cssOpen: "active",
		cssClose: "inactive",
		speed: 200,
	});

	$(".opened").collapsible({
		defaultOpen: "opened,toggleOpened",
		cssOpen: "inactive",
		cssClose: "normal",
		speed: 200,
	});

	$(".closed").collapsible({
		defaultOpen: "",
		cssOpen: "inactive",
		cssClose: "normal",
		speed: 200,
	});

	$(".goTo").collapsible({
		defaultOpen: "openedDrop",
		cookieName: "smallNavAct",
		cssOpen: "active",
		cssClose: "inactive",
		speed: 100,
	});

	/*$(document).bind('click', function(e) {
		  var $clicked = $(e.target);
		  if (! $clicked.parents().hasClass("smalldd"))
		  $(".smallDropdown").slideUp(200);
	  });*/

	//===== Middle navigation dropdowns =====//

	$(".mUser").on("click", function () {
		$(".mSub1").slideToggle(100);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("mUser")) $(".mSub1").slideUp(100);
	});

	$(".mMessages").on("click", function () {
		$(".mSub2").slideToggle(100);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("mMessages")) $(".mSub2").slideUp(100);
	});

	$(".mFiles").on("click", function () {
		$(".mSub3").slideToggle(100);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("mFiles")) $(".mSub3").slideUp(100);
	});

	$(".mOrders").on("click", function () {
		$(".mSub4").slideToggle(100);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("mOrders")) $(".mSub4").slideUp(100);
	});

	//===== User nav dropdown =====//

	$(".sidedd").on("click", function () {
		$(".sideDropdown").slideToggle(200);
	});
	$(document).on("click", function (e) {
		var $clicked = $(e.target);
		if (!$clicked.parents().hasClass("sidedd")) $(".sideDropdown").slideUp(200);
	});

	//$('.smalldd').click(function () {
	//	$('.smallDropdown').slideDown(200);
	//});

	/* Tables
  ================================================== */

	//===== Check all checbboxes =====//

	$(".titleIcon input:checkbox").on("click", function () {
		var checkedStatus = this.checked;
		$("#checkAll tbody tr td:first-child input:checkbox").each(function () {
			this.checked = checkedStatus;
			if (checkedStatus == this.checked) {
				$(this).closest(".checker > span").removeClass("checked");
			}
			if (this.checked) {
				$(this).closest(".checker > span").addClass("checked");
			}
		});
	});

	$("#checkAll tbody tr td:first-child")
		.next("td")
		.css("border-left-color", "#CBCBCB");

	//===== Resizable columns =====//

	/*$("#res, #res1").colResizable({
		  liveDrag:true,
		  draggingClass:"dragging" 
	  });*/

	//===== Sortable columns =====//

	//$("table").tablesorter();

	//===== Dynamic data table =====//

	//oTable = $('.dTable').DataTable({
	//	"bJQueryUI": true,
	//	"sPaginationType": "full_numbers",
	//	"sDom": '<""l>t<"F"fp>'
	//});

	/* # Pickers
  ================================================== */

	//===== Color picker =====//

	$("#cPicker").ColorPicker({
		color: "#e62e90",
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (_hsb, hex, _rgb) {
			$("#cPicker div").css("backgroundColor", "#" + hex);
		},
	});

	$("#flatPicker").ColorPicker({ flat: true });

	//===== Time picker =====//

	$(".timepicker").timeEntry({
		show24Hours: true, // 24 hours format
		showSeconds: true, // Show seconds?
		spinnerImage: "images/forms/spinnerUpDown.png", // Arrows image
		spinnerSize: [19, 30, 0], // Image size
		spinnerIncDecOnly: true, // Only up and down arrows
	});

	//===== Datepickers =====//

	$(".datepicker").datepicker({
		defaultDate: +7,
		autoSize: true,
		appendText: "(yy-mm-dd)",
		dateFormat: "yy-mm-dd",
	});

	$(".datepickerInline").datepicker({
		defaultDate: +7,
		autoSize: true,
		appendText: "(yy-mm-dd)",
		dateFormat: "yy-mm-dd",
		numberOfMonths: 1,
	});

	//===== Progress bars =====//

	// default mode
	$("#progress1").anim_progressbar();

	// from second #5 till 15
	var iNow = new Date().setTime(new Date().getTime() + 5 * 1000); // now plus 5 secs
	var iEnd = new Date().setTime(new Date().getTime() + 15 * 1000); // now plus 15 secs
	$("#progress2").anim_progressbar({ start: iNow, finish: iEnd, interval: 1 });

	// jQuery UI progress bar
	$("#progress").progressbar({
		value: 80,
	});

	//===== Animated progress bars =====//

	var percent = $(".progressG").attr("title");
	$(".progressG").animate({ width: percent }, 1000);

	var percent = $(".progressO").attr("title");
	$(".progressO").animate({ width: percent }, 1000);

	var percent = $(".progressB").attr("title");
	$(".progressB").animate({ width: percent }, 1000);

	var percent = $(".progressR").attr("title");
	$(".progressR").animate({ width: percent }, 1000);

	var percent = $("#bar1").attr("title");
	$("#bar1").animate({ width: percent }, 1000);

	var percent = $("#bar2").attr("title");
	$("#bar2").animate({ width: percent }, 1000);

	var percent = $("#bar3").attr("title");
	$("#bar3").animate({ width: percent }, 1000);

	var percent = $("#bar4").attr("title");
	$("#bar4").animate({ width: percent }, 1000);

	var percent = $("#bar5").attr("title");
	$("#bar5").animate({ width: percent }, 1000);

	var percent = $("#bar6").attr("title");
	$("#bar6").animate({ width: percent }, 1000);

	var percent = $("#bar7").attr("title");
	$("#bar7").animate({ width: percent }, 1000);

	var percent = $("#bar8").attr("title");
	$("#bar8").animate({ width: percent }, 1000);

	var percent = $("#bar9").attr("title");
	$("#bar9").animate({ width: percent }, 1000);

	/* Other plugins
  ================================================== */

	//===== File manager =====//

	$("#fm").elfinder({
		url: "php/connector.php",
		toolbar: [
			["back", "reload"],
			["select", "open"],
			["quicklook", "rename"],

			["resize", "icons", "list"],
		],
		contextmenu: {
			// Commands that can be executed for current directory
			cwd: ["reload", "delim", "info"],
			// Commands for only one selected file
			file: ["select", "open", "rename"],
		},
	});

	//===== Calendar =====//

	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();

	$(".calendar").fullCalendar({
		header: {
			left: "prev,next",
			center: "title",
			right: "month,basicWeek,basicDay",
		},
		editable: true,
		events: [
			{
				title: "All day event",
				start: new Date(y, m, 1),
			},
			{
				title: "Long event",
				start: new Date(y, m, 5),
				end: new Date(y, m, 8),
			},
			{
				id: 999,
				title: "Repeating event",
				start: new Date(y, m, 2, 16, 0),
				end: new Date(y, m, 3, 18, 0),
				allDay: false,
			},
			{
				id: 999,
				title: "Repeating event",
				start: new Date(y, m, 9, 16, 0),
				end: new Date(y, m, 10, 18, 0),
				allDay: false,
			},
			{
				title: "Background color could be changed",
				start: new Date(y, m, 30, 10, 30),
				end: new Date(y, m, d + 1, 14, 0),
				allDay: false,
				color: "#5c90b5",
			},
			{
				title: "Lunch",
				start: new Date(y, m, 14, 12, 0),
				end: new Date(y, m, 15, 14, 0),
				allDay: false,
			},
			{
				title: "Birthday PARTY",
				start: new Date(y, m, 18),
				end: new Date(y, m, 20),
				allDay: false,
			},
			{
				title: "Clackable",
				start: new Date(y, m, 27),
				end: new Date(y, m, 29),
				url: "http://themeforest.net/user/Kopyov",
			},
		],
	});

	/* UI stuff
  ================================================== */

	//===== Sparklines =====//

	$(".negBar").sparkline("html", { type: "bar", barColor: "#db6464" });
	$(".posBar").sparkline("html", { type: "bar", barColor: "#6daa24" });
	$(".zeroBar").sparkline("html", { type: "bar", barColor: "#4e8fc6" });

	//===== Tooltips =====//

	$(".tipN").tipsy({ gravity: "n", fade: true });
	$(".tipS").tipsy({ gravity: "s", fade: true });
	$(".tipW").tipsy({ gravity: "w", fade: true });
	$(".tipE").tipsy({ gravity: "e", fade: true });

	//===== Accordion =====//

	$("div.menu_body:eq(0)").show();
	$(".acc .title:eq(0)").show().css({ color: "#2B6893" });

	$(".acc .title").on("click", function () {
		$(this)
			.css({ color: "#2B6893" })
			.next("div.menu_body")
			.slideToggle(300)
			.siblings("div.menu_body")
			.slideUp("slow");
		$(this).siblings().css({ color: "#404040" });
	});

	//===== Tabs =====//

	$.fn.contentTabs = function () {
		$(this).find(".tab_content").hide(); //Hide all content
		$(this).find("ul.tabs li:first").addClass("activeTab").show(); //Activate first tab
		$(this).find(".tab_content:first").show(); //Show first tab content

		$("ul.tabs li").on("click", function () {
			$(this).parent().parent().find("ul.tabs li").removeClass("activeTab"); //Remove any "active" class
			$(this).addClass("activeTab"); //Add "active" class to selected tab
			$(this).parent().parent().find(".tab_content").hide(); //Hide all tab content
			var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
			$(activeTab).show(); //Fade in the active content
			return false;
		});
	};
	$("div[class^='widget']").contentTabs(); //Run function on any div with class name of "Content Tabs"

	//===== Notification boxes =====//

	$(".hideit").on("click", function () {
		$(this).fadeTo(200, 0.0, function () {
			//fade
			$(this).slideUp(300, function () {
				//slide up
				$(this).remove(); //then remove from the DOM
			});
		});
	});

	//===== Lightbox =====//

	$("a[rel^='lightbox']").prettyPhoto();

	//===== Image gallery control buttons =====//

	$(".gallery ul li")
		.on("mouseenter", function () {
			$(this).children(".actions").show("fade", 200);
		})
		.on("mouseleave", function () {
			$(this).children(".actions").hide("fade", 200);
		});

	//===== Spinner options =====//

	var itemList = [
		{ url: "http://ejohn.org", title: "John Resig" },
		{ url: "http://bassistance.de/", title: "J&ouml;rn Zaefferer" },
		{ url: "http://snook.ca/jonathan/", title: "Jonathan Snook" },
		{ url: "http://rdworth.org/", title: "Richard Worth" },
		{ url: "http://www.paulbakaus.com/", title: "Paul Bakaus" },
		{ url: "http://www.yehudakatz.com/", title: "Yehuda Katz" },
		{ url: "http://www.azarask.in/", title: "Aza Raskin" },
		{ url: "http://www.karlswedberg.com/", title: "Karl Swedberg" },
		{ url: "http://scottjehl.com/", title: "Scott Jehl" },
		{ url: "http://jdsharp.us/", title: "Jonathan Sharp" },
		{ url: "http://www.kevinhoyt.org/", title: "Kevin Hoyt" },
		{ url: "http://www.codylindley.com/", title: "Cody Lindley" },
		{ url: "http://malsup.com/jquery/", title: "Mike Alsup" },
	];

	var opts = {
		sDec: { decimals: 2 },
		sStep: { stepping: 0.25 },
		sCur: { currency: "$" },
		sInline: {},
		sLink: {
			//
			// Two methods of adding external items to the spinner
			//
			// method 1: on initalisation call the add method directly and format html manually
			init: function (_e, ui) {
				for (var i = 0; i < itemList.length; i++) {
					ui.add(
						'<a href="' +
						itemList[i].url +
						'" target="_blank">' +
						itemList[i].title +
						"</a>"
					);
				}
			},

			// method 2: use the format and items options in combination
			format: '<a href="%(url)" target="_blank">%(title)</a>',
			items: itemList,
		},
	};

	for (var n in opts) $("#" + n).spinner(opts[n]);

	/*$("button").on("click", (function(e){
		  var ns = $(this).attr('id').match(/(s\d)\-(\w+)$/);
		  if (ns != null)
			  $('#'+ns[1]).spinner( (ns[2] == 'create') ? opts[ns[1]] : ns[2]);
	  }));*/

	//===== UI dialog =====//

	$("#opener").on("click", function () {
		$("#dialog-message").dialog("open");
		return false;
	});

	//===== Breadcrumbs =====//

	$("#breadcrumbs").xBreadcrumbs();

	//===== jQuery UI sliders =====//

	$(".uiSlider").slider(); /* Usual slider */

	$(".uiSliderInc").slider({
    /* Increments slider */ value: 100,
		min: 0,
		max: 500,
		step: 50,
		slide: function (_event, ui) {
			$("#amount").val("$" + ui.value);
		},
	});
	$("#amount").val("$" + $(".uiSliderInc").slider("value"));

	$(".uiRangeSlider").slider({
    /* Range slider */ range: true,
		min: 0,
		max: 500,
		values: [75, 300],
		slide: function (_event, ui) {
			$("#rangeAmount").val("$" + ui.values[0] + " - $" + ui.values[1]);
		},
	});
	$("#rangeAmount").val(
		"$" +
		$(".uiRangeSlider").slider("values", 0) +
		" - $" +
		$(".uiRangeSlider").slider("values", 1)
	);

	$(".uiMinRange").slider({
    /* Slider with minimum */ range: "min",
		value: 37,
		min: 1,
		max: 700,
		slide: function (_event, ui) {
			$("#minRangeAmount").val("$" + ui.value);
		},
	});
	$("#minRangeAmount").val("$" + $(".uiMinRange").slider("value"));

	$(".uiMaxRange").slider({
    /* Slider with maximum */ range: "max",
		min: 1,
		max: 100,
		value: 20,
		slide: function (_event, ui) {
			$("#maxRangeAmount").val(ui.value);
		},
	});
	$("#maxRangeAmount").val($(".uiMaxRange").slider("value"));

	//===== Form elements styling =====//

	$(
		"select:not(.chzn-select), input:checkbox, input:radio, input:file"
	).uniform();
});
