//Essential buttons
const addButton = document.getElementById("add-table-button");
const removeButton = document.getElementById("remove-table-button");
const findButton = document.getElementById("find-table-button");
const resetButton = document.getElementById("reset-table-button");

//Form model
const formModel = document.getElementById("add-data-form-model");
const closeFormModel = document.getElementById("close-form-model-button");

//Data table variables & functions
const table = document.getElementById("data-table");
const tableBody = document.createElement("tbody");

function populateTable(){
    modelManualUrls.forEach(item => {
        const row = document.createElement("tr");
    
        const modelNumberCell = document.createElement("td");
        modelNumberCell.textContent = item.modelNumber;
        row.appendChild(modelNumberCell);
    
        const nameCell = document.createElement("td");
        nameCell.textContent = item.modelName;
        row.appendChild(nameCell);
    
        const accessoryCell = document.createElement("td");
        accessoryCell.textContent = item.accessories.join(", ");
        row.appendChild(accessoryCell);
    
        const linkCell = document.createElement("td");
        const link = document.createElement("a");
        link.href = item.url;
        link.textContent = "Manual";
        link.target = "_blank";
        linkCell.appendChild(link);
        row.appendChild(linkCell);
    
        tableBody.appendChild(row);
    })
    
    table.appendChild(tableBody);
}

populateTable();  //Run the function to populate the data-table


//Find button functionality
findButton.addEventListener('click', function (){
    const userInput = document.getElementById("find-element-input").value.trim();

    //Find the searched item by the user in the database
    const searchedItem = modelManualUrls.find(item => item.modelNumber == userInput);

    if(searchedItem){
        tableBody.innerHTML = "";
        const row = document.createElement("tr");

        const modelNumberCell = document.createElement("td");
        modelNumberCell.textContent = searchedItem.modelNumber;
        row.appendChild(modelNumberCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = searchedItem.modelName;
        row.appendChild(nameCell);

        const accessoryCell = document.createElement("td");
        accessoryCell.textContent = searchedItem.accessories.join(", ");
        row.appendChild(accessoryCell);

        const linkCell = document.createElement("td");
        const link = document.createElement("a");
        link.href = searchedItem.url;
        link.textContent = "Manual";
        link.target = "_blank";
        linkCell.appendChild(link);
        row.appendChild(linkCell);

        tableBody.appendChild(row);
        table.appendChild(tableBody);
    }
    else{
        alert("The value that you are searching for does not exist in the database.");
    }
});

resetButton.addEventListener('click', function(){
    //Reset the entire table
    tableBody.innerHTML = "";
    populateTable();

    //Reset the input field value
    document.getElementById("find-element-input").value = "";
});

addButton.addEventListener('click', function(){
    formModel.style.display = "flex";
});
closeFormModel.addEventListener('click', function(){
    formModel.style.display = "none";
});