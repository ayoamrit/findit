//Accessory Section
const accessorySection = document.getElementById("accessories-section");
const accessoryHeading = document.getElementById("accessories-heading");
const accessoryList = document.getElementById("accessories-list");
const accessoryManualLink = document.getElementById("accessories-section-link");
const accessorySectionCloseButton = document.getElementById("accessories-close-button");
let currentManualUrl = "";

//Search Section
const searchButton = document.getElementById("search-button");
const suggestionsBox = document.getElementById("autocomplete-suggestions");
let searchBarElem = document.getElementById("search-bar-field");

//Trending Element
const trendingSearchElement = document.querySelectorAll(".trending-search-element");


let suggestionModelNumbers = [];
async function fetchModelNumbers() {
  try{
    const response = await fetch("/search/all");

    if(!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json()

    if(data && typeof data === "object"){
      suggestionModelNumbers = Object.keys(data);
    }
    else{
      throw new Error("Invalid data format received");
    }
  }catch(error){
    window.alert("Error loading model numbers for the search bar"+error);
  }
}
fetchModelNumbers();
console.log(suggestionModelNumbers);

// Function to filter suggestions and display them
function showSuggestions(value) {
  suggestionsBox.innerHTML = ""; // Clear previous suggestions
  if (value.trim() === "") return; // Exit if input is empty

  const filteredSuggestions = suggestionModelNumbers.filter((item) =>
    item.toLowerCase().includes(value.toLowerCase())
  );

  filteredSuggestions.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = item;
    div.addEventListener("click", () => {
      searchBarElem.value = item; // Set input value to the clicked suggestion
      suggestionsBox.innerHTML = ""; // Clear suggestions
    });
    suggestionsBox.appendChild(div);
  });
}

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.autocomplete')) {
    suggestionsBox.innerHTML = '';
  }
});

// Event listener for input
searchBarElem.addEventListener("input", () =>
  showSuggestions(searchBarElem.value)
);


searchButton.addEventListener("click", async () => {
  const getUserInput = document.getElementById("search-bar-field").value.trim();

  if(isEmpty(getUserInput) == false){
    try{
      const response = await fetch(`/search?model=${getUserInput}`);
      const data = await response.json();

      //Check whether the response is valid or not
      if(!response.ok){
        throw new Error(data.error || "Unknown error occurred");
      }

      updateAccessorySection(
        data.modelName,
        data.sku,
        data.accessories,
        data.url
      );

      accessorySection.style.display = "block";
    }catch(error){
      window.alert("Error fetching data: "+ error.message);
    }
  }
  else{
    window.alert("The model number is required to search");
  }

});


//function to check whether the input field is empty or not
function isEmpty(modelNumber) {
  return modelNumber === "";
}


function updateAccessorySection(modelName, modelSku, accessories, manualUrl) {
  //update the heading
  accessoryHeading.textContent = `${modelName} | BestBuy SKU: ${modelSku}`;

  //Clear the list to avoid duplicates
  accessoryList.innerHTML = "";
  accessories.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    accessoryList.appendChild(li);
  });

  //Update the current manual url
  currentManualUrl = manualUrl;
}


//Open the link in the new window when "Quick User Guide" is clicked
accessoryManualLink.addEventListener("click", function () {
  window.open(currentManualUrl, "_blank");
});

accessorySectionCloseButton.addEventListener("click", function () {
  accessorySection.style.display = "none";
});

//Trending Search Elements
trendingSearchElement.forEach(element => {
  element.addEventListener('click', function(){
    let trendingContent = this.textContent;

    //Insert the value of selected trending search element to the search-bar-field
    searchBarElem.value = trendingContent;
  })
});