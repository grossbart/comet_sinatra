(function(){
    var connectionURL = '/subscribe', publishURL = '/publish',
        id, bufferPos, onStateChangeCallback;

    Comet = {
    	connect: function(callback) {
	    bufferPos = 0;
    	    onStateChangeCallback = callback;
    	    $.ajax({
    		url: connectionURL,
    		type: 'get',
		data: (id === undefined) ? {} : {id: id},
    		beforeSend: function(xhr) {
    		    xhr.onreadystatechange = onStateChange
    		},
    		success: function(data,status){
    		    Comet.connect(onStateChangeCallback);
    		}
    	    });
    	},
	publish: function(message) {
	    $.post(publishURL, {sender_id: id, message: JSON.stringify(message)});
	}
    }

    function onStateChange(response) {
	var message = response.target.responseText.substring(bufferPos);
	if (message.length == 0) return;
	if (id === undefined) {
	    id = JSON.parse(message).id;
	} else {
	    try {
		onStateChangeCallback(JSON.parse(message));
	    } catch (e) {} // Ignore parse errors
	}
	bufferPos = response.target.responseText.length;
    }
})();
