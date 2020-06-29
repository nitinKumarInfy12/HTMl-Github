
var jsonData = []
var reportList = {}
$(document).ready(function () {

	//materialize css initialize SideNav
	$(".button-collapse").sideNav({closeOnClick: true,menuWidth: 400,edge:'right'});
	$('.starter').css("display", "none");

  // initialize Modal window for showing Security Roles for accessing S&OP Portal
	$('#modal_snop_security').modal();

	// initialize Modal window for showing Security Roles for accessing Cognos
	$('#modal_cognos_security').modal();

	// initialize Modal window for showing Security Roles for accessing Tableau
	$('#modal_tableau_security').modal();

	if ( navigator.userAgent.indexOf("Trident")!=-1 || navigator.userAgent.indexOf("Edge")!=-1 ) {
    //Add banner to the page here.
		$('.fixed-announcement').show();
	}
	else{
		$('.fixed-announcement').hide();
	}

	var cardDiv = '';

	//Create an asyn call to load JSON data in variable.
	$.ajax({
		url: "./data/properties.json",
		dataType: "text",
		success: function (data) {

			//If JSON data load is successful.
			jsonData = JSON.parse(data);

							//Update the link for S&OP Portal based on JSON file.
			$('#SnOP').attr('href', jsonData.config[0].cognosServer + "?pathRef=.public_folders%2FOFS%2FProduction+Support%2FReport+Views%2FStrategic%2FS%26OP%2FS%26OP+Portal&format=HTML&a11y=true&prompt=true&action=run");

			//Update the link for Cognos Portal based on JSON file.
			$('#eCognos').attr('href', jsonData.config[0].cognosServer);

			//Update the link for Tableau Portal based on JSON file.
			$('#eTableau').attr('href', jsonData.config[0].tableauServer);

			//Update the link for TM1 Portal based on JSON file.
			$('#tm1Link').attr('href', jsonData.config[0].tm1Server);

			jsonData.productTeam.forEach(function (element) {

			    //Get product_team.name amd create nav-bar elements from JSON
				$('#nav-mobile').append(
					"<li>"+
						"<a class='myanchor tooltipped' id='"+element.name.replace(/ /g,"_")+"_tab' data-position='bottom' data-delay='50' data-tooltip='" +element.tooltip+ "' href='#' style=\"padding-left:10px;padding-right:10px;\">"+element.name+"</a>"+
					"</li>"
				);

				$('#slide-out').append(
					"<li>"+
						"<a class='myanchor' href='#' style=\"font-size:24px; !Important; text-transform: uppercase;\">"+element.name+"</a>"+
					"</li>"
				);

			    //Create Cards for each product_team.name from JSON
				cardDiv = cardDiv + "<div id='"+ element.name.replace(/ /g,"_") +"' class='nav-content'>"
								  + "<div class='card hoverable large' style='padding-top:25px !important;'>"
								  // + "<a class='btn-large btn-floating halfway-fab right white-text waves-effect waves-light red' href='mailto:"+jsonData.config[0].supportEmail+"?subject="+jsonData.config[0].emailSubject+"'><i class='material-icons'>email</i></a>"
								  + "<div class='row' style='min-height:100%;'>"
								  + "<div class='col s12 card-content left'>";

				if(element.toggle.toLowerCase()==="yes"){
					cardDiv = cardDiv +
							  "<button class='onDemandBtn toggle btn1' group='"+ element.name.replace(/ /g,"_") +"'>"+element.onDemandBtnLabel+"</button>"+
							  "<button class='starterBtn toggle btn2' group='"+ element.name.replace(/ /g,"_") +"'>"+element.starterBtnLabel+"</button>"+
							  "<div class='col s12 left'>"+
							  "<div class='onDemand grid' id='"+element.name.replace(/ /g,"_")+"_onDemand'>";
				}
				else{
					cardDiv = cardDiv + "<div class='col s12 left grid'>";
				}
					//Adding Grid columns and rows for IE and Edge implementation of CSS Grid structure
					var row=1;
					var col=1;

					//Create div group for Sub_groups inside a product_team.
					$.each(element.subGroup, function (index, subGroup) {
							pointer=index+1;
							cardDiv = cardDiv +
							"<div class='row header-row left'  style='margin-left:0px;-ms-grid-column:"+col+";-ms-grid-row:"+row+";'>" +
							"<img class='left logo' src='./images/"+subGroup.icon+"-logo.png'/>" +
							"<p class='left-align black-text'" +
							"style='white-space:nowrap;display:inline;'>" +
							"<strong>" + subGroup.name + "</strong></p>";

					//Add a link and information image, when JSON has value for job_aid.
						if (subGroup.jobAid!="")
						{cardDiv = cardDiv + "<a target='_blank' href='" + subGroup.jobAid + "'>"+
										"<img class='information' style='vertical-align:center;margin-left:5px;'/></a>";
						}

							//Add a link for each report for sub groups from JSON.
							$.each(subGroup.reports, function (index, reports) {
								cardDiv = cardDiv + "<div class='row indent'>";

								if(subGroup.name=="Tableau"){
									cardDiv = cardDiv +"<a class='hy left' href=\"" + jsonData.config[0].tableauServer + reports.reportPath + "\" target='_blank'>" +
									"<h6>" + reports.reportName + "</h6></a></div>";
									reportList[reports.reportName]=jsonData.config[0].tableauServer + reports.reportPath;
								}
								else{
									cardDiv = cardDiv +	"<a class='hy left' href=\"" + element.cognosServer + reports.reportPath + "\" target='_blank'>" +
									"<h6>" + reports.reportName + "</h6></a></div>";
									reportList[reports.reportName]=element.cognosServer + reports.reportPath;
								}

							});
						cardDiv = cardDiv  + "</div>";
						col=col+1
						if(pointer%3==0){
							row=row+1;
							col=1;
						}

					});


				if(element.toggle==="yes"){
					cardDiv = cardDiv + "</div>";
				}

				//Add section for Starter Queries
				if(element.subGroupStarter){
					cardDiv = cardDiv + "<div class='starter grid' id='"+element.name.replace(/ /g,"_")+"_starter'>";

					$.each(element.subGroupStarter, function (index, subGroupStarter) {

						cardDiv = cardDiv +
							"<div class='row header-row left'  style='margin-left:0px;'>" +
							"<img class='left logo' src='./images/"+subGroupStarter.icon+"-logo.png'/>" +
							"<p class='left-align black-text'" +
							"style='white-space:nowrap;display:inline;'>" +
							"<strong>" + subGroupStarter.name + "</strong></p>";

					//Add a link and information image, when JSON has value for job_aid.
						if (subGroupStarter.jobAid===""){}
						else{cardDiv = cardDiv + "<a target='_blank' href='" + subGroupStarter.jobAid + "'>"+
										"<img class='information' style='vertical-align:top'/></a>";
						}

							//Add a link for each report for sub groups from JSON.
							$.each(subGroupStarter.reports, function (index, reports) {
								cardDiv = cardDiv + "<div class='row indent'>";
									if(element.name=="Tableau"){
										cardDiv = cardDiv +"<a class='hy left' href=\"" + jsonData.config[0].tableauServer + reports.reportPath + "\" target='_blank'>";
										reportList[reports.reportName]=jsonData.config[0].tableauServer + reports.reportPath;
									}
									else{
										cardDiv = cardDiv +"<a class='hy left' href=\"" + element.cognosServer + reports.reportPath + "\" target='_blank'>";
										reportList[reports.reportName]=element.cognosServer + reports.reportPath;
									};

									cardDiv = cardDiv + "<h6>" + reports.reportName + "</h6></a></div>";

								//alert(cardDiv);
							});
						cardDiv = cardDiv  + "</div>";

					});
					cardDiv=cardDiv+'</div>';
				}

				cardDiv = cardDiv + "</div></div></div></div></div></div></div>";


			});

			// Append all the information created above to div with class .main-grid
			$('.main-grid').append(cardDiv);

			//Hide all .nav-content divs when page loads.
			$('.nav-content').css("display", "none");

			//Show the first .nav-content div.
			$('.nav-content:first').css("display", "block");

			document.getElementById('logo').src = "./images/Global_1color_White.png";
			document.getElementById('welcome').src = "./images/welcome.png";

			var information = document.getElementsByClassName('information');
			for (i = 0; i < information.length; i++) {
				information[i].src = "./images/information.png";
			}

			$('.tooltipped').tooltip({delay: 200});
			$('#modal_search').modal();

			$('input.autocomplete').autocomplete({
				data: reportList,
				limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
				onAutocomplete: function(val) {
				   $('#modal1').modal('close');
				   //alert(reportList[val]);
				   window.open(reportList[val]);
				   $('#autocomplete-input').val('');
				},
				minLength: 2, // The minimum length of the input for the autocomplete to start. Default: 1.
			});


				$.ajax({
					url: "./data/notifications.json",
					dataType: "text",
					success: function (data) {

						var d = new Date();
						var month = d.getMonth()+1;
						var day = d.getDate();
						var output = d.getFullYear() + '/' +
							((''+month).length<2 ? '0' : '') + month + '/' +
							((''+day).length<2 ? '0' : '') + day;

						jsonData = JSON.parse(data);

						if(Object.keys(jsonData)[0]==output)
						{
							$('#nav-mobile').prepend(
								"<li>"
								+	"<a class='modal-trigger' id='notification_icon' href='#modal_notifications' style='color:cyan'><i class='material-icons'>notifications_active</i></a>"
								+"</li>"
							);
						}
						else{
							$('#nav-mobile').prepend(
								"<li>"
								+	"<a class='modal-trigger' href='#modal_notifications'><i class='material-icons'>notifications</i></a>"
								+"</li>"
							);
						}

						$.each(jsonData, function(key, data){
							$('#notificationsList').append(
								"<li>"
								+ key
								+": "
								+ data
								+"</li>"
								+ "<br>"
							);

						});

						$('#nav-mobile').prepend(
							"<li>"+
								"<a class='modal-trigger' href='#modal_search'><i class='material-icons'>search</i></a>"
							+"</li>"
						);

						$('#modal_notifications').modal();

						$('#notification_icon').addClass('animated tada');
					}
				});
		}

	});

	$(document).on('click', '.myanchor', function () {
		$("a").removeClass("active");
		$(this).addClass("active");
		$('.starter').hide();
		$('.onDemand').show();
		//$('.cognos-logo').show();
		var tab = $(this).attr('id').replace("_tab","");
		$('.nav-content').slideUp();
		$("#"+tab).slideDown();
	});
});



//following function is used to show Starter Queries section and hide onDemand section
$(function () {
	$(document).on('click', '.starterBtn', function () {
		$('.onDemand').hide();
		//$('.cognos-logo').hide();
		//$('.tableau-logo').show();

		var starter = $(this).attr('group')+ "_starter";
		$("#"+starter).show();
		return false;
	});
});

//following function is used to show onDemand section and hide Starter section
$(function () {
	$(document).on('click','.onDemandBtn', function () {
		$('.starter').hide();
		//$('.cognos-logo').show();
		//$('.tableau-logo').hide();
		var onDemand = $(this).attr('group')+ "_onDemand";
		$("#"+onDemand).show();
		return false;
	});
});

$(function(){
	$(document).on('click', '#logo', function(){
			$("a").removeClass("active");
			$('.myanchor').eq(0).addClass("active");
			$('.nav-content').slideUp();
			$('.nav-content').eq(0).slideDown();
		});
});
