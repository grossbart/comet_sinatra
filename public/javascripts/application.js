// Start Application
$(document).ready(function() {
    Comet.connect(updatePixels);

    $("#checkboard").bind("changed", function() {
	sendPixels($(this).find("li.active"));
    });

    $("#checkboard li").mousedown(function() {
	$(this).parent().addClass("active");
	var beforeState = $(this).hasClass("active");
	$(this).one("mouseup", function() {
	    if (beforeState) $(this).removeClass("active");
	    $(this).unbind("mouseleave");
            $(this).parent().trigger("changed");
	});
	$(this).one("mouseleave", function() {
	    $(this).addClass("active").unbind("mouseup");
	    $(this).parent().trigger("changed");
	});
	$(this).addClass("active");
    });

    $("#checkboard li").mouseenter(function() {
	if ($(this).parent().hasClass("active")) {
	    $(this).addClass("active")
	    .parent().trigger("changed");
	}
    });

    $(window).mouseup(function() {
	$("#checkboard").removeClass("active");
    });
});


// jQuery Extensions
$.fn.pixelID = function() {
    return parseInt(this.attr("id").replace("pixel-", ""));
}


// Helper functions
function sendPixels(pixels) {
    var activeIDs = [];
    pixels.each(function(i, el) {
    	activeIDs.push($(el).pixelID());
    });
    Comet.publish({activePixels: activeIDs});
}

function updatePixels(message) {
    if (!message.activePixels) return;
    var pixelIDs = $.map(message.activePixels, function(el, i) { return "#pixel-"+el});
    $("#checkboard")
    .find("li.active")
    .removeClass("active")
    .end()
    .find(pixelIDs.join(",")).each(function(i, el) {
	$(el).addClass("active");
    });
}