$(document).ready(function() {
    var costData;
    var costCtx = document.getElementById('cost-chart').getContext('2d');
    
    // Make an Ajax request to retrieve the WOs
    $.ajax({
        url: "/dashboard/get_mo_cost",
        type: "POST",
        dataType: 'json',
        success: function(response) {
            costData=response.cost_data;
            useReturnData(costData);
           
        },
        error: function(xhr, status, error) {
        console.log(error);
        }
    });

    function useReturnData(data){
        costData = data;

        real_cost_array = costData.map(d => d.real_cost)
        bom_cost_array = costData.map(d => d.bom_cost)
        labelsArray=costData.map(l => l.name)
    
        var costChart = new Chart(costCtx, {
            type: 'bar',
            data: {
                labels:  labelsArray,
                datasets: [{
                    label: 'Real cost',
                    data: real_cost_array,
                    fill: true,
                    backgroundColor: '#71639e',
                    borderWidth: 1,
                }, {
                    label: 'BoM Cost',
                    data: bom_cost_array,
                    backgroundColor: '#bcb2de',
                    borderWidth: 1,
                }]
            },
            options: {
                scales: {
                    y: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return value + 'RON';
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
