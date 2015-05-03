window.onload = function () {
	var href=location.href
	if (href.indexOf("/switches") > -1) {
		$("li").removeClass("active");
		$("#page2btn").addClass("active");
	}
	else {
		$("li").removeClass("active");
		$("#page1btn").addClass("active");
	}

}

function deleteit(item) {

	var element = $(item).siblings('div').find('input').attr('id');
	console.log(element);
	$.ajax({
		url: "/delete",
		type: "POST",
		data: { elementID: element},
		dataType: "json"

	});
	location.reload();

}
