var wo_id = document.getElementById('work_order_id').textContent;
var workOrderState= document.getElementById('status').textContent;
var is_user_working= document.getElementById('is_user_working').textContent;
var work_state = document.getElementById("work-state");
var done_state = document.getElementById("done-state");

function showDoneState(){
    work_state.classList.remove("visible");
    work_state.classList.add("hidden");
    done_state.classList.remove("hidden");
    done_state.classList.add("visible");
    
}
function showWorkState(){
    done_state.classList.remove("visible");
    done_state.classList.add("hidden");
    work_state.classList.remove("hidden");
    work_state.classList.add("visible");
}

if (workOrderState =="Done" ){
    $('#button-start').hide();
    $('#button-pause').hide();
    $('#button-stop').hide();
    showDoneState();
}
else{
    showWorkState();
}

function showButtons(){
    if (workOrderState == "In Progress" && is_user_working=="Currently working"){
        $('#button-start').hide();
        $('#button-pause').show();
        $('#button-stop').show();
        startTimer();
    }
    if(workOrderState == "Paused" || (workOrderState == "In Progress" && is_user_working=="Not working")){
        $('#button-pause').hide();
        $('#button-start').show();
        $('#button-stop').hide();
    }
    if(workOrderState =="Done"){
        $('#button-start').hide();
        $('#button-pause').hide();
        $('#button-stop').hide();
    }
}

$(document).ready(function () {
    
    showButtons();
    console.log('workorderstate: ',workOrderState);
    console.log('isuserworking: ',is_user_working)


    $('#button-start').click(function () {
        //start the process
        $.ajax({
            url: "/start",
            type: "POST",
            data: {
                'workorder_id': wo_id,
            },
            success: function (result) {
                console.log("Started");
            },
            error: function (xhr, status, error) {
                // handle any errors that occur
            }
        });
        workOrderState = "In Progress";
        is_user_working ="Currently working";
        $('#status').text(workOrderState);
        $('#is_user_working').text(is_user_working);
        startTimer();
        showButtons();
        showWorkState();

    });

    $('#button-pause').click(function() {
        workOrderState = "Paused";
        is_user_working ="Not working";
        
        $('#status').text(workOrderState);
        $('#is_user_working').text(is_user_working);
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
    });

    $('#button-stop').click(function () {
        workOrderState = "Done";
        is_user_working ="Not working";

        $('#status').text(workOrderState);
        $('#is_user_working').text(is_user_working);
        
        $.ajax({
            url: "/stop",
            type: "POST",
            data: {
                'workorder_id': wo_id,
            },
            success: function (result) {
                console.log("Stopped");
            },
            error: function (xhr, status, error) {
                // handle any errors that occur
            }
        });
        showButtons();
        pauseTimer();
        showDoneState();
    });
});

