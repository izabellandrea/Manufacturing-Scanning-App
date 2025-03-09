var currentMoId;// the mo_id of the scanned document
function check_scanned_mo(scanned_mo){
    $.ajax({
        url: "/scan/check_mrp_production_order",
        type: "POST",
        data: JSON.stringify({
            manufacturing_order_name: scanned_mo,
        }),
        contentType: "application/json",
        success: function(response) {
        
          if (response.result.exists) {
              console.log('response result', response.result)
              if(response.result.inactive){
                currentMoId = null;
                document.getElementById("mo_id").value = currentMoId;
                alert("The manufacturing order is not active!");
              } 
              else{
                // The manufacturing order exists in the database
                currentMoId = response.result.mo_id;
                document.getElementById("mo_id").value = currentMoId;
                document.getElementById("moo_name").value ='';
                goToSelectPage();
                }
          } 
          else {
              // The manufacturing order does not exist in the database
              currentMoId = null;
              document.getElementById("mo_id").value = currentMoId;
              document.getElementById("moo_name").value ='';
              alert("The manufacturing order does NOT exist in the database. Scan again");
          }
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
      });
}