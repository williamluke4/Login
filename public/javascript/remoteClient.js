//TODO Clean Up Code and Split Up in to different files
window.onload = function () {
	var messages = [];
	//onload this function will initialize a connection and privide communication between server and client
	var socket = io.connect();
	var switches = $('.switches').find('input');
	socket.on('connect', function () {});

	function setState(elementID, state) {
		clientState = $(elementID).prop("checked");
		if (state == 1 || state == '1') {
			console.log("Switch: " + elementID + "| Switched On");
			$(elementID).bootstrapToggle("on");
		} else if (state == 0 || state == '0') {
			console.log("Switch: " + elementID + " | Switched Off");
			$(elementID).bootstrapToggle("off");
		}
	}

	function checkState(elementID) {
		var dataID = $(elementID).attr('data-id');
		var checkaction = dataID + '' + 2;
		var state = $(elementID).prop('checked');
		socket.emit('send', {
			webstate: state,
			message: checkaction,
			switchID: elementID
		});
		console.log("Sent Checking Command: " + checkaction);
	}


	switches.each(function () {


		// Initial Setup
		var switchid = '#' + $(this).prop('id');
		$(switchid).bootstrapToggle();
		checkState(switchid);
		var dataID = $(switchid).attr('data-id');

		//On Switch Click
		$(switchid).parent().on('click', function () {
			var toggleState = $(switchid).prop('checked');
			var toggleAction = (toggleState == true) ? 0 : 1;
			var action = dataID + '' + toggleAction;

			console.log("Sending: " + action);
			socket.emit('send', {
				webstate: toggleState,
				message: action,
				switchID: switchid
			});

			console.log("Message Now Sent: " + action);
		});



	});
	//On Sending Error
	socket.on("callbackError", function (data) {
		console.log(data.error);
		$(data.switchID).siblings('div').children('.toggle-on').css("background-color", "red");
		$(data.switchID).siblings('div').children('.toggle-off').css("background-color", "red");
		console.log("NO REPLY: " + data.switchID);
		if (data.webstate) {
			$(data.switchID).bootstrapToggle("on");
		} else {
			$(data.switchID).bootstrapToggle("off");
		}

	});

	 //Message Recived
	socket.on("callbackButton", function (data) {
		$(data.switchID).siblings('div').children('.toggle-on').css("background-color", "#337ab7");
		$(data.switchID).siblings('div').children('.toggle-off').css("background-color", "#e6e6e6");
		if (data.message.indexOf("received") > -1) {
			console.log("Data State is: " + data.state);
			setState(data.switchID, data.state);
		}
	});

	// Message Failed
	socket.on("failed", function (data) {
		$(data.switchID).siblings('div').children('.toggle-on').css("background-color", "red");
		$(data.switchID).siblings('div').children('.toggle-off').css("background-color", "red");
		console.log("NO REPLY: " + data.switchID);
		if (data.webstate) {
			$(data.switchID).bootstrapToggle("on");
		} else {
			$(data.switchID).bootstrapToggle("off");
		}
	});


    // Onclick Of Refresh Button
    $('.refresh').on('click', function () {
        var switches = $('.switches').find('input');
        switches.each(function () {
            var switchid = '#' + $(this).prop('id');
            checkState(switchid);
        });
    })


    // Onclick Of Add Switch Button
    $('.addbtn').on('click', function () {
        $('#add').slideToggle("slow");
    })
    //Send Custom Command
    $('.custombtn').on('click', function () {
		$('#custom').slideToggle("slow");
        /*socket.emit('send', {
            message: command
        });
        console.log("Sending Custom Command: " + command)*/

    })
	$('#submitCustom').on('click', function () {
		command = $('#customCode').val();
		$('#custom').slideToggle("slow");
		socket.emit('send', {
		 	message: command
		});
		console.log("Sending Custom Command: " + command)

	})

};


