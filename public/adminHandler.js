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
const productSkuField = document.getElementById("model-sku");
const productUrlField = document.getElementById("user-guide-url");
const productAccessoriesField = document.getElementById("accessories-textarea");

//Form model
const formModel = document.getElementById("add-data-form-model");
const closeFormModel = document.getElementById("close-form-model-button");
const submitAdminForm = document.getElementById("submit-admin-form");

//Data table variables & functions
const table = document.getElementById("data-table");
const tableBody = document.createElement("tbody");

async function fillDataTable() {
    try{

        //Fetch data from the database
        const response = await fetch(`/search/all`);
        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "Failed to fetch data");
        }

        //Iterate through the keys and values to fill the data table
        Object.keys(data).forEach(modelNumber => {
            const item = data[modelNumber];
            const row = document.createElement("tr");
            
            //Model number cell
            const modelNumberCell = document.createElement("td");
            modelNumberCell.textContent = modelNumber;
            row.appendChild(modelNumberCell);

            //SKU cell
            const modelSkuCell = document.createElement("td");
            modelSkuCell.textContent = item.sku;
            row.appendChild(modelSkuCell);

            //Model name cell
            const modelNameCell = document.createElement("td");
            modelNameCell.textContent = item.modelName;
            row.appendChild(modelNameCell);

            //Model accessories cell
            const modelAccessories = document.createElement("td");
            modelAccessories.textContent = item.accessories;
            row.appendChild(modelAccessories);

            //Model url cell
            const modelUrl = document.createElement("td");
            const link = document.createElement("a");
            link.href = item.url;
            link.textContent = "Manual";
            link.target = "_blank";
            modelUrl.appendChild(link);
            row.appendChild(modelUrl);

            tableBody.appendChild(row);  //Append rows to the table body
        });

        //Append table body to the table
        table.appendChild(tableBody);

    }catch(error){
        window.alert("Error loading data: ", error);
    }
};

fillDataTable();


//Find button functionality
findButton.addEventListener('click', async function (){

    const userInput = getUserInput();
    if(userInput === '') return window.alert("The model number is required to search inside the database");

    try{
        const response = await fetch(`/search?model=${getUserInput()}`);
        const data = await response.json();

        tableBody.innerHTML = "";
        const row = document.createElement("tr");

        const modelNumberCell = document.createElement("td");
        modelNumberCell.textContent = userInput;
        row.appendChild(modelNumberCell);

        const modelSkuCell = document.createElement("td");
        modelSkuCell.textContent = data.sku;
        row.appendChild(modelSkuCell);

        const modelNameCell = document.createElement("td");
        modelNameCell.textContent = data.modelName;
        row.appendChild(modelNameCell);

        const modelAccessories = document.createElement("td");
        modelAccessories.textContent = data.accessories.join(", ");
        row.appendChild(modelAccessories);

        const modelUrl = document.createElement("td");
        const link = document.createElement("a");
        link.href = data.url;
        link.target = "_blank";
        link.textContent = "Manual";
        modelUrl.appendChild(link);
        row.appendChild(modelUrl);

        tableBody.appendChild(row);
        table.appendChild(tableBody);

    }catch(error){
        window.alert("An error has occurred during the process", error);
    }
});

resetButton.addEventListener('click', function(){
    //Reset the entire table
    tableBody.innerHTML = "";
    fillDataTable();

    //Reset the input field value
    document.getElementById("find-element-input").value = "";
});

addButton.addEventListener('click', function(){
    formModel.style.display = "flex";
});

closeFormModel.addEventListener('click', function(){
    productNameField.value = "";
    productModelNumberField.value = "";
    productSkuField.value = "";
    productUrlField.value = "";
    productAccessoriesField.value = ""
    formModel.style.display = "none";
});

//Export stored data as an excel file when the export button is clicked
exportCsvButton.addEventListener("click", async function(){
    let formattedData = [];

    try{
        const response = await fetch(`/search/all`);
        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "Failed to fetch data");
        }

        formattedData = Object.keys(data).map(item => ({
            "Model Number": item,
            "SKU": data[item].sku,
            "Model Name": data[item].modelName || "N/A",
            "Accessories": data[item].accessories,
            "URL": {t: "s", v: "Link", l: {Target: data[item].url, Tooltip: "Click to open"}}
        }));

    }catch(error){
        window.alert("An error occurred during the process of fetching data from the database: ", error.message);
        return;
    }

    if(formattedData.length === 0){
        window.alert("No data available to export");
        return;
    }

    const workSheet = XLSX.utils.json_to_sheet(formattedData);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, "Model Data");
    XLSX.writeFile(workBook, "Model_Data.xlsx");
    console.log("File has been created successfully");
});

modifyButton.addEventListener("click", async function(){
    const userInput = getUserInput();
    
    if(userInput === '') return window.alert("The model is required to modify the database");
    
    try{
        const response = await fetch(`/search?model=${userInput}`);
        const data = await response.json();

        productNameField.value = data.modelName;
        productModelNumberField.value = userInput;
        productUrlField.value = data.url;
        productAccessoriesField.value = data.accessories.join(", ");
        productSkuField.value = data.sku;

        formModel.style.display = "flex";
    }catch(error){
        window.alert("An error occurred during the process: ", error.message);
    }

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

submitAdminForm.addEventListener("click", async function(e){
    e.preventDefault();  //Prevent default submission of the form

    const productName = productNameField.value.trim();
    const productModelNumber = productModelNumberField.value.trim();
    const productSku = productSkuField.value.trim();
    const productAccessories = productAccessoriesField.value.trim();
    const productUrl = productUrlField.value.trim();
    
    if(productName && productSku && productModelNumber && productAccessories && productUrl){

        try{
            const response = await fetch("/search/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    modelNumber: productModelNumber,
                    modelName: productName,
                    sku: productSku,
                    accessories: productAccessories,
                    url: productUrl
                })
            });
    
            const data = await response.json();
    
            if(response.ok){
                window.alert("Model added successfully to the database");
            }else{
                window.alert("Error: " + data.error);
            }

        }catch(error){
            console.error("Error sending request: ", error);
            window.alert("An unexpected error occurred");
        }

    }
    else{
        alert("All form values are required to submit the request");
    }
});