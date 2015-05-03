function BusTimes() {
   	
	document.getElementById('output1').innerHTML = "";
	var central_leaving = ["0818","0836","0838","0918","1008","1033","1053","1108","1128","1143","1208","1223","1243","1308","1328","1343"	,"1408"	,"1423"	,"1443"	,"1458"	,"1513"	,"1533"	,"1548"	,"1628"	,"1708"	,"1738"	,"1808"];	
	var now = new Date();
	var time = [ now.getHours(), now.getMinutes()];
	var now_total_mins = time[0]*60+time[1];
	var arrayLength = central_leaving.length;
	$("#output1").toggleClass("hidden");
	for (var i = 0; i < (arrayLength); i++) {
		var central_time = central_leaving[i];
	
		if (central_time.length == 3) {
			var strleaving_hour = central_time[0];
			var strleaving_mins = central_time[1] + central_time[2];
			var intleaving_hour = parseInt(strleaving_hour);
			var intleaving_mins = parseInt(strleaving_mins);
			total = intleaving_hour*60+intleaving_mins
			//document.write(central_time+ " "+total+ "<br>");
			

		}
		else {
			var strleaving_hour = central_time[0] + central_time[1];
			var strleaving_mins = central_time[2] + central_time[3];
			var intleaving_hour = parseInt(strleaving_hour);
			var intleaving_mins = parseInt(strleaving_mins);
			total = intleaving_hour*60+intleaving_mins
			
		}
    	if (total > now_total_mins && total - now_total_mins <120) {
    		var leaving_in = total - now_total_mins
		
    		if(leaving_in <4) {
    			alert("YOU HAVE MISSED THE FUCKING BUS AGAIN");
    		}
		else if(leaving_in > 70) {
			leaving_in = leaving_in - 60;
			leaving_in = "1 hour " + leaving_in
		}	 
    		$("#output1").append("<li>Bus Leaving at " + strleaving_hour + ":" +strleaving_mins + " in " + leaving_in + " mins"+ "</li>");
			
    	}
	}
}
function toggle() {
	$(".switchBox").toggleClass("hidden");
}