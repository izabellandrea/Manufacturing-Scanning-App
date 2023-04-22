const moIdInput = document.getElementById("mo_id");
const woIdList = document.getElementById("wo_ids");
//this code filters work orders displayed in the dropdown list after scanning an MO


moId=moIdInput.textContent;
console.log("mo_id:,",moId);

// Make an Ajax request to retrieve the related WOs
$.ajax({
    url: "/select/get_related_wos",
    type: "POST",
    data: { mo_id: moId },
    dataType: 'json',
    success: function(response) {
        // Clear the existing 
        woIdList.innerHTML = "";
        console.log(response);

        if (response.related_wos && response.related_wos.length > 0) {
            // Add new for each related WO
            response.related_wos.forEach(function(wo) {
                const li = document.createElement("li");
                li.value = wo.id;
                li.textContent = wo.name;
                li.className = "list-group-item"

                const span = document.createElement("span");
                span.textContent = wo.state;

                li.appendChild(span);
                woIdList.appendChild(li);
                
                li.addEventListener("click", function() {
                    // Remove selected class from all li elements
                    const allLiElements = woIdList.querySelectorAll("li");
                    allLiElements.forEach(function(el) {
                        el.classList.remove("selected");
                    });
                    console.log("clicked");
                    // Set selected class to clicked li element
                    this.classList.add("selected");
                    wo_id = document.getElementById("wo_id")
                    wo_id.textContent = li.value;
                });   
            });
        }
        else{
            const text= document.createElement("p");
            text.innerText = "No more WOs for this MO";
            woIdList.appendChild(text);

        }
    },
    error: function(xhr, status, error) {
    console.log(error);
    }
});
