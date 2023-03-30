
function filterResults(urgencies, categories, allowClosed)
{
    var requestsToFilter = document.getElementsByClassName("request");

    for(var i = 0; i < requestsToFilter.length; i++)
    {
        var hasCategory = false;
        var hasUrgency = false;
        var showClosed = true;

        //if categories.length <= 1 && urgencies.length <= 1 meetsRequirements = true
        //if categories 
        if(categories.includes((requestsToFilter[i].querySelector(".request-category").innerHTML.toLowerCase().substring(10)))
        || categories.length <= 1)
        {
            hasCategory = true;
        }

        if(urgencies.includes(requestsToFilter[i].querySelector(".request-urgency-text").innerHTML.toLowerCase())
        || urgencies.length <= 1)
        {
            hasUrgency = true;
        }

        if(requestsToFilter[i].className.split(" ").includes("request-archived") && !allowClosed)
        {
            showClosed = false;
        }

        if(hasCategory && hasUrgency && showClosed) requestsToFilter[i].style.display = "block";
        else requestsToFilter[i].style.display = "none";
    }
}

function revertFilters(event)
{
    event.preventDefault();

    document.getElementById("filter-low").checked = false;
    document.getElementById("filter-medium").checked = false;
    document.getElementById("filter-high").checked = false;

    document.getElementById("filter-physical").checked = false;
    document.getElementById("filter-technical").checked = false;
    document.getElementById("filter-informative").checked = false;
    document.getElementById("filter-supplies").checked = false;
    document.getElementById("filter-pet").checked = false;
    document.getElementById("filter-other").checked = false;

    filterResults([""],[""],false);
}

function processFilters(event)
{
    event.preventDefault();

    var low = document.getElementById("filter-low").checked;
    var medium = document.getElementById("filter-medium").checked;
    var high = document.getElementById("filter-high").checked;

    var phy = document.getElementById("filter-physical").checked;
    var tec = document.getElementById("filter-technical").checked;
    var inf = document.getElementById("filter-informative").checked;
    var sup = document.getElementById("filter-supplies").checked;
    var pet = document.getElementById("filter-pet").checked;
    var oth = document.getElementById("filter-other").checked;

    var allowClosed = document.getElementById("filter-closed").checked;

    var allowedUrgency = [""];
    if(low) allowedUrgency.push("low");
    if(medium) allowedUrgency.push("medium");
    if(high) allowedUrgency.push("high");

    var allowedCategory = [""];
    if(phy) allowedCategory.push("physical");
    if(tec) allowedCategory.push("technical");
    if(inf) allowedCategory.push("informative");
    if(sup) allowedCategory.push("supplies");
    if(pet) allowedCategory.push("pet-related");
    if(oth) allowedCategory.push("other");

    hideMenu()
    filterResults(allowedUrgency,allowedCategory, allowClosed);
}

function displayMenu() {
    document.getElementById("filterMenu").style.display = "flex";
    document.querySelector(".open-button").setAttribute("onClick","hideMenu()");
}
  
  function hideMenu() {
    document.getElementById("filterMenu").style.display = "none";
    document.querySelector(".open-button").setAttribute("onClick","displayMenu()");
}

const isVisible = elem => !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );

let apply = document.getElementById('applyFilter');
apply.addEventListener('click',processFilters);

let revert = document.getElementById('revertFilter');
revert.addEventListener('click',revertFilters);

/*
TODO
When you click "Apply Filter", run filterResults with the selected filters
When you click "Revert Filter", run filterResults with empty arrays.

Styling for the filter menu (oh no)
*/