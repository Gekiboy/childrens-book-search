const form = document.querySelector("#search-form");
const searchEl = document.querySelector("#search");
const checkboxEls = document.querySelectorAll("#sites input");
const resetButton = document.querySelector("#reset");

const stateKeyForSearch = "search";

const search = () => {
  const sites = [];
  checkboxEls.forEach((el) => {
    if (el.checked) {
      sites.push(`site:${el.value}`);
    }
  });

  if (sites.length === 0 || searchEl.value === "") {
    return false;
  }

  query = `${searchEl.value} (${sites.join(" OR ")})`;
  url = `https://www.google.com/search?q=${encodeURI(query)}`;
  chrome.tabs.create({ url: url });
  return false;
};

const initializeSearchState = () => {
  chrome.storage.local.get([stateKeyForSearch], function (state) {
    value = state[stateKeyForSearch];
    if (value !== undefined) {
      searchEl.value = value;
    }
  });
};

const storeSearchValue = () => {
  const state = {};
  state[stateKeyForSearch] = searchEl.value;
  chrome.storage.local.set(state);
};

const stateKeyFromCheckbox = (el) => `checkbox-${el.id}`;

const initializeCheckboxState = (el) => {
  chrome.storage.local.get([stateKeyFromCheckbox(el)], function (state) {
    value = state[stateKeyFromCheckbox(el)];
    if (value !== undefined) {
      el.checked = value;
    }
  });
};

const storeStateOnCheckbox = (el) => {
  const state = {};
  state[stateKeyFromCheckbox(el)] = el.checked;
  chrome.storage.local.set(state);
};

const reset = () => {
  searchEl.value = "";
  storeSearchValue();
  checkboxEls.forEach((el) => {
    el.checked = true;
    storeStateOnCheckbox(el);
  });
};

// Initialize

form.onsubmit = search;

initializeSearchState();
searchEl.onchange = storeSearchValue;

checkboxEls.forEach((el) => {
  initializeCheckboxState(el);
  el.onchange = () => {
    storeStateOnCheckbox(el);
  };
});

resetButton.onclick = reset;
