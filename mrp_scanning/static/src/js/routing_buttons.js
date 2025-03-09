function goToSelectPage() {
    console.log('Button Clicked')
    var mo_id = document.getElementById('mo_id').value;
    var url = '/select?mo_id=' + mo_id;
    if (mo_id){
        window.location.href = url;
    }
    else{
        alert("You have to scan MO!");
    }
}

function goToWorkPage() {
    console.log('Button Clicked')
    var mo_id = document.getElementById('mo_id').textContent;
    var wo_id = document.getElementById('wo_id').textContent;
    var url = '/work?mo_id=' + mo_id + '&wo_id=' + wo_id;
    if (mo_id && wo_id){
        window.location.href = url;
    }
    else{
        alert("You have to select WO!");
    }
}

function goBackToSelectPage(){
    const searchParams = new URLSearchParams(window.location.search);
    const moId = searchParams.get('mo_id');
    window.location.href = '/select?mo_id=' + moId;
}

function goBackToScan(){
    window.location.href = '/scan';
}
