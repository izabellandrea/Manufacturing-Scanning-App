function send_message() {
    console.log("hello")
    $.ajax({
        url: '/send_message',
        type: 'POST',
        success: function(result) {
            console.log("sent")
        },
        error: function (xhr, status, error) {
            // handle any errors that occur
        }
    });
}