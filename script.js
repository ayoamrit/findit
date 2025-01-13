const urlGithub = "https://github.com/ayoamrit/findit";
const accessorySection = document.getElementById("accessories-section");
const accessoryHeading = document.getElementById("accessories-section-heading");
const accessoryList = document.getElementById("accessories-list");
const accessoryManualLink = document.getElementById("accessories-section-link");
let currentManualUrl = "";
const searchButton = document.getElementById("search-button");


function redirectGithub() {
  window.open(urlGithub, "_blank");
}

searchButton.addEventListener("click", function(){
  const getModelNumberInput = document.getElementById("search-bar-field").value.trim();

  if(isEmpty(getModelNumberInput) == false){
    if(isModelExist(getModelNumberInput) == true){

      const selectedModelDetails = getModelDetails(getModelNumberInput);
      updateAccessorySection(getModelNumberInput, selectedModelDetails.accessories, selectedModelDetails.url);
      accessorySection.style.display = "block";
    }
    else{
      alert(getModelNumberInput+": The model number does not exist in the database. Please request an update by contacting.");
    }
  }
  else{
    alert("The model number is required to search.");
  }
});


//function to check whether the input field is empty or not
function isEmpty(modelNumber){
  return modelNumber === "";
}
//function to check whether the model number exist in the database or not
function isModelExist(modelNumber){
  return modelManualUrls.some(item => item.modelNumber == modelNumber);
}

//function to get details of the selected model number
function getModelDetails(modelNumber){
  const model = modelManualUrls.find(item => item.modelNumber == modelNumber);

  return{
    accessories: model.accessories,
    url: model.url
  };
}

function updateAccessorySection(modelNumber, accessories, manualUrl){
  //update the heading
  accessoryHeading.textContent = modelNumber;

  //Clear the list to avoid duplicates
  accessoryList.innerHTML = "";
  accessories.forEach(item =>{
    const li = document.createElement("li");
    li.textContent = item;
    accessoryList.appendChild(li);
  });

  //Update the current manual url
  currentManualUrl = manualUrl;
}

//Open the link in the new window when "Quick User Guide" is clicked
accessoryManualLink.addEventListener("click", function(){
  window.open(currentManualUrl, "_blank");
});

