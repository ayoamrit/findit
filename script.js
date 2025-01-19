const accessorySection = document.getElementById("accessories-section");
const accessoryHeading = document.getElementById("accessories-heading");
const accessoryList = document.getElementById("accessories-list");
const accessoryManualLink = document.getElementById("accessories-section-link");
let currentManualUrl = "";
const searchButton = document.getElementById("search-button");
const accessorySectionCloseButton = document.getElementById("accessories-close-button");
const suggestionsBox = document.getElementById("autocomplete-suggestions");
let searchBarElem = document.getElementById("search-bar-field");


// Function to filter suggestions and display them
function showSuggestions(value) {
  const suggestions = modelManualUrls.map((modelObj) => modelObj.modelNumber);
  console.log("suggestions>>>", suggestions);
  suggestionsBox.innerHTML = ""; // Clear previous suggestions
  if (value.trim() === "") return; // Exit if input is empty

  const filteredSuggestions = suggestions.filter((item) =>
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

searchButton.addEventListener("click", function () {
  const getUserInput = document.getElementById("search-bar-field").value.trim();

  if (isEmpty(getUserInput) == false) {
    //Get what the user searched ? SKU : ModelNumber
    const userInputType = isModelSearched(getUserInput);

    //Check whether the item exist in the database
    if (isItemExist(getUserInput, userInputType) == true) {
      //Fetch details
      const selectedModelDetails = getModelDetails(getUserInput, userInputType);
      updateAccessorySection(
        getUserInput,
        selectedModelDetails.accessories,
        selectedModelDetails.url
      );
      accessorySection.style.display = "block";
    } else {
      if (userInputType === "sku") {
        alert(
          getUserInput +
            ": The searched SKU does not exist in the database. Please try with the model number or request an update by contacting the team"
        );
      } else {
        alert(
          getUserInput +
            ": The searched model number does not exist in the database. Please try with the SKU or request an update by contacting the team."
        );
      }
    }
  } else {
    alert("The model number or SKU is required to search.");
  }
});

//function to check whether the input field is empty or not
function isEmpty(modelNumber) {
  return modelNumber === "";
}

//function to check whether the user has searched model number or the SKU
function isModelSearched(userInput) {
  //Regular expression to check if the input contains only numbers (SKU)
  const skuRegex = /^\d+$/;

  //Function will return true if the input is an SKU
  return skuRegex.test(userInput) ? "sku" : "modelNumber";
}

//function to check whether the model number exist in the database or not
function isItemExist(userInput, userInputType) {
  return modelManualUrls.some((item) => item[userInputType] == userInput);
}

//function to get details of the selected model number
function getModelDetails(userInput, userInputType) {
  const model = modelManualUrls.find(
    (item) => item[userInputType] == userInput
  );

  return {
    accessories: model.accessories,
    url: model.url,
  };
}

function updateAccessorySection(userInput, accessories, manualUrl) {
  //update the heading
  accessoryHeading.textContent = userInput;

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
