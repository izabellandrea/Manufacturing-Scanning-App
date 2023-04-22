//The purpose of this code is to not let the user leave or refresh the working page while a working on it
// when attempt to leave, the process will be paused

 window.addEventListener("beforeunload", function(event) {
    if(is_user_working=="Currently working"){

        workOrderState = "Paused";
        is_user_working ="Not working";
        
        $('#status').text(workOrderState);
        $('#is_user_working').text(is_user_working);

        //trigger the pause on the odoo side
        $.ajax({
            url: "/pause",
            type: "POST",
            data: {
                'workorder_id': wo_id,
            },
            success: function (result) {
                console.log("Paused");
            },
            error: function (xhr, status, error) {
                // handle any errors that occur
            }
        });
       
        pauseTimer();
        showButtons();
        showWorkState();
        event.returnValue = "Process will be paused if you leave";
    }
  });