// Make an Ajax request to retrieve the MOs

$.ajax({
    url: "/dashboard/get_mo_progress",
    type: "POST",
    dataType: 'json',
    success: function(response) {
        useReturnData(response.mo_data);
    },
    error: function(xhr, status, error) {
    console.log(error);
    }
});


function useReturnData(data){
    var mos = [];

    for (var i = 0; i <= data.length-1; i++) {
        var mo = data[i]
        // Create a task object with the necessary fields
        var manufacturing_order = {
            id: mo.id.toString(),
            text: mo.name + ' ' + mo.progress_percentage + ' %',
            start_date: mo.date_start,
            end_date:mo.date_end,
            duration:null,
            progress: mo.progress_percentage/100,
            progressColor: '#71639ec2',
            parent:0,
            open: true,
            editable:false,
            readonly:true,
            deadline:mo.date_deadline,
            type:"task",
            origin: mo.origin,//needed for serch
        };
        // Add the task to the array of tasks
        mos.push(manufacturing_order);
    }
    
    //MARKER
    var deadlineMarker ;
    gantt.attachEvent("onTaskSelected", function(id) {
        var task = gantt.getTask(id);
        
        if (task && task.deadline) {
           deadlineMarker = gantt.addMarker({
                start_date:new Date(task.deadline),   
                css: "deadline_marker", 
                text: "Deadline", 
                title: dateToStr( new Date(task.deadline))   
            });
        }
        
    })

    gantt.attachEvent("onTaskUnSelected", function(id) {  
        gantt.deleteMarker(deadlineMarker);
    })

    //CONFIG
    gantt.config.date_format = "%Y-%m-%d %H:%i";
    gantt.config.scales = [
            {unit: "month", step: 1, format: "%F, %Y"},
        ];
    gantt.config.columns = [ 
        {name:"text", label:"MO name", width:"*", tree:true }, 
        {name:"start_date", label:"Start time", align: "center" }, 
        ];

    //INIT
    gantt.init("gantt");
    gantt.parse({data:mos});
   
 
    //CONTROLS
	var radios = document.getElementsByName("scale");
	for (var i = 0; i < radios.length; i++) {
		radios[i].onclick = function (event) {
			gantt.ext.zoom.setLevel(event.target.value);
		};
	}

    //SEARCH
    // Event listener to search input
    var searchInput = document.querySelector("#search");
    searchInput.addEventListener("input", function() {
        // Get the search term
        var searchTerm = this.value.toLowerCase();
        // Filter the tasks based on the search term
        var filteredMOS = mos.filter(function(manufacturing_order) {
            var originMatch = false;
            if (manufacturing_order.origin && typeof manufacturing_order.origin === 'string') {
                originMatch = manufacturing_order.origin.toLowerCase().includes(searchTerm);
            }
            console.log(originMatch)
            return originMatch;
        });
    
        // Update the Gantt chart with the filtered tasks or all tasks
        var filteredMos = searchTerm ? filteredMOS : mos;
        gantt.clearAll(); 
        gantt.parse({data:filteredMos});
  
    });
}

gantt.plugins({ 
    marker: true 
}); 

var dateToStr = gantt.date.date_to_str(gantt.config.task_date);

function zoomIn(){
    gantt.ext.zoom.zoomIn();
}
function zoomOut(){
    gantt.ext.zoom.zoomOut()
}
