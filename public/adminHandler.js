//Essential buttons
const addButton = document.getElementById("add-table-button");
const removeButton = document.getElementById("remove-table-button");
const findButton = document.getElementById("find-table-button");
const resetButton = document.getElementById("reset-table-button");
const exportCsvButton = document.getElementById("export-csv-button");
const modifyButton = document.getElementById("modify-table-button");

//Form Search Field
const getUserInput = () =>{
    return document.getElementById("find-element-input").value.trim();
}
const productNameField = document.getElementById("product-name");
const productModelNumberField = document.getElementById("model-number");
const productUrlField = document.getElementById("user-guide-url");
const productAccessoriesField = document.getElementById("accessories-textarea");

//Form model
const formModel = document.getElementById("add-data-form-model");
const closeFormModel = document.getElementById("close-form-model-button");
const submitAdminForm = document.getElementById("submit-admin-form");

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
    const userInput = getUserInput();

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
    productNameField.value = "";
    productModelNumberField.value = "";
    productUrlField.value = "";
    productAccessoriesField.value = ""
    formModel.style.display = "none";
});

//Export stored data as an excel file when the export button is clicked
exportCsvButton.addEventListener("click", function(){

    const formattedData = modelManualUrls.map(item => ({
        "Model Number": item.modelNumber,
        "Model Name": item.modelName || "N/A",
        "Accessories": item.accessories.join(", "),
        "URL": {t: "s", v: "Link", l: {Target: item.url, Tooltip: "Click to open"}}
    }));

    const workSheet = XLSX.utils.json_to_sheet(formattedData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Model Data");
    XLSX.writeFile(workBook, "Model_Data.xlsx");
    console.log("File has been created successfully");
});

modifyButton.addEventListener("click", function(){
    const userInput = getUserInput();
    //Check whether the searched item exist in the database or not
    const searchedItem = modelManualUrls.find(item => item.modelNumber == userInput);

    if(searchedItem){
        productNameField.value = searchedItem.modelName || "N/A";
        productModelNumberField.value = searchedItem.modelNumber;
        productUrlField.value = searchedItem.url;
        productAccessoriesField.value = searchedItem.accessories.join(", ");

        formModel.style.display = "flex"; //Display the form
    }else{
        alert(`The value you are searching for does not exist in the database`);
    }
});

submitAdminForm.addEventListener("click", function(e){
    e.preventDefault();  //Prevent default submission of the form
    
    if(productNameField.value !== "" && productModelNumberField.value !== "" && productUrlField.value !== "" && productAccessoriesField.value !== ""){
        // UNDER CONSTRUCTION
    }
    else{
        alert("All form values are required to submit the request");
    }
});