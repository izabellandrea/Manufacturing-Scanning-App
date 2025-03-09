const searchParams = new URLSearchParams(window.location.search);
const moId = searchParams.get('mo_id');
const woId = searchParams.get('wo_id');

console.log(moId,woId)

    $.ajax({
        url: "/work/check_mo_wo_combination",
        type: "POST",
        data: JSON.stringify({
            mo_id:moId,
            wo_id:woId,
        }),
        contentType: "application/json",
        success: function(response) {
        
            if (response.result.exists) {
                
            }
            else{
            window.location.href = '/scan';
            }
        }
    });
