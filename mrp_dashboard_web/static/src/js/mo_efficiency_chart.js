$(document).ready(function() {
    var efficiencyData;
    var efficiencyCtx = document.getElementById('efficiency-chart').getContext('2d');
    
    // Make an Ajax request to retrieve the WOs
    $.ajax({
        url: "/dashboard/get_mo_efficiency",
        type: "POST",
        dataType: 'json',
        success: function(response) {
            efficiencyData=response.efficiency_data;
            useReturnData(efficiencyData);
           
        },
        error: function(xhr, status, error) {
        console.log(error);
        }
    });

    function useReturnData(data){
        efficiencyData = data;
        dataArray=efficiencyData.map(d => d.efficiency);
        labelsArray=efficiencyData.map(l => l.name)
    
        var efficiencyChart = new Chart(efficiencyCtx, {
            type: 'line',
            data: {
                labels:  labelsArray,
                datasets: [{
                    label: 'Manufacturing orders time efficiency %',
                    data: dataArray,
                    fill: true,
                    borderColor: 'red',
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                    y: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value + '%';
                            }
                        }
                    }],
                    x: [{
                        ticks: {
                            autoSkip: false,
                            maxRotation: 90,
                            minRotation: 90
                        }
                    }]
                }
            }
        }); 
    };
});
