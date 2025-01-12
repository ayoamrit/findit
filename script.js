const urlGithub = "https://github.com/ayoamrit/findit";
const accessorySection = document.getElementById("accessories-section");
const searchButton = document.getElementById("search-button");

const modelManualUrls = [
  {
    model: "UN50DU7100F",
    url: "https://downloadcenter.samsung.com/content/EM/202405/20240522035651001/BN68-19257A-01_IG_DU7000%20Flat%20feet%2043-70inch_WW_L10_240513.0.pdf",
  },
  {
    model: "KD-50X77L",
    url: "https://www.sony.com/electronics/support/res/manuals/5049/fe7792c86c4f8c581dac30f540b95e81/50499611M.pdf",
  },
];


function redirectGithub() {
  window.open(urlGithub, "_blank");
}

function redirectManual(searchTxt) {
    modelManualUrls.forEach((modelManualObj) => {
    if (modelManualObj.model.includes(searchTxt)) {
      window.open(modelManualObj.url, "_blank");
    }
  });
}
