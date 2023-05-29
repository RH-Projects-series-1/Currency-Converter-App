const dropList = $("form select"),
  input = $("body form input"),
  fromCurrency = $(".from select"),
  toCurrency = $(".to select"),
  btn = $("form button"),
  output = $("form .exchange-rate"),
  exchangeIcon = $("form .icon");

for (let i = 0; i < 2; i++) {
  for (let currency_code in countryList) {
    let selected =
      i == 0
        ? currency_code == "USD"
          ? "selected"
          : ""
        : currency_code == "LKR"
        ? "selected"
        : "";
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    $(dropList[i]).append(optionTag);
  }
  $(dropList[i]).on("change", (eventData) => {
    loadFlag($(eventData.target).find(":selected"));
  });
}
function loadFlag(element) {
  for (let code in countryList) {
    if (code == element.text()) {
      let imgTag = element.parent().parent().find("img");
      imgTag[0].src = `https://flagcdn.com/48x36/${countryList[code].toLowerCase()}.png `;
    }
  }
}

$(window).on("load", () => {
  getExchangeRate();
});

btn.on("click", (eventData) => {
  eventData.preventDefault();
  getExchangeRate();
});

function getExchangeRate() {
  let inputValue = input.value;
  if (inputValue == "" || inputValue == "0") {
    input.value = "1";
    inputValue = 1;
  }
  let url = `https://v6.exchangerate-api.com/v6/2921378874a53d656512701f/latest/${fromCurrency
    .find(":selected")
    .text()}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate =
        result.conversion_rates[toCurrency.find(":selected").text()];
      let totalExRate = input.val() * exchangeRate;
      totalExRate = new Intl.NumberFormat({
        style: "currency",
        minimumFractionDigits: 2,
      }).format(totalExRate);
      output.text(
        `${input.val()} ${fromCurrency
          .find(":selected")
          .text()} = ${totalExRate} ${toCurrency.find(":selected").text()}`
      );
    })
    .catch(() => {
      output.text("Something went wrong");
    });
}

exchangeIcon.on("click", () => {
  let tempCode = fromCurrency.find(":selected").text();
  fromCurrency.find(":selected").text(toCurrency.find(":selected").text());
  toCurrency.find(":selected").text(tempCode);
  loadFlag(fromCurrency.find(":selected"));
  loadFlag(toCurrency.find(":selected"));
  getExchangeRate();
});
