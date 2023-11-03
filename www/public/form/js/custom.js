$(function() {
	
	
    $(".pat1").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/1.png) repeat');
        return false;
    });
    
    $(".pat2").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/2.png) repeat');
        return false;
    });
    
    $(".pat3").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/3.png) repeat');
        return false;
    });
	
    $(".pat4").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/4.png) repeat');
        return false;
    });
    
    $(".pat5").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/5.png) repeat');
        return false;
    });
	
    $(".pat6").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/6.png) repeat');
        return false;
    });
    
    $(".pat7").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/7.png) repeat');
        return false;
    });
    
    $(".pat8").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/8.png) repeat');
        return false;
    });
	
    $(".pat9").click(function(){
        $("html").css('background','url(images/backgrounds/patterns/9.png) repeat');
        return false;
    });
    
    $(".pat10").click(function(){
        $("html").css('background','url(images/backgrounds/bg.jpg) repeat');
        return false;
    });
	
	
/* Form related plugins
================================================== */

	//===== Input limiter =====//
	
	$('.lim').inputlimiter({
		limit: 100
		//boxClass: 'limBox',
		//boxAttach: false
	});


	//===== Multiple select with dropdown =====//
	
	$(".chzn-select").chosen(); 
	
	
	//===== Placeholder =====//
	
	$('input[placeholder], textarea[placeholder]').placeholder();
	
	
	//===== ShowCode plugin for <pre> tag =====//
	
	$('.showCode').sourcerer('js html css php'); // Display all languages
	$('.showCodeJS').sourcerer('js'); // Display JS only
	$('.showCodeHTML').sourcerer('html'); // Display HTML only
	$('.showCodePHP').sourcerer('php'); // Display PHP only
	$('.showCodeCSS').sourcerer('css'); // Display CSS only
	
	
	//===== Autocomplete =====//
	
	var availableTags = [  
	"Cinca 1.5X22 Koval Black Listello",
"Cinca 1.5X22 Koval Brown Listello",
"Cinca 1.5X22 Desert Black Listello",
"Cinca 1.5X22 Desert Brown Listello",
"Cinca 2X22 Bellagio Hooters Brick Border",
"Cinca 2X22 Bellagio Hooters Antrac Bord",
"Rubi PVC Pipe",
"Gemini T3 Drive Belt",
"Gemini Revolution Drive Belt",
"US Foam 4X9 Scrubbies White (Fine)",
"US Foam 4X9 Scrubbies Blue (Medium)",
"Rubi Slider Base TI-66/75 Set",
"Rubi TI Separator White Protectors 4pk",
"Rubi 1/4 (6mm) Scoring Wheel",
"Rubi 13/32 (10mm) Scoring Wheel",
"Rubi 1/4 (6mm) Double Scoring Wheel",
"Rubi 1/4 & 13/32 Scoring Wheel Set",
"Rubi 13/32 (10mm) Scoring Wheel",
"Rubi 3/4 (18mm) Scoring Wheel",
"Rubi 7/8 Tungsten Carbide Scoring Wheel",
"Rubi 13/16 (18mm) Gold Scoring Wheel",
"Rubi 3/4 (18mm) Gold Scoring Wheel",
"Rubi 5/16 (8mm) Scoring Wheel",
"Rubi 5/16 (8mm) Scoring Wheel Plus",
"Rubi 1/8 (22mm) Scoring Wheel",
"Rubi 7/8 Carbide Scoring Wheel",
"Rubi 7/8 (22mm) Gold Scoring Wheel",
"Rubi 7/8 (22mm) Scoring Wheel Gold Plus",
"Rubi Punching Tool",
"Rubi 45 Degree Punching Tool",
"Rubi 3/4 Widia Gold Scoring Wheel",
"Rubi 10mm Replacement Wheel",
"Rubi 18mm Replacement Wheel",
"Rubi 22mm Replacement Wheel",
"Rubi 13/32 TI Gold Scoring Wheel",
"Rubi 7/8 TI Gold Scoring Wheel",
"Rubi 3pc Tool Set - 01945-01970-01971",
"Rubi 13/32 (10mm) Scoring Wheel",
"Rubi 1 3/4 (18mm) Scoring Wheel",
"Rubi 13/32 (10mm) Plus Scoring Wheel",
"Rubi 3/4in (18mm) Gold Scoring Wheel",
"Rubi Scoring Wheel Kit 2",
"Roppe 2X9ft 1 Comm Str Nose Sq 140 Fawn",
"Rubi 1/8 (3mm) Tile Spacers (1000)",
"Rubi 3/16 (5mm) Tile Spacers (1000)",
"Rubi 1/32 (1mm) Tile Spacer (1000/Bag)",
"Rubi 1/16 Tile Spacers (1000pc)",
"Rubi 1/4 Tile Spacers (100pc)",
"Rubi 1/2 Tile Spacers (50)",
"Rubi 1/16 Tile Spacers - Display Box",
"Rubi 1/8 Tile Spacers Display Box",
"Rubi 1/8-L Tile Spacers - Display Box",
"Rubi 3/16 Tile Spacers Display Box",
"Rubi 1/4 Tile Spacers Display Box",
"Rubi 1/16 Tile Spacers - Column Box",
"Rubi 1/8-L Tile Spacers - Column Box",
"Rubi 3/16 Tile Spacers Column Box",
"Rubi 1/4 Tile Spacers Column Box",
"Rubi 3/16 Wedges - Column Box Set of 3",
"Rubi 5/16 Wedges - Column Box Set of 3",
"Vitra 1X1 Ral Red Mosaic 3020",
"Vitra 1X1 Ral Dark Blue Mosaic 5002",
"Vitra 1X1 Ral Black Mosaic 000 1500",
"Vitra 1X1 Ral Grey Mosaic 000 7500",
"Vitra 1X1 Ral Light Grey Mosaic 7047",
"Vitra 1X1 Ral White Mosaic 9016",
"Vitra 1X1 Ral White Glossy Mosaic 9016",
"Vitra 1X1 Ral Caramel Mosaic 060 7040",
"Vitra 1X1 Ral Sahara Mosaic 070 8030",
"Vitra 1X1 Ral Biscuit Mosaic 080 9005",
"Vitra 1X1 Ral Bone Mosaic 090 9010",
"Vitra 1X1 Ral Yellow Mosaic 090 9040",
"Vitra 1X1 Ral Cream Mosaic 095 8010",
"Vitra 1X1 Ral Candy Green Mosaic 1407020",
"Vitra 1X1 Ral Light Green Mosaic 1609010",
"Vitra 1X1 Ral Green Mosaic 170 7010",
"Vitra 1X1 Ral Turquoise Mosaic 190 6025",
"Vitra 1X1 Ral Calypso Mosaic 200 8020",
"Vitra 1X1 Ral Pool Blue Mosaic 230 7015",
"Vitra 1X1 Ral Pool Blue Mosaic 230 7015",
"Vitra 1X1 Ral Blue Glossy Mosaic 2606030",
"Vitra 1X1 Ral Blue 1 Mosaic 260 6030",
"Vitra 1X1 Ral Dark Salmon Mosaic 0405050",
"Vitra 1X1 Ral Dark Salmon Mosaic 0405050",
"Vitra 1X1 Ral Dark Caramel Mos 0607050",
"Vitra 1X1 Ral Dawn Mosaic 340 3005",
"Vitra 1X1 Uni Super White Mosaic Mat",
"Vitra 1X2 Uni Super White Coping (523615",
"Vitra 1X2 Uni Super White CVB (803771)",
"Vitra 1X1 Uni Super White CVB (803782)",
"Vitra 1X1 Uni Super White CVB (797412)",
"Vitra 2X2 Uni Super White RE (803723)",
"Vitra 1X1 Uni Ivory Mosaic Mat",
"Vitra 1X1 Uni Yellow 1 Mosaic Mat",
"Vitra 1X2 Uni Grey CVB (803675)",
"Vitra 1X1 Uni Light Pink Mosaic Mat",
"Vitra 1X1 Uni Green Mosaic Mat",
"Vitra 1X1 Uni Blue Mosaic Mat",
"Vitra 1X1 Uni Super Black Mosaic Mat",
"Vitra 1X2 Uni Super Black Coping",
"Vitra 1X2 Uni Super Black Inside Corner",
"Vitra 1X1 Uni Super Black Cove Base",
"Vitra 2X2 Uni Super Black RE (803723)",
"Vitra 1X1 Uni Grey Mosic Mat",
"Vitra 1X1 Uni Cobalt Blue Mosaic Mat",
"Vitra 1X1 Uni Black Mosaic Mat",
"Vitra 1X1 Dotti Ivory Mosaic Mat",
"Vitra 1X1 Dotti Blue Mosaic Mat",
"Vitra 1X1 Dotti Green Mosaic Mat",
"Vitra 1X1 Dotti Light Grey Mosaic Mat",
"Vitra 1X1 Dotti Dark Grey Mosaic Mat",
"Gemini XT/Rev 45 Degree",
"Vitra 1X1 Ral Ice Grey Mosaic 080 8005",
"Vitra 1X1 Ral Dark Grey Mosaic 0005500",
"Rubi 3/32 (2mm) Tile Spacers (300/pk)",
"Rubi 1/8 (3mm) Tile Spacers (200)",
"Rubi 3/16 (5mm) Tile Spacer (100)",
"Rubi 9/32 (7mm) Tile Spacer (100)",
"Rubi 1/32 (1mm) Tile Spacer (300)",
"Rubi 1/16 (1.5mm) Tile Spacer (300)",
"Vitra 1X1 Uni Purple Mosaic Mat",
"Vitra 1X1 Uni Mid Turquoise Mosaic Mat",
"Rubi 1/8 (3mm) T Tile Spacers (200)",
"Rubi 3/16 T-Spacers for Joints (100pc)",
"Rubi 3/16 (5mm) Extractable Spacer (100)",
"Rubi 3/16 Wedge Spacers (500)",
"Rubi 5/16 Wedges Spacers (500)",
"Rubi 1/8in Special Long Spacers 200pcs",
"Rubi 5/32 Tile Spacers (200)",
"Rubi 1/32 (1mm) Tile Spacers (1000/Box)",
"Vitra 1X1 Ral Dark Grey/Brown 0706010",
"Rubi 1/16 (1.5mm) Tile Spacers 1000/Box",
"Rubi 1/8 (3mm) Tile Spacers 1000/Box",
"Roppe 102in Vantage w/Riser Rub St Trd",
"Rubi 3/16 (5mm) Tile Spacers 1000/Box",
"Rubi 5/32in Tile Spacer 1000pcs",
"Rubi Campana Tile Level Cap (C-100)",
"Rubi Brida Tile Level Strip (C-100)",
"Rubi Tenaza Tile Level Pliers",
"Rubi Tile Level Kit (100)",
"Vitra 1X1 Ral Dawn Mosaic 300 9005",
"Vitra 1X1 Ral Dawn Mosaic 360 7005",
"Vitra 1X1 Ral Dawn Mosaic 340 8005",
"Vitra 1X1 Ral Dawn Mosaic 320 9005",
"Vitra 1X1 Ral Violet Mosaic 260 8010",
"Vitra 1X1 Ral Violet Mosaic 260 7020",
"Vitra 1X1 Ral Sand Beige Mosaic 090 9020",
"Vitra 1X1 Ral Sand Beige Mosaic 085 8020",
"Vitra 1X1 Ral Sand Beige Mosaic 09509010",
"Stabila Laser Pro-Liner 2",
"Stabila 300ft ProLiner Leveling Laser",
"US Foam 5X7 Quarry Sponge XLS",
"Vitra 12X18 Ararat Grey/Black Border",
"Vitra 12X18 Ararat Beige Border",
"Roppe 39in Metal Stair Tread 9in Blk/Blk",
"Raimondi 600X110mm Bulldog Trolley",
"Roppe 9ft Resid Stair Nos SQ 191 Camel",
"Gemini Fan For Revolution XT Saw",
"Vitra 2X8 Fiore Sand Border",
"Vitra 2X8 Fiore Gold Border",
"Vitra 2X8 Fiore Noce Border",
"Vitra 8X10 Fiore Noce Insert",
"Vitra 8X10 Fiore Gold Insert",
"Vitra 8X10 Fiore Sand Insert",
"Gerflor 10X9.84 Shower Threshold Grey",
"Gerflor 4in Weldable Base 6506 Brown",
"Gerflor 60mm Flexible Cove Skirting Blck",
"Gemini Large Reverse Drive Pulley for XT",
"Gerflor 3X66ft Cove Former Black",
"Gerflor 9.84ft Tarafit Filet Strip 38mm",
"Rubi 1/4 (6mm) Replacement Drilling Bit",
"Rubi 5/16 (8mm) Replacement Drilling Bit",
"Gerflor 2X82ft Diminishing Strip Black",
"Rubi 13/32 (10mm) Replacement Drill Bit",
"Rubi 1/2 (12mm) Replacement Drill Bit",
"Rubi 1/4 and 3/8 Easy Gres Drill Bit Kit",
"Rubi 3/4 (20mm) Diamond Drill Bit",
"Gerflor 25X10ft Capping Strip Desert",
"Gerflor 10ft Capping Strip 0660 Dk Grey",
"Rubi 1 1/8 Dry Diamond Drill Bit",
"Rubi 1 3/8 (35mm) Diamond Drill Bit",
"Rubi 1 3/4 (43mm) Diamond Drill Bit",
"Rubi 2in (50mm) Diamond Drill Bit",
"Rubi 2 3/8 (60mm) Diamond Drill Bit",
"Rubi 2 1/2in (65mm) Diamond Drill Bit",
"Rubi 14/64(6mm) 3/8(10mm) Drill Bit Kit",
"Gerflor 10X9.84 Capping Strip Clip Syste",
"Rubi 1/4 Easy Gres Wet Cut Diamond Drill",
"Gerflor 10X9.84 Capping Strip Clip Deser",
"Gerflor 10X9.84 Capping Strip Clip White",
"Rubi 7/32 Easy Gres Wet Cut Diamnd Drill",
"Rubi 5/16 Easy Gres Wet Cut Diamnd Drill",
"Rubi 3/8 Easy Gres Wet Cut Diamond Drill",
"Gerflor 10X9.84 Capping Strip Clip Beige",
"Rubi 5/16 (8mm) EasyGres Boca Kit",
"Rubi 1/4 Replacement Diamond Drill Bit",
"Rubi 5/16 Replacement Diamond Drill Bit",
"Rubi 13/32 Replacement Diamond Drill Bit",
"Rubi 9/16 Replacememnt Diamond Drill Bit",
"Rubi 9/16 Detachable Diamond Drill Bit",
"Gerflor 2X82 Capping Strip Brown (2/ctn)",
"Rubi 1 (27mm) Widia Drill Bit",
"Rubi 1 3/8 (35mm) Carbide Drill Bit",
"Rubi 1 3/4 (40mm) Diamond Drill Bit",
"Rubi 1 3/4 (45mm) Carbide Drill Bits",
"Rubi 2 1/4 (55mm) Widia Drill Bit",
"Rubi 2 1/2in (65mm) Carbide Drill Bit",
"Rubi 3 1/4in (85mm) Carbide Drill Bit",
"Gemini Face Shield",
"Rubi 3/4 (20mm) Diamond Drill Bit",
"Vitra 2X10 Textile Beige Flower Border 1",
"Rubi 1 1/8 (28mm) Diamond Drill Bit",
"Vitra 2X10 Textile Grey Flower Border 1",
"Rubi 1 3/8 (35mm) Diamond Drill Bit",
"Rubi 2 (50mm) Diamond Drill Bits",
"Rubi 2 1/2 (65mm) Diamond Drill Bits",
"Rubi 3 (75mm) Diamond Drill Bit",
"Rubi 4 (10cm) Diamond Core Bit",
"Rubi 4 1/2 (120mm) Diamond Drill Bit",
"Rubi 1 3/8 (35mm) Diamond Drill Bit",
"Rubi 1 3/4 (45mm) Widia Drill Bit",
"Rubi 3 1/2 (90mm) Widia Drill Bit",
"Rubi 1 3/4 Diamond Drill Bit",
"Rubi 5/16 (8mm) Diamond Drill Bits",
"Rubi 13/32 (10mm) Diamond Drill Bits",
"Rubi 1/4 (6mm) Diamond Drill Bit",
"Rubi 2 3/8 (60mm) Diamond Drill Bit",
"Rubi 3 3/4 (95mm) Diamond Drill Bit",
"Rubi 2 1/4 (55mm) Diamond Drill Bit",
"Rubi Adapter For Electric Drill",
"Rubi 1 3/8 (35mm) Electric Drill Adap.",
"Rubi Central Drilling Attachment",
"Rubi 15/16 (6mm) Centre Bit",
"Rubi 6mm Widia Spare Core Bit",
"Vitra 2.5X10 Textile Beige Border",
"Rubi Drill Bit Set W/Case",
"Vitra 2.5X10 Textile Grey Border",
"Rubi 1/2 Detachable Diamond Drill Bit",
"Roppe 9ft Resid Stair Nos RD 194 B Umber",
"Gerflor 328ft Symbioz Weldrod 0135",
"Gerflor 328ft Symbioz Weldrod 0582",
"Gerflor 328ft Symbioz Weldrod 0626",
"Gerflor 328ft Symbioz Weldrod 0637",
"Gerflor 328ft Symbioz Weldrod 0696",
"Gerflor 328ft Symbioz Weldrod 2151",
"Gerflor 328ft Symbioz Weldrod 2258",
"Gerflor 328ft Symbioz Weldrod 2259",
"Gerflor 328ft Symbioz Weldrod 2500",
"Gerflor 328ft Symbioz Weldrod 2501",
"Gerflor 328ft Symbioz Weldrod 2502",
"Gerflor 328ft Symbioz Weldrod 2503",
"Gerflor 328ft Symbioz Weldrod 2504",
"Gerflor 328ft Symbioz Weldrod 2505",
"Gerflor 328ft Symbioz Weldrod 2506",
"Gerflor 328ft Symbioz Weldrod 2507",
"Gerflor 328ft Symbioz Weldrod 2508",
"Gerflor 328ft Symbioz Weldrod 2509",
"Gerflor 328ft Symbioz Weldrod 2510",
"Gerflor 328ft Symbioz Weldrod 2511",
"Gerflor 328ft Symbioz Weldrod 2512",
"Gerflor 328ft Symbioz Weldrod 2513",
"Gerflor 328ft Symbioz Weldrod 2514",
"Gerflor 328ft Symbioz Weldrod 2515",
"Gerflor 328ft Symbioz Weldrod 2516",
"Gerflor 328ft Symbioz Weldrod 2918",
"Reiko 3in All-Rubber Suction Cup",
"Rubi Screw DIN 912 M5X12 ZN",
"Gerflor 107mm Velcro Strip",
"Gerflor 200lm Copper Foil",
"Gemini XT Water Tray",
"Rubi B-14-S Block Cutter",
"Rubi 8in Block Cutter B-20",
"Rubi 3/4 Easy Gres Diamond Drill Bit",
"Rubi 1 3/8 Easy Gres Diamond Drill Bit",
"Rubi 1 5/8 (40mm) Diamond Drill Bit",
"Rubi 1 3/4 (43mm) Diamond Drill Bit",
"Rubi 2in (50mm) Diamond Drill Bit",
"Rubi 2 1/4 Easy Gres Diamond Drill Bit",
"Rubi 2 1/2 (65mm) Diamond Drill Bit",
"Rubi Ceramic Block For Wall",
"Rubi Ceramic Cleaning Block",
"Rubi 2 11/16 (68mm) Diamond Drill Bit",
"Rubi 3in (75mm) Diamond Drill Bit",
"Rubi 4in (100mm) Diamond Drill Bit",
"Rubi 4 3/4 (120mm) Diamond Drill Bit",
"Unibest 10mm Special Serene Cherry",
"Unibest 10mm Special Divine Oak",
"Unibest 12mm Special Primavera Walnut",
"Roppe 1/8X9ft Domestic Stair Nose Sq 140",
"Roppe 1/8X9ft Domestic Stair Nose Sq 191",
"Stabila 100ft Laser Measure LD300",
"Vitra 5X10 Uni Super White Mat",
"Vitra 10X13 Textile White D¨¦cor",
"Vitra 10X13 Textile Grey D¨¦cor",
"Vitra 10X13 Textile Beige D¨¦cor",
"Vitra 10X13 Textile Cream D¨¦cor",
"Vitra 8X10 Panga Grey D¨¦cor-1",
"Vitra 8X10 Panga Brown D¨¦cor-3",
"Vitra 8X10 Panga Antrasit D¨¦cor-3",
"Vitra 8X10 Panga Grey D¨¦cor-2",
"Vitra 8X10 Panga Beige D¨¦cor-2",
"Vitra 10X13 Textile Antrasit D¨¦cor-3",
"Vitra 10X13 Textile Grey D¨¦cor-1",
"Vitra 10X13 Textile Grey D¨¦cor-2",
"Vitra 10X13 Textile Brown D¨¦cor-3",
"Vitra 10X13 Textile Beige D¨¦cor-2",
"Vitra 4X4 Moon Beige Insert 1",
"Vitra 4X4 Moon Grey Insert 1",
"Vitra 4X4 Moon Antrasit Insert 1",
"Vitra 4X4 Moon Black Insert 1",
"Roppe 1/8X9ft Domestic Stair Nose Rd 174",
"Gemini 6in Std Dbl Sided Cart. for 1100",
"Rubi Separator Frame For S Breaker",
"Rubi Red Plastic Cap",
"Rubi Eccentric Axle",
"Rubi Jaws Lever for S Breaker",
"Rubi Single Point Breaker For TS60",
"Rubi S Separator Cam",
"Rubi Pitcher Lever Axle",
"Rubi Inner Spring for S Breaker",
"Rubi Washer A8 for TS-40",
"Rubi Screw for TS30/40/50/60 M6X25",
"Rubi Screw for TS30/40/50/60 M6X16",
"Rubi Axle Seperator",
"Rubi Screw DIN 933 M6X30 ZN",
"Gemini 6in Fine Dbl Sided Cart. for 1100",
"Stabila Laser Elevation Rod",
"Rubi Separator",
"Rubi Breaker Handle",
"Rubi S Breaker",
"Proknee 1in Foam Inserts 07 (AB-20in)",
"Proknee 1in Foam Inserts 07 (AB-21in)",
"Proknee 1in Foam Inserts 07 (AB-22in)",
"Proknee 1in Foam Inserts 07 (AB-23in)",
"Proknee 1in Foam Inserts 07 (AB-24in)",
"Proknee 07 No Wrinkle Liners",
"Roppe 3/16X9ft 7 Underlap HD Nos Sq 150",
"Proknee 07 Rubber Boots",
"Roppe 7X108 Rubber Riser 193 Black/Brown",
"Roppe 108in Vantage w/Riser Rub St Trd",
"Roppe 108in Vantage w/Riser Rub St Trd",
"Gemini 10in Glade Blade w/Stone",
"Gemini XT Water Tub",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 100",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 110",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 182",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 193",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 194",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 114",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 116",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 139",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 140",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 150",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 165",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 167",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 169",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 171",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 174",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 175",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 177",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 178",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 184",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 187",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 191",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 195",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 198",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 118",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 137",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 185",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 617",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 621",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 631",
"Roppe 1/8X9ft 9 Underlap Str Nose Sq 634",
"Barwalt 1/16in Spacer Reg (300/Bag)",
"Barwalt 1/16in Spacer Thin (300/Bag)",
"Multifeutre 24X36X5/32 Cork",
"Multifeutre 24X36X1/4 Cork",
"Barwalt 1/8in Spacer Reg T (200/Bag)",
"Barwalt 1/8in Spacer Thin T (200/Bag)",
"Barwalt 3/16in Spacer Reg T (150/Bag)",
"Barwalt 3/16in Spacer Thin T (150/Bag)",
"Barwalt 1/4in Spacer Reg T (100/Bag)",
"Barwalt 1/4in Spacer Thin T (100/Bag)",
"Barwalt 3/8in Spacer Reg (50/Bag)",
"Barwalt 3/8in Spacer Thin (50/Bag)",
"Barwalt 1/2in Spacer Reg (35/Bag)",
"Barwalt 1/2in Spacer Thin (35/Bag)",
"Gemini Taurus 3 Ring Saw w/Blade",
"Gemini Revolution XT Slide Tray",
"Barwalt 1/8in Spacer Reg T (200/Bag)",
"Barwalt 1/8in Spacer Thin T (200/Bag)",
"Barwalt 3/16in Spacer Reg T (150/Bag)",
"Barwalt 3/16in Spacer Thin T (150/Bag)",
"Bosch 1/2in High Speed Drill 120V 6.5Amp",
"Sigma Ball Bearing",
"Barwalt 1/4in Spacer Reg T (100/Bag)",
"Barwalt 1/4in Spacer Thin T (100/Bag)",
"Gemini Revolution XT 100 Volt W/ Blade",
"Barwalt 3/8in Spacer Reg T (50/Bag)",
"Barwalt 3/8in Spacer Thin T (50/Bag)",
"Gemini Sliding Carriage Table",
"Barwalt 1/2in Spacer Reg T (35/Bag)",
"Barwalt 1/2in Spacer Thin T (35/Bag)",
"Gemini Taurus 3 Accessory Kit",
"Reiko 8in Econo Tile Nipper",
"Gemini T3 Water Tub",
"Gemini Stabilizer Foot",
"Barwalt Wedges Regular Bag (100/Bag)",
"Barwalt Super Wedges Bag 25pcs",
"Raimondi 16L Ipertitina Tank",
"Raimondi 12L Tank",
"Sigma No-Mark Protection 2A 2B",
"Sigma No-Mark Protection Lever Grip 5A-B",
"Sigma No-Mark Protection Lever Grip 2G",
"Gemini T3 Blade Kit",
"Gemini T3 Separating Blade Kit",
"Bennett Paint Roll Refill Lint Free",
"Gemini Mega Blade Kit (T3 Only)",
"Reiko Parrot Nipper",
"Gemini T3 Dichro Blade",
"Raimondi 110v Sprintbeton Machine",
"Gemini Stand For Revolution Xt",
"Gemini 10in Standard Blade w/Dress Stone",
"Gemini Double Sided Blade",
"Gemini Rev. Double Pulley Assembly",
"Bennett 9 1/2in Deep Plastic Tray",
"Rubi Basic Line Plastic Trowel",
"Bennett 9 1/2in Wire Cage Frame Handle",
"Gemini Groove Grommet (Orange) For XT",
"Bennett 1/8in RLR Paper Core",
"Gemini Green Cone Grommet Assembly",
"Gemini Red Cone Grommet Assembly",
"Sigma 13/17 H16 Foot Rubber 3B",
"Sigma Foot Rubber",
"Alto Module For RS16DC",
"Rubi Basic Line Grout Saw",
"Gemini Orange Groove Grommet Ass (Pair)",
"Sigma Adhesive Measure Tape Red 2G in",
"Sigma Tape In Inches For 2B3",
"Sigma Adhesive Measure Tape Red 2A3",
"Sigma Tape in CM for 3B 3D",
"Sigma Adhesive Measure Tape Red 3 Series",
"Sigma Adhesive Measure Tape Red 4B",
"Sigma Adhesive Measure Tape Red 2G mm",
"Gemini Clear Grommet Assembly for RevXT",
"Gemini XT Complete Replacement Kit",
"EasyHeat Cable Box To Sensor Wire",
"Sigma Nut for Clamping Knob",
"Sigma Complete Left Support 3A 3B 3C 3",
"Sigma Complete Right Support 3A 3B 3C 3",
"Raimondi 230v Monobrush Ipertitina",
"Sigma Antifriction Bearing 2A 2B",
"Sigma 40mm Clamping Knob for M10X35",
"Sigma Lever Clamping Knob",
"Sigma Knob",
"Sigma Knob R55",
"Sigma Clamping Knob Lever",
"Sigma 320X160mm Left Metal Plate 5-5A-5B",
"Sigma 320X160mm Right Metal Plate 5-5A-B",
"Raimondi Side Balast for Ipertitina",
"Raimondi Trolley Kit for Ipertitina",
"Toolway 14mm Heavyduty Hacksaw Frame 4",
"Gemini Tailgator",
"Bullet EZ Shear 9 Flooring/Siding Blade",
"Bullet 9in EZ Shear Siding Cutter",
"Roppe 1/8X9ft 10 Underlap Str Nos Rd 110",
"Gemini 110v Apollo Ring Saw",
"Vitra 6X6 Ral White Field Mat 110020000",
"Toolway 12  Vinyl Tile Cutter",
"Toolway 18  Vinyl Tile Cutter",
"Toolway 8in Carbide Cutting Nipper",
"Toolway Heavy Duty Tile Nipper",
"Toolway 8in Tile Cutting Plier w/Breaker",
"Toolway Grout Rake",
"Toolway 6in Tile File Hlf Round Hlf Flat",
"Toolway Adj. Tile Hole Cutter",
"Gemini 220V Apollo Ring Saw",
"Toolway 8in Heavy Duty Scraper",
"Toolway 24in Heavy Duty Scraper",
"Toolway 1/8 Tile Spacers 3mm (100/Bag)",
"Toolway 1/8 Tile Spacers 3mm 200pc Bag",
"Toolway 3/16 Tile Spacers 5mm (75/Bag)",
"Toolway 1/16 and 3/16 Tile Spacers",
"Toolway 1/16 Tile Spacers 2mm (200/Bag)",
"Toolway Tile Levelling Wedges (30/pkg)",
"Toolway Tile Levelling Clips (100/pkg)",
"Gemini 220V Apollo Ring Saw w/4in Blade",
"Alpha 5/8in Variable Drive Flange",
"Gemini 110v Apollo Ring Saw w/4in Blade",
"Roppe 12X12 Rop-Cord 3/8 Non-Vulc Crimso",
"Roppe 12X12 Rop-Cord 3/8 Non-Vulc Earth",
"Roppe 12X12 Rop-Cord 3/8 Non-Vulc Indigo",
"Roppe 12X12 Rop-Cord 3/8 Non-Vulcan Pine",
"Raimondi 110v Iperbert Mixer",
"Janser Pulling Claw",
"Janser Jamas Strip Cutter",
"Janser Grinding Plate w/ Felt",
"Janser 18in Plate Pad",
"Janser 120V Columbus 135SH Sanding Mach",
"Bosh Max Demolition Hammer",
"Bosch 5/8in SDS-Plus Rotary Hammer",
"Roppe 12X12 Rop-Cord 5/16 Vulcan Crimson",
"Roppe 12X12 Rop-Cord 5/16 Vulc Earthtone",
"Roppe 12X12 Rop-Cord 5/16 Vulcani Indigo",
"Roppe 12X12 Rop-Cord 5/16 Vulcanize Pine",
"Bullet 13in EZ Shear Flooring Cutter",
"Bosch 120v Demolition Hammer 14Amp",
"Bosh Demolition Hammer",
"Bosh Max Demolition Hammer",
"Janser Multi Vac System",
"Bullet 13in Flooring Blade for 113",
"Rex 6X12 Marco Polo Beige Field",
"Mat Tech 2ftX3ft Econoluxe 86 Black/Whit",
"Mat Tech 2ft6X10ft Econoluxe Plus 16-",
"Mat Tech 2ft6X11ft Econoluxe Plus 38-",
"Mat Tech 2ft6X39ft Econoluxe Plus 38-",
"Mat Tech 2ft6X7ft Econoluxe Plus 38-",
"Mat Tech 3ftX10ft Econoluxe 86 Black/Whi",
"Mat Tech 3ftX4ft Econoluxe 86 Black/Whit",
"Mat Tech 3ftX5ft Econoluxe 86 Black/Whit",
"Mat Tech 3ftX6ft Econoluxe 86 Black/Whit",
"Mat Tech 4ftX10ft Econoluxe 86 Black/Whi",
"Mat Tech 4ftX12ft11 Econoluxe 86-Blk/Wht",
"Mat Tech 4ftX6ft Econoluxe 86 Black/Whit",
"Mat Tech 4ftX8ft Econoluxe 86 Black/Whit",
"Mat Tech 5ftX5ft2 Econoluxe Plus 16-",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 100",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 110",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 182",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 193",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 194",
"Mat Tech 3ftX60ft Econoluxe 38 Red/Black",
"Mat Tech 3ftX60ft Econoluxe Black/White",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 114",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 116",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 139",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 140",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 150",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 165",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 167",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 169",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 171",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 174",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 175",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 177",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 178",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 184",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 187",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 191",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 195",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 198",
"Mat Tech 4ftX60ft Econoluxe 38 Red/Black",
"Mat Tech 4ft Econoluxe 38 Red/Black Scnd",
"Mat Tech 4ftX60ft Econoluxe Black/White",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 118",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 137",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 185",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 617",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 621",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 631",
"Roppe 3/8X9ft 11 Carpet Stair Nos Sq 634",
"Mat Tech 6ftX60ft Econoluxe Brown/Whte",
"Mat Tech 6ftX60ft Econoluxe 38 Red/Black",
"Mat Tech 6ftX60ft Econoluxe Black/White",
"Barwalt 1/16in Horseshoe Shim Blue 270pc",
"Toolway 1/4in Sq Notch Econo Trowel",
"Toolway 1/2in Sq Notch Econo Trowel",
"Toolway 1/4X3/8in Notch Econo Trowel",
"Toolway 5inX2in Trowel With Blue Handle",
"Barwalt 1/16in Horseshoe Shim 1000pc",
"Toolway 3/16in V Notched Trowel",
"Barwalt 1/8in Horseshoe Shim Black 160pc",
"Toolway Standard Rubber Grout Float",
"Toolway 4X9 Wood Handle Float",
"Toolway 4X12 Professional Float",
"Toolway 3 3/4X10 Epoxy Float Prof Gum",
"Toolway 7in Rubber Mud Trowel w/Bucket",
"Barwalt 1/8in Horseshoe Shim 1000pc",
"Reiko 3mm Tile Spacers (250pcs)",
"Barwalt 3/16in Horseshoe Shims Gry 120pc",
"Toolway Double Blade Grout Saw",
"Toolway Grout Sealer Applicator",
"Barwalt 3/16in Horseshoe Shim 1000pc",
"Tarkett 165lf Weldthread 12036",
"Barwalt 1/4in Horseshoe Shim Green 95pcs",
"Barwalt 1/4in Horseshoe Shim 1000pc",
"Toolway 4 1/2in Turbo Blade",
"Toolway 4 1/2in Wet Blade",
"Reiko 6mm Tile Spacer (250pcs)",
"Diamond Grit 3/16  Hole Saw",
"Diamond Grit 1/4  Hole Saw",
"Toolway 1in Carbide Hole Saw",
"Toolway 13/16in  Carbide Hole Saw",
"Reiko Tile Wedges",
"Rubi Right Tapeline (mm) For TI-T",
"Rubi Left Tapeline (mm) For TI-T",
"Rubi Clip For TR600S",
"Rubi Square Guide for TI",
"Rubi Tile Cutter Spring",
"Rubi Lever Flange For TI Tile Cutter",
"Toolway Rafter Layout Square",
"Toolway Suction Cup Cast Alum",
"Toolway 3inX20in Paint & Mud Mixer",
"Rubi Pitcher",
"Tarkett 165lf Weldthread 12146",
"Roppe 1Gal Wall Base Adhesive ROP215",
"Rubi 4mmX32mm Special Pin",
"Raimondi Suction Ring for Ipertitina",
"Raimondi Liquid Containment Ring Ipertit",
"Toolway 6in Putty Knife",
"Roppe 1Gal Pinnacle Base Adhesive ROP220",
"Rubi Star-40 Support Guide",
"Rubi 30/40 Runner For Star",
"Rubi Replacement Screw (Red) For TS",
"Rubi Orange Knob Set M6X 10",
"Rubi Separator Star/Pocket",
"Raimondi Reducer Cover for Rotation B",
"Raimondi Maxititina 302MT1TM",
"Toolway 2in Econo Paint Brush",
"Powerseal Silicone Clear 300ml",
"Powerseal Silicone White 300ml",
"Toolway 24in Concrete Broom",
"Raimondi Maxititina 302MT1EM",
"Raimondi Maxititina 283 EL",
"Rubi Pitcher for TI-S V2",
"Barwalt 1/16 Horseshoe Shim Blue 1000pcs",
"Toolway Cold Chisel 7/8X3/4X12",
"Barwalt 1/8 Horseshoe Shim Black 1000pcs",
"Barwalt 3/16in Horseshoe Shim 1000pcs",
"Barwalt 1/4in Horseshoe Shim 1000pcs",
"Raimondi 115v GS86 Compact Saw W/Blade",
"Raimondi Berta #399 Press Sponge Lever",
"Rubi Handle TI-S Mounted",
"Rubi TI-66-S Tile Cutter",
"Rubi TI-75-S Tile Cutter",
"Rubi TI-66-T Tile Cutter",
"Rubi TI-75-T Tile Cutter",
"Rubi TI-75-S Tile Cutter - Inches",
"Rubi Lateral Stop Star-N & N-Plus",
"Rubi Ceramic Tile Cutter",
"Rubi Ceramic Tile Cutter W/Case",
"Rubi Star-50 Tile Cutter",
"Rubi Star-60-N Tile Cutter",
"Rubi Star-60-N Manual Tile Cutter w/Case",
"Rubi Star-60 w/Carrying Case",
"Rubi Star-60-N Plus Tile Cutter w/Case",
"Rubi Star-40-N Manual Tile Cutter",
"Rubi Star-40-N W/Case",
"Rubi Star-50-N Tile Cutter",
"Rubi Star-50-N Manual Tile Cutter w/Case",
"Rubi Star-40-N Plus Tile Cutter w/Case",
"Uzite 12ft Action 07 Beige",
"Uzite 12ft Action 68 Blue",
"Uzite 12ft Action 73 Forest Green",
"Uzite 12ft Action 85 Grey",
"Uzite 12ft Atrium 12 Beige",
"Uzite 12ft Atrium 66 Blue",
"Uzite 12ft Atrium 73 Green",
"Uzite 12ft Atrium 84 Grey",
"Uzite 12ft Comet 05 Tan Beige",
"Uzite 12ft Comet Beige",
"Uzite 12ft Comet 17 Medium Brown",
"Uzite 12ft Comet 19 Chocolate",
"Uzite 12ft Comet Blue",
"Uzite 12ft Comet Olive Green",
"Uzite 12ft Comet 75 Green",
"Uzite 12ft Comet Stone Grey",
"Uzite 12ft Comet 90 Black",
"Roppe 1 3/4 Self-Tap Concrete Screw 12pc",
"Uzite 12ft Polaris 06 Beige",
"Uzite 12ft Polaris 16 Golden Brown",
"Uzite 12ft Polaris 39 Burgundy",
"Uzite 12ft Polaris 62 Blue",
"Uzite 12ft Polaris 72 Green",
"Uzite 12ft Polaris 89 Charcoal",
"Roppe 3/8X9ft 12 Carpet Stair Nos Rd Blk",
"Uzite 12ft Solution 16 Brown",
"Uzite 12ft Solution 12 Blue",
"Uzite 12ft Solution 71 Green",
"Uzite 12ft Solution 85 Grey",
"Uzite 12ft Studio 12 Beige",
"Uzite 12ft Studio 89 Charcoal",
"Uzite 12ft Vogue 06 Sand",
"Uzite 12ft Vogue 16 Brown",
"Uzite 12ft Vogue 39 Burgundy",
"Uzite 12ft Vogue 62 Blue",
"Uzite 12ft Vogue 72 Green",
"Uzite 12ft Vogue 89 Charcoal",
"Toolway 16in Ceramic Econo Tile Cutter",
"Ardex 60ft Mortar Hose",
"Ardex 35mm Male to Male Adaptor",
"Raimondi 1/16in Tile Spacers 1000/Bag",
"Toolway Wet Tile Saw With 7inch Blade",
"Ardex 1/2in R 280 Twin Nipple",
"Ardex 1/2in R Tap",
"Ardex Flow Meter Assembly - 1600 L/H",
"Ardex 1/2in R Geka-Coupling",
"Ardex Material Outlet Gasket",
"Raimondi 1.5mm Tile Spacers T (200pcs)",
"Raimondi 2mm Tile Spacers X 200pc Bag",
"Rubi M6 Knob Standard Red V2",
"Shurfast Pin",
"Shurfast O Ring",
"Raimondi 2mm Tile Spacers X (1000pc)",
"Alpha Belt For ECG-125 Grinder",
"Alpha Inner Belt",
"Alpha Eco Grinder Bag",
"Raimondi 2mm Tile Spacers T (1000pc)",
"Raimondi 14mm Titanium Cutting Wheel",
"Roppe 1Gal Acrylic Tile/Tread Adh ROP360",
"Raimondi 4.5inX10in Soft Rubber Float",
"MK Diamond 45Deg Miter Jig",
"Raimondi Blue Soft Rubber Float",
"Raimondi 100X245mm Rubber Grout Flt Grn",
"Raimondi Rubber Grout Float",
"Raimondi 100X245mm Rubber Grout Flt Blue",
"Raimondi Replacement Rubber Pad",
"MK Diamond 18in Diagonal Cutting Kit",
"Bosch 4 1/2in Small Angle Grinder",
"Bosch 4.5in Small Angle Grinder 120V",
"Rubi Case for Speed-62 Tile Cutter",
"Raimondi 50cm Grout Rake 139",
"Rubi Speed-42 Tile Cutter W/Case",
"Rubi SPEED-62 Tile Cutter",
"Rubi Speed-62 w/Case",
"Rubi Speed Plus-62 w/Case",
"Rubi Speed Plus-72 w/Case",
"Rubi Speed Plus-92",
"Raimondi Double Rubber Rake",
"Roppe 1/4X9ft 13 Carpet Stair Nos Sq 182",
"Raimondi 75cm Grout Rake 140",
"Cerdisa 8X8 Graniti White (Bianco Alpi)",
"Cerdisa 8X8 Graniti Dark Green Field",
"Raimondi Self Adhesive Washer",
"Raimondi 30in Rubber Grout Rake",
"Raimondi 24X118mm Rubber Gasket",
"Raimondi 6 1/2inX14 1/2in Tile Beater",
"Cerdisa 12X12 Graniti White Field",
"Cerdisa 12X12 Graniti Green Field",
"Roppe 1Gal Solvent Free Epoxy Adh (2 pt)",
"Shurfast Piston",
"Shurfast Driver Blade",
"Roppe 144in 18 HD Vinyl Tread Sq Nos 147",
"Roppe 1Gal Rop-Cord Adhesive ROP445",
"Raimondi 6.25ft  Aluminum Bar",
"Sigma 12mm Scoring Wheel W/15A",
"Sigma 16mm Scoring Wheel W/15C",
"Roppe 1/4X9ft 14 Carpet Stair Nos Rd 110",
"Sigma 12mm Titanium Scoring Wheel",
"Rubi Base for TS50-Plus",
"Centura 22oz Spray Wall Panel Adhesive",
"Rubi Support Guide TS-30/40 V2",
"Rubi Support Guide TS-50/60 V2",
"Rubi Handle M-10 TS V2",
"Rubi Separator Cover for V2",
"Rubi TS Classic Breaker Handle",
"Rubi 13X496.5 Chromed Guide TS-30 V2",
"Rubi 13X566.5 Chromed Guide TS-40 V2",
"Rubi 17X706.5 Chromed Guide TS-50 V2",
"Rubi 17X796.5 Chromed Guide TS-60 V2",
"Rubi Screw Din7984 M6X16 5.6 ZN",
"Rubi Right Metric Tipeline TS-60",
"Rubi Scoring Wheel Holder TS-50",
"Rubi Scoring Wheel Holder TS",
"Rubi Scoring Wheel Holder TS-50 V2",
"Rubi Scoring Wheel Holder",
"Rubi 12.8X25X6 Slide Top",
"Rubi Slide Top TS-50/60 V2",
"Rubi 17X890.5 Chromed Guide Diam",
"Rubi Support for TS-30/40",
"Rubi Support for TS-50/60",
"Rubi Lateral Stop Set TS-50-Plus",
"Rubi Lateral Stop TS-60 Classic",
"Rubi Support for TS",
"Rubi TS-20/30/40 Scale",
"Rubi M-6 Red Button",
"Rubi TS30/40 Support Stop",
"Rubi Nylon Stopper",
"Rubi Cutting Arm Lever Handle",
"Rubi Button Stop",
"Rubi Toolholder Brake Spring",
"Rubi Brake Screw for TS",
"Rubi Nut Din 934 M6 ZN",
"MK Diamond Portable Skill Saw MK70",
"Rubi M8X16 Screw Din 6921",
"Mont 12X12 Galaxy Cotto Field",
"Mont 12X12 Galaxy Beige Field",
"Rubi Carrying Case For TS60",
"Rubi Metric Nut For TS",
"Rubi Nickel Seperator Lever Set",
"MK Diamond Dressing Sticks",
"Rubi Nickel Lateral Stop for TS-40",
"Roppe 1 13/32X12ft 152 Snap-Down Div 100",
"Roppe 1 13/32X12ft 152 Snap-Down Div 110",
"Roppe 1 13/32X12ft 152 Snap-Down Div 182",
"Roppe 1 13/32X12ft 152 Snap-Down Div 193",
"Roppe 1 13/32X12ft 152 Snap-Down Div 194",
"Roppe 1 13/32X12ft 152 Snap-Down Div 114",
"Roppe 1 13/32X12ft 152 Snap-Down Div 116",
"Roppe 1 13/32X12ft 152 Snap-Down Div 139",
"Roppe 1 13/32X12ft 152 Snap-Down Div 140",
"Roppe 1 13/32X12ft 152 Snap-Down Div 150",
"Roppe 1 13/32X12ft 152 Snap-Down Div 165",
"Roppe 1 13/32X12ft 152 Snap-Down Div 167",
"Roppe 1 13/32X12ft 152 Snap-Down Div 169",
"Roppe 1 13/32X12ft 152 Snap-Down Div 171",
"Roppe 1 13/32X12ft 152 Snap-Down Div 174",
"Roppe 1 13/32X12ft 152 Snap-Down Div 175",
"Roppe 1 13/32X12ft 152 Snap-Down Div 177",
"Roppe 1 13/32X12ft 152 Snap-Down Div 178",
"Roppe 1 13/32X12ft 152 Snap-Down Div 184",
"Roppe 1 13/32X12ft 152 Snap-Down Div 187",
"Roppe 1 13/32X12ft 152 Snap-Down Div 191",
"Roppe 1 13/32X12ft 152 Snap-Down Div 195",
"Roppe 1 13/32X12ft 152 Snap-Down Div 198",
"Roppe 1 13/32X12ft 152 Snap-Down Div 118",
"Roppe 1 13/32X12ft 152 Snap-Down Div 137",
"Roppe 1 13/32X12ft 152 Snap-Down Div 185",
"Roppe 1 13/32X12ft 152 Snap-Down Div 617",
"Roppe 1 13/32X12ft 152 Snap-Down Div 621",
"Roppe 1 13/32X12ft 152 Snap-Down Div 631",
"Roppe 1 13/32X12ft 152 Snap-Down Div 634",
"Mont 12X12 Arizona White",
"Roppe 1Gal Urethane Epoxy Adhesive (2 pt",
"Raimondi Brush Handle Bracket-Rotating",
"Raimondi 6mm Tile Spacers 200pc Bag",
"Toolway Blue Ultra Duty Knee Pad",
"Toolway Black Rubber Knee Pad",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 100",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 110",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 182",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 193",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 194",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 114",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 116",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 139",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 140",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 150",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 165",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 167",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 169",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 171",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 174",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 175",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 177",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 178",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 184",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 187",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 191",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 195",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 198",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 118",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 137",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 185",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 617",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 621",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 631",
"Roppe 1 9/64X12ft 154 Snap-Down Edge 634",
"Mk Diamond Pro Tile Saw Mk101 with Stand",
"MK Diamond Water Pump For MK370",
"Roppe 12ft 155 Single Flange Track Black",
"Raimondi Handle for Skipper",
"MK Diamond 120v Motor For Grinder",
"Rubi TS60 Support Stop",
"Rubi Guide TS-60 17X791",
"MK Diamond 24in  Blade For MK303",
"Raimondi 8.5X38.5 Aluminum Tile Platform",
"Roppe 5/16X12ft 156 Glue-Down Reduce 100",
"Roppe 5/16X12ft 156 Glue-Down Reduce 110",
"Roppe 5/16X12ft 156 Glue-Down Reduce 182",
"Roppe 5/16X12ft 156 Glue-Down Reduce 193",
"Roppe 5/16X12ft 156 Glue-Down Reduce 194",
"Roppe 5/16X12ft 156 Glue-Down Reduce 114",
"Roppe 5/16X12ft 156 Glue-Down Reduce 116",
"Roppe 5/16X12ft 156 Glue-Down Reduce 139",
"Roppe 5/16X12ft 156 Glue-Down Reduce 140",
"Roppe 5/16X12ft 156 Glue-Down Reduce 150",
"Roppe 5/16X12ft 156 Glue-Down Reduce 165",
"Roppe 5/16X12ft 156 Glue-Down Reduce 167",
"Roppe 5/16X12ft 156 Glue-Down Reduce 169",
"Roppe 5/16X12ft 156 Glue-Down Reduce 171",
"Roppe 5/16X12ft 156 Glue-Down Reduce 174",
"Roppe 5/16X12ft 156 Glue-Down Reduce 175",
"Roppe 5/16X12ft 156 Glue-Down Reduce 177",
"Roppe 5/16X12ft 156 Glue-Down Reduce 178",
"Roppe 5/16X12ft 156 Glue-Down Reduce 184",
"Roppe 5/16X12ft 156 Glue-Down Reduce 187",
"Roppe 5/16X12ft 156 Glue-Down Reduce 191",
"Roppe 5/16X12ft 156 Glue-Down Reduce 195",
"Roppe 5/16X12ft 156 Glue-Down Reduce 198",
"Roppe 5/16X12ft 156 Glue-Down Reduce 118",
"Roppe 5/16X12ft 156 Glue-Down Reduce 137",
"Roppe 5/16X12ft 156 Glue-Down Reduce 185",
"Roppe 5/16X12ft 156 Glue-Down Reduce 617",
"Roppe 5/16X12ft 156 Glue-Down Reduce 621",
"Roppe 5/16X12ft 156 Glue-Down Reduce 631",
"Roppe 5/16X12ft 156 Glue-Down Reduce 634",
"MK Diamond Linear Bearing",
"Raimondi 4mm Tile Spacers 200pc Bag",
"Rubi Lateral Stop TS-50",
"Rubi Square for TS-50",
"Raimondi Plastic Grating for Skipper",
"Rubi Seperator for TS-60 Plus V2",
"Rubi Lever For TS-Plus",
"Rubi Square Set for TS-30/40 V2",
"Rubi Square Set for TS-50 V2",
"Rubi Square Set for TS-60 V2",
"Raimondi 4mm Tile Spacers (1000pc)",
"Rubi Square Set for TS-30/40 Plus",
"Rubi Tool Holder TS-50/60/70 V2",
"MK Diamond 115v Wet Tile Saw MK100",
"Rubi Square Set for TS-50 Plus",
"Rubi Square Set for TS-60/70 Plus",
"Rubi Tool Holder for TS-30/40 V2",
"MK Diamond 7in Premium Porcelain Blade",
"MK Diamond 8in Blade For MK225 Saw",
"MK Diamond 10in Premium Porcelain Blade",
"MK Diamond 12in Diamond Prem.Porc.Blade",
"Rubi Tool Holder TS-30/40 V2",
"Rubi TS60 Runner and Tool Holder",
"Rubi S Breaker/Separator",
"Rubi TS-30/40 Runner and Tool Holder",
"Rubi Carrier and Tool Holder for TS50/60",
"Raimondi Washer for Abrasive Drive Disc",
"Raimondi 60mm Ring for Abrasive Disc",
"Raimondi 4mm Tile Spacers T (1000pc)",
"Roppe 1/4X12ft 158 Square Cove Cap 100",
"Roppe 1/4X12ft 158 Square Cove Cap 110",
"Roppe 1/4X12ft 158 Square Cove Cap 182",
"Roppe 1/4X12ft 158 Square Cove Cap 193",
"Roppe 1/4X12ft 158 Square Cove Cap 194",
"Roppe 1/4X12ft 158 Square Cove Cap 114",
"Roppe 1/4X12ft 158 Square Cove Cap 116",
"Roppe 1/4X12ft 158 Square Cove Cap 139",
"Roppe 1/4X12ft 158 Square Cove Cap 140",
"Roppe 1/4X12ft 158 Square Cove Cap 150",
"Roppe 1/4X12ft 158 Square Cove Cap 165",
"Roppe 1/4X12ft 158 Square Cove Cap 167",
"Roppe 1/4X12ft 158 Square Cove Cap 169",
"Roppe 1/4X12ft 158 Square Cove Cap 171",
"Roppe 1/4X12ft 158 Square Cove Cap 174",
"Roppe 1/4X12ft 158 Square Cove Cap 175",
"Roppe 1/4X12ft 158 Square Cove Cap 177",
"Roppe 1/4X12ft 158 Square Cove Cap 178",
"Roppe 1/4X12ft 158 Square Cove Cap 184",
"Roppe 1/4X12ft 158 Square Cove Cap 187",
"Roppe 1/4X12ft 158 Square Cove Cap 191",
"Roppe 1/4X12ft 158 Square Cove Cap 195",
"Roppe 1/4X12ft 158 Square Cove Cap 198",
"Roppe 1/4X12ft 158 Square Cove Cap 118",
"Roppe 1/4X12ft 158 Square Cove Cap 137",
"Roppe 1/4X12ft 158 Square Cove Cap 185",
"Roppe 1/4X12ft 158 Square Cove Cap 617",
"Roppe 1/4X12ft 158 Square Cove Cap 621",
"Roppe 1/4X12ft 158 Square Cove Cap 631",
"Roppe 1/4X12ft 158 Square Cove Cap 634",
"Raimondi 3mm Tile Spacers 200pc Bag",
"Rubi Drill For TS20,30&40 (15927)",
"Rubi Drill Adapter For TS60/TR/TM",
"Rubi 1in (27mm) Drill For TS-30/40",
"Rubi TF-40 Tile Cutter",
"Rubi 26in TF-90 Plus Tile Cutter",
"MK Diamond 120v Wet Tile Saw w/7in Blade",
"Roppe 12ft 159 Tile/Carpet Joiner 100",
"Roppe 12ft 159 Tile/Carpet Joiner 110",
"Roppe 12ft 159 Tile/Carpet Joiner 182",
"Roppe 12ft 159 Tile/Carpet Joiner 193",
"Roppe 12ft 159 Tile/Carpet Joiner 194",
"Roppe 12ft 159 Tile/Carpet Joiner 114",
"Roppe 12ft 159 Tile/Carpet Joiner 116",
"Roppe 12ft 159 Tile/Carpet Joiner 139",
"Roppe 12ft 159 Tile/Carpet Joiner 140",
"Roppe 12ft 159 Tile/Carpet Joiner 150",
"Roppe 12ft 159 Tile/Carpet Joiner 165",
"Roppe 12ft 159 Tile/Carpet Joiner 167",
"Roppe 12ft 159 Tile/Carpet Joiner 169",
"Roppe 12ft 159 Tile/Carpet Joiner 171",
"Roppe 12ft 159 Tile/Carpet Joiner 174",
"Roppe 12ft 159 Tile/Carpet Joiner 175",
"Roppe 12ft 159 Tile/Carpet Joiner 177",
"Roppe 12ft 159 Tile/Carpet Joiner 178",
"Roppe 12ft 159 Tile/Carpet Joiner 184",
"Roppe 12ft 159 Tile/Carpet Joiner 187",
"Roppe 12ft 159 Tile/Carpet Joiner 191",
"Roppe 12ft 159 Tile/Carpet Joiner 195",
"Roppe 12ft 159 Tile/Carpet Joiner 198",
"Roppe 12ft 159 Tile/Carpet Joiner 118",
"Roppe 12ft 159 Tile/Carpet Joiner 137",
"Roppe 12ft 159 Tile/Carpet Joiner 185",
"Roppe 12ft 159 Tile/Carpet Joiner 617",
"Roppe 12ft 159 Tile/Carpet Joiner 621",
"Roppe 12ft 159 Tile/Carpet Joiner 631",
"Roppe 12ft 159 Tile/Carpet Joiner 634",
"Mat Tech 2ft10X1ft10in Chevron Mat 54 Ch",
"Mat Tech 2ftX3ft Chevron Mat 54 Charcoal",
"Mat Tech 2ftX3ft Chevron Mat 62 Steel Bl",
"Mat Tech 2ft6X12ft Chevron Mat 54 Charco",
"Mat Tech 3ftX10ft Chevron Mat 18 Brown",
"Mat Tech 3ftX10ft Chevron Mat 54 Charcoa",
"Mat Tech 3ftX24ft Chevron Mat 54 Charcoa"
	];
	$( ".dialog #item_input" ).autocomplete({
	source: availableTags
	});	
	var address= [
		"Precise Tile & Contracting Inc.",
		"Precision Building Products",
		"Centura (Quebec) Limited - Montreal",
		"Centura (Quebec) Limited - Quebec",
		"Centura (Toronto) Limited",
		"Centura (Vancouver) Limited",
		"Centura Limited",
		"Centura Peterborough",
		"Centura Western - Calgary",
		"Centura Western - Edmonton"
	];
	
	$( "#centura_address" ).autocomplete({
	source: address
	});
	
	var contractor= [
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
		"Bert Green"
	]
	
	$( "#contractor,#contractor_b" ).autocomplete({
	source: contractor
	});
	
	//===== Masked input =====//
	
	$.mask.definitions['~'] = "[+-]";
	$(".maskDate").mask("99/99/9999",{completed:function(){alert("Callback when completed");}});
	$(".maskPhone").mask("(999) 999-9999");
	$(".maskPhoneExt").mask("(999) 999-9999? x99999");
	$(".maskIntPhone").mask("+33 999 999 999");
	$(".maskTin").mask("99-9999999");
	$(".maskSsn").mask("999-99-9999");
	$(".maskProd").mask("a*-999-a999", { placeholder: " " });
	$(".maskEye").mask("~9.99 ~9.99 999");
	$(".maskPo").mask("PO: aaa-999-***");
	$(".maskPct").mask("99%");
	
	
	//===== Dual select boxes =====//
	
	$.configureBoxes();
	
	
	//===== Wizards =====//
	
	$("#wizard1").formwizard({
		formPluginEnabled: true, 
		validationEnabled: false,
		focusFirstInput : false,
		disableUIStyles : true,
	
		formOptions :{
			success: function(data){$("#status1").fadeTo(500,1,function(){ $(this).html("<span>Form was submitted!</span>").fadeTo(5000, 0); })},
			beforeSubmit: function(data){$("#w1").html("<span>Form was submitted with ajax. Data sent to the server: " + $.param(data) + "</span>");},
			resetForm: true
		}
	});
	
	$("#wizard2").formwizard({ 
		formPluginEnabled: true,
		validationEnabled: true,
		focusFirstInput : false,
		disableUIStyles : true,
	
		formOptions :{
			success: function(data){$("#status2").fadeTo(500,1,function(){ $(this).html("<span>Form was submitted!</span>").fadeTo(5000, 0); })},
			beforeSubmit: function(data){$("#w2").html("<span>Form was submitted with ajax. Data sent to the server: " + $.param(data) + "</span>");},
			dataType: 'json',
			resetForm: true
		},
		validationOptions : {
			rules: {
				bazinga: "required",
				email: { required: true, email: true }
			},
			messages: {
				bazinga: "Bazinga. This note is editable",
				email: { required: "Please specify your email", email: "Correct format is name@domain.com" }
			}
		}
	});
	
	$("#wizard3").formwizard({
		formPluginEnabled: false, 
		validationEnabled: false,
		focusFirstInput : false,
		disableUIStyles : true
	});
	
	
	//===== Validation engine =====//
	
	$("#validate").validationEngine();
	
	
	//===== WYSIWYG editor =====//
	
	$("#editor").cleditor({
		width:"100%", 
		height:"100%",
		bodyStyle: "margin: 10px; font: 12px Arial,Verdana; cursor:text"
	});
	
	
	//===== File uploader =====//
	
	$("#uploader").pluploadQueue({
		runtimes : 'html5,html4',
		url : 'php/upload.php',
		max_file_size : '1mb',
		unique_names : true,
		filters : [
			{title : "Image files", extensions : "jpg,gif,png"}
			//{title : "Zip files", extensions : "zip"}
		]
	});
	
	
	//===== Tags =====//	
		
	$('#tags').tagsInput({width:'100%'});
		
		
	//===== Autogrowing textarea =====//
	
	$(".autoGrow").autoGrow();



/* General stuff
================================================== */


	//===== Left navigation styling =====//
	
	$('li.this').prev('li').css('border-bottom-color', '#2c3237');
	$('li.this').next('li').css('border-top-color', '#2c3237');
	
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
	
	$('.dd').click(function () {
		$('.userDropdown').slideToggle(200);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("dd"))
		$(".userDropdown").slideUp(200);
	});
	  
	  
	  
	//===== Statistics row dropdowns =====//	
		
	$('.ticketsStats > h2 a').click(function () {
		$('#s1').slideToggle(150);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("ticketsStats"))
		$("#s1").slideUp(150);
	});
	
	
	$('.visitsStats > h2 a').click(function () {
		$('#s2').slideToggle(150);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("visitsStats"))
		$("#s2").slideUp(150);
	});
	
	
	$('.usersStats > h2 a').click(function () {
		$('#s3').slideToggle(150);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("usersStats"))
		$("#s3").slideUp(150);
	});
	
	
	$('.ordersStats > h2 a').click(function () {
		$('#s4').slideToggle(150);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("ordersStats"))
		$("#s4").slideUp(150);
	});
	
	
	
	//===== Collapsible elements management =====//
	
	$('.exp').collapsible({
		defaultOpen: 'current',
		cookieName: 'navAct',
		cssOpen: 'active',
		cssClose: 'inactive',
		speed: 200
	});
	
	$('.opened').collapsible({
		defaultOpen: 'opened,toggleOpened',
		cssOpen: 'inactive',
		cssClose: 'normal',
		speed: 200
	});
	
	$('.closed').collapsible({
		defaultOpen: '',
		cssOpen: 'inactive',
		cssClose: 'normal',
		speed: 200
	});
	
	
	$('.goTo').collapsible({
		defaultOpen: 'openedDrop',
		cookieName: 'smallNavAct',
		cssOpen: 'active',
		cssClose: 'inactive',
		speed: 100
	});
	
	/*$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("smalldd"))
		$(".smallDropdown").slideUp(200);
	});*/



	
	//===== Middle navigation dropdowns =====//
	
	$('.mUser').click(function () {
		$('.mSub1').slideToggle(100);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("mUser"))
		$(".mSub1").slideUp(100);
	});
	
	$('.mMessages').click(function () {
		$('.mSub2').slideToggle(100);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("mMessages"))
		$(".mSub2").slideUp(100);
	});
	
	$('.mFiles').click(function () {
		$('.mSub3').slideToggle(100);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("mFiles"))
		$(".mSub3").slideUp(100);
	});
	
	$('.mOrders').click(function () {
		$('.mSub4').slideToggle(100);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("mOrders"))
		$(".mSub4").slideUp(100);
	});



	//===== User nav dropdown =====//		
	
	$('.sidedd').click(function () {
		$('.sideDropdown').slideToggle(200);
	});
	$(document).bind('click', function(e) {
		var $clicked = $(e.target);
		if (! $clicked.parents().hasClass("sidedd"))
		$(".sideDropdown").slideUp(200);
	});
	
	
	//$('.smalldd').click(function () {
	//	$('.smallDropdown').slideDown(200);
	//});





/* Tables
================================================== */


	//===== Check all checbboxes =====//
	
	$(".titleIcon input:checkbox").click(function() {
		var checkedStatus = this.checked;
		$("#checkAll tbody tr td:first-child input:checkbox").each(function() {
			this.checked = checkedStatus;
				if (checkedStatus == this.checked) {
					$(this).closest('.checker > span').removeClass('checked');
				}
				if (this.checked) {
					$(this).closest('.checker > span').addClass('checked');
				}
		});
	});	
	
	$('#checkAll tbody tr td:first-child').next('td').css('border-left-color', '#CBCBCB');
	
	
	
	//===== Resizable columns =====//
	
	$("#res, #res1").colResizable({
		liveDrag:true,
		draggingClass:"dragging" 
	});
	  
	  
	  
	//===== Sortable columns =====//
	
	$("table").tablesorter();
	
	
	
	//===== Dynamic data table =====//
	
	oTable = $('.dTable').dataTable({
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""l>t<"F"fp>'
	});





/* # Pickers
================================================== */


	//===== Color picker =====//
	
	$('#cPicker').ColorPicker({
		color: '#e62e90',
		onShow: function (colpkr) {
			$(colpkr).fadeIn(500);
			return false;
		},
		onHide: function (colpkr) {
			$(colpkr).fadeOut(500);
			return false;
		},
		onChange: function (hsb, hex, rgb) {
			$('#cPicker div').css('backgroundColor', '#' + hex);
		}
	});
	
	$('#flatPicker').ColorPicker({flat: true});
	
	
	
	//===== Time picker =====//
	
	$('.timepicker').timeEntry({
		show24Hours: true, // 24 hours format
		showSeconds: true, // Show seconds?
		spinnerImage: 'images/forms/spinnerUpDown.png', // Arrows image
		spinnerSize: [19, 30, 0], // Image size
		spinnerIncDecOnly: true // Only up and down arrows
	});
	
	
	//===== Datepickers =====//
	
	$( ".datepicker" ).datepicker({ 
		defaultDate: +7,
		autoSize: true,
		appendText: '(dd-mm-yyyy)',
		dateFormat: 'dd-mm-yy',
	});	
	
	$( ".datepickerInline" ).datepicker({ 
		defaultDate: +7,
		autoSize: true,
		appendText: '(dd-mm-yyyy)',
		dateFormat: 'dd-mm-yy',
		numberOfMonths: 1
	});	


	








//===== Progress bars =====//
	
	// default mode
	$('#progress1').anim_progressbar();
	
	// from second #5 till 15
	var iNow = new Date().setTime(new Date().getTime() + 5 * 1000); // now plus 5 secs
	var iEnd = new Date().setTime(new Date().getTime() + 15 * 1000); // now plus 15 secs
	$('#progress2').anim_progressbar({start: iNow, finish: iEnd, interval: 1});
	
	// jQuery UI progress bar
	$( "#progress" ).progressbar({
			value: 80
	});
	
	
	
	//===== Animated progress bars =====//
	
	var percent = $('.progressG').attr('title');
	$('.progressG').animate({width: percent},1000);
	
	var percent = $('.progressO').attr('title');
	$('.progressO').animate({width: percent},1000);
	
	var percent = $('.progressB').attr('title');
	$('.progressB').animate({width: percent},1000);
	
	var percent = $('.progressR').attr('title');
	$('.progressR').animate({width: percent},1000);
	
	
	
	
	var percent = $('#bar1').attr('title');
	$('#bar1').animate({width: percent},1000);
	
	var percent = $('#bar2').attr('title');
	$('#bar2').animate({width: percent},1000);
	
	var percent = $('#bar3').attr('title');
	$('#bar3').animate({width: percent},1000);
	
	var percent = $('#bar4').attr('title');
	$('#bar4').animate({width: percent},1000);
	
	var percent = $('#bar5').attr('title');
	$('#bar5').animate({width: percent},1000);

	var percent = $('#bar6').attr('title');
	$('#bar6').animate({width: percent},1000);

	var percent = $('#bar7').attr('title');
	$('#bar7').animate({width: percent},1000);

	var percent = $('#bar8').attr('title');
	$('#bar8').animate({width: percent},1000);

	var percent = $('#bar9').attr('title');
	$('#bar9').animate({width: percent},1000);




/* Other plugins
================================================== */


	//===== File manager =====//
	
	

	$('#fm').elfinder({
			url : 'php/connector.php',
			toolbar : [
				['back', 'reload'],
				['select', 'open'],
				['quicklook', 'rename'],
			
			['resize', 'icons', 'list']
			],
contextmenu : {
  // Commands that can be executed for current directory
  cwd : ['reload', 'delim', 'info'], 
  // Commands for only one selected file
   file : ['select', 'open', 'rename'], 
   
   }
		});

	
	//===== Calendar =====//
	
	var date = new Date();
	var d = date.getDate();
	var m = date.getMonth();
	var y = date.getFullYear();
	
	$('.calendar').fullCalendar({
		header: {
			left: 'prev,next',
			center: 'title',
			right: 'month,basicWeek,basicDay'
		},
		editable: true,
		events: [
			{
				title: 'All day event',
				start: new Date(y, m, 1)
			},
			{
				title: 'Long event',
				start: new Date(y, m, 5),
				end: new Date(y, m, 8)
			},
			{
				id: 999,
				title: 'Repeating event',
				start: new Date(y, m, 2, 16, 0),
				end: new Date(y, m, 3, 18, 0),
				allDay: false
			},
			{
				id: 999,
				title: 'Repeating event',
				start: new Date(y, m, 9, 16, 0),
				end: new Date(y, m, 10, 18, 0),
				allDay: false
			},
			{
				title: 'Background color could be changed',
				start: new Date(y, m, 30, 10, 30),
				end: new Date(y, m, d+1, 14, 0),
				allDay: false,
				color: '#5c90b5'
			},
			{
				title: 'Lunch',
				start: new Date(y, m, 14, 12, 0),
				end: new Date(y, m, 15, 14, 0),
				allDay: false
			},
			{
				title: 'Birthday PARTY',
				start: new Date(y, m, 18),
				end: new Date(y, m, 20),
				allDay: false
			},
			{
				title: 'Clackable',
				start: new Date(y, m, 27),
				end: new Date(y, m, 29),
				url: 'http://themeforest.net/user/Kopyov'
			}
		]
	});
	
	
	
	
/* UI stuff
================================================== */


	//===== Sparklines =====//
	
	$('.negBar').sparkline('html', {type: 'bar', barColor: '#db6464'} );
	$('.posBar').sparkline('html', {type: 'bar', barColor: '#6daa24'} );
	$('.zeroBar').sparkline('html', {type: 'bar', barColor: '#4e8fc6'} ); 
	
	
	
	//===== Tooltips =====//
	
	$('.tipN').tipsy({gravity: 'n',fade: true});
	$('.tipS').tipsy({gravity: 's',fade: true});
	$('.tipW').tipsy({gravity: 'w',fade: true});
	$('.tipE').tipsy({gravity: 'e',fade: true});
	
		
	
	//===== Accordion =====//		
	
	$('div.menu_body:eq(0)').show();
	$('.acc .title:eq(0)').show().css({color:"#2B6893"});
	
	$(".acc .title").click(function() {	
		$(this).css({color:"#2B6893"}).next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
		$(this).siblings().css({color:"#404040"});
	});
	
	
	//===== Tabs =====//
		
	$.fn.contentTabs = function(){ 
	
		$(this).find(".tab_content").hide(); //Hide all content
		$(this).find("ul.tabs li:first").addClass("activeTab").show(); //Activate first tab
		$(this).find(".tab_content:first").show(); //Show first tab content
	
		$("ul.tabs li").click(function() {
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
	
	$(".hideit").click(function() {
		$(this).fadeTo(200, 0.00, function(){ //fade
			$(this).slideUp(300, function() { //slide up
				$(this).remove(); //then remove from the DOM
			});
		});
	});	
	
	
	
	//===== Lightbox =====//
	
	$("a[rel^='lightbox']").prettyPhoto();
	
	
	
	//===== Image gallery control buttons =====//
	
	$(".gallery ul li").hover(
		function() { $(this).children(".actions").show("fade", 200); },
		function() { $(this).children(".actions").hide("fade", 200); }
	);
	
	
	//===== Spinner options =====//
	
	var itemList = [
		{url: "http://ejohn.org", title: "John Resig"},
		{url: "http://bassistance.de/", title: "J&ouml;rn Zaefferer"},
		{url: "http://snook.ca/jonathan/", title: "Jonathan Snook"},
		{url: "http://rdworth.org/", title: "Richard Worth"},
		{url: "http://www.paulbakaus.com/", title: "Paul Bakaus"},
		{url: "http://www.yehudakatz.com/", title: "Yehuda Katz"},
		{url: "http://www.azarask.in/", title: "Aza Raskin"},
		{url: "http://www.karlswedberg.com/", title: "Karl Swedberg"},
		{url: "http://scottjehl.com/", title: "Scott Jehl"},
		{url: "http://jdsharp.us/", title: "Jonathan Sharp"},
		{url: "http://www.kevinhoyt.org/", title: "Kevin Hoyt"},
		{url: "http://www.codylindley.com/", title: "Cody Lindley"},
		{url: "http://malsup.com/jquery/", title: "Mike Alsup"}
	];
	
	var opts = {
		'sDec': {decimals:2},
		'sStep': {stepping: 0.25},
		'sCur': {currency: '$'},
		'sInline': {},
		'sLink': {
			//
			// Two methods of adding external items to the spinner
			//
			// method 1: on initalisation call the add method directly and format html manually
			init: function(e, ui) {
				for (var i=0; i<itemList.length; i++) {
					ui.add('<a href="'+ itemList[i].url +'" target="_blank">'+ itemList[i].title +'</a>');
				}
			},
	
			// method 2: use the format and items options in combination
			format: '<a href="%(url)" target="_blank">%(title)</a>',
			items: itemList
		}
	};
	
	for (var n in opts)
		$("#"+n).spinner(opts[n]);
	
	$("button").click(function(e){
		var ns = $(this).attr('id').match(/(s\d)\-(\w+)$/);
		if (ns != null)
			$('#'+ns[1]).spinner( (ns[2] == 'create') ? opts[ns[1]] : ns[2]);
	});
	
	
	
	//===== UI dialog =====//
	
	$( "#dialog-message" ).dialog({
		autoOpen: false,
		modal: true,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		}
	});
	
	$( "#opener" ).click(function() {
		$( "#dialog-message" ).dialog( "open" );
		return false;
	});	
		
	
	
	//===== Breadcrumbs =====//
	
	$('#breadcrumbs').xBreadcrumbs();
	
		
		
	//===== jQuery UI sliders =====//	
	
	$( ".uiSlider" ).slider(); /* Usual slider */
	
	
	$( ".uiSliderInc" ).slider({ /* Increments slider */
		value:100,
		min: 0,
		max: 500,
		step: 50,
		slide: function( event, ui ) {
			$( "#amount" ).val( "$" + ui.value );
		}
	});
	$( "#amount" ).val( "$" + $( ".uiSliderInc" ).slider( "value" ) );
		
		
	$( ".uiRangeSlider" ).slider({ /* Range slider */
		range: true,
		min: 0,
		max: 500,
		values: [ 75, 300 ],
		slide: function( event, ui ) {
			$( "#rangeAmount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		}
	});
	$( "#rangeAmount" ).val( "$" + $( ".uiRangeSlider" ).slider( "values", 0 ) +" - $" + $( ".uiRangeSlider" ).slider( "values", 1 ));
			
			
	$( ".uiMinRange" ).slider({ /* Slider with minimum */
		range: "min",
		value: 37,
		min: 1,
		max: 700,
		slide: function( event, ui ) {
			$( "#minRangeAmount" ).val( "$" + ui.value );
		}
	});
	$( "#minRangeAmount" ).val( "$" + $( ".uiMinRange" ).slider( "value" ) );
	
	
	$( ".uiMaxRange" ).slider({ /* Slider with maximum */
		range: "max",
		min: 1,
		max: 100,
		value: 20,
		slide: function( event, ui ) {
			$( "#maxRangeAmount" ).val( ui.value );
		}
	});
	$( "#maxRangeAmount" ).val( $( ".uiMaxRange" ).slider( "value" ) );	



	//===== Form elements styling =====//
	
	$("select, input:checkbox, input:radio, input:file").uniform();

	
});