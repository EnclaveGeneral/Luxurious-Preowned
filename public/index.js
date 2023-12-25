/*
 * Name: Caroline Dong, Richard Zhang
 * Date: November 5, 2023
 * Section: CSE 154 AD/AE, Marina Wooden
 * Section: AG, Allison Ho/Kevin Wu
 *
 * This is the index.js page for our Final Project. It implements the features available to users,
 * including viewing, searching for, filtering, buying, and selling cars.
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  let userID = undefined;
  let carID = undefined;
  let animToggled = true;
  let compToggled = false;
  const WAIT = 1500;

  /**
   * Sets up event listeners for book covers and buttons.
   */
  function init() {
    let prevLog = JSON.parse(window.localStorage.getItem('prevLog'));
    if (prevLog) {
      userID = prevLog;
      toggleLoginBtns();
    }
    let anim = JSON.parse(window.localStorage.getItem('anim'));
    if (anim) {
      if (anim.anim.includes(userID)) {
        qs('h1').classList.remove('h1-anim');
        id('filter').classList.remove('filter-anim');
        animToggled = false;
      }
    } else {
      window.localStorage.setItem('anim', JSON.stringify({'anim': []}));
    }
    id('toggle-anim').addEventListener('click', (evt) => {
      evt.preventDefault();
      toggleAnim(anim);
    });
    let comp = JSON.parse(window.localStorage.getItem('comp'));
    if (comp) {
      if (comp.comp.includes(userID)) {
        compToggled = true;
      }
    } else {
      window.localStorage.setItem('comp', JSON.stringify({'comp': []}));
    }
    setupSite(comp);
  }

  /**
   * Sets up the site by showing the home page and activating buttons.
   * @param {boolean} comp - Whether compact view has been toggled on or off.
   */
  function setupSite(comp) {
    showHome();
    modalFunctions();
    setupButtons(comp);
  }

  /**
   * Sets up buttons that the user can click or submit.
   * @param {boolean} comp - Whether compact view has been toggled on or off.
   */
  function setupButtons(comp) {
    id('toggle-compact').addEventListener('click', (evt) => {
      evt.preventDefault();
      toggleCompact(comp);
    });
    qs('h1').addEventListener('click', showHome);
    id('sell-form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      sellCar();
    });
    qs('#search-bar form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      searchBy();
    });
    id('filter').addEventListener('submit', (evt) => {
      evt.preventDefault();
      filterCars();
    });
    id('account-btn').addEventListener('click', showAccount);
    id("sign-in-btn").addEventListener("click", function() {
      let loginForm = id('login-form');
      toggleForm(loginForm);
    });
    id("register-btn").addEventListener("click", function() {
      let regForm = id('register-form');
      toggleForm(regForm);
    });
    id("sign-out-btn").addEventListener("click", attemptSignOut);
    qs('#carpage button').addEventListener('click', checkCar);
  }

  /**
   * Toggles animations.
   * @param {JSON} anim - Which user IDs have animations toggled off.
   */
  function toggleAnim(anim) {
    if (anim.anim.includes(userID)) {
      activateModal('Confirmation', 'Animations have been toggled on.');
      anim.anim.splice(anim.anim.indexOf(userID), 1);
      qs('h1').classList.add('h1-anim');
      id('filter').classList.add('filter-anim');
      animToggled = true;
    } else {
      activateModal('Confirmation', 'Animations have been toggled off.');
      anim.anim.push(userID);
      qs('h1').classList.remove('h1-anim');
      id('filter').classList.remove('filter-anim');
      animToggled = false;
    }
    window.localStorage.setItem('anim', JSON.stringify(anim));
  }

  /**
   * Toggles compact view for cars.
   * @param {JSON} comp - Which user IDs have compact view toggled on.
   */
  function toggleCompact(comp) {
    if (comp.comp.includes(userID)) {
      activateModal('Confirmation', 'Compact view has been toggled off.');
      comp.comp.splice(comp.comp.indexOf(userID), 1);
      compToggled = false;
    } else {
      activateModal('Confirmation', 'Compact view has been toggled on.');
      comp.comp.push(userID);
      compToggled = true;
    }
    window.localStorage.setItem('comp', JSON.stringify(comp));
  }

  /**
   * Toggles login, register, and sign-out buttons depending on if they're already shown.
   */
  function toggleLoginBtns() {
    if (id('sign-in-btn').classList.contains('hidden')) {
      id("sign-in-btn").classList.remove("hidden");
      id("register-btn").classList.remove("hidden");
      id("sign-out-btn").classList.add("hidden");
    } else {
      id("sign-in-btn").classList.add("hidden");
      id("register-btn").classList.add("hidden");
      id("sign-out-btn").classList.remove("hidden");
    }
  }

  /**
   * Activates pop-up box.
   * @param {string} title - Title of box.
   * @param {string} msg - Message of box.
   */
  function activateModal(title, msg) {
    let modal = id("popup");
    let modalTitle = qs("#popup h3");
    let modalText = qs("#popup p");
    modalTitle.textContent = title;
    modalText.textContent = msg;
    if (modal.classList.contains("hidden")) {
      modal.classList.remove("hidden");
    }
  }

  /**
   * Allows pop-up box to be closed.
   */
  function modalFunctions() {
    let modal = id("popup");
    modal.classList.add("hidden");
    let closeModalBtn = id("modal-btn");
    let closeModalIcon = qs("#popup span");
    closeModalIcon.addEventListener("click", closeModal);
    closeModalBtn.addEventListener("click", closeModal);
  }

  /**
   * Hides pop-up box.
   */
  function closeModal() {
    let modal = id("popup");
    modal.classList.add("hidden");
  }

  /**
   * Attempts to sign out.
   */
  function attemptSignOut() {
    if (userID !== undefined) {
      activateModal("Success", "You have now signed out!");
      animToggled = true;
      compToggled = false;
      toggleLoginBtns();
      userID = undefined;
      window.localStorage.removeItem('prevLog');
      showHome();
    }
  }

  /**
   * Hides every toggleable item on the page.
   */
  function hideAll() {
    id("login-form").classList.add("hidden");
    id("register-form").classList.add("hidden");
    id("cur-user").classList.add("hidden");
    id('sell-form').classList.add('hidden');
    id('search-bar').classList.add('hidden');
    id('filter').classList.add('hidden');
    id('display').classList.add('hidden');
    id('userpage').classList.add('hidden');
    id('trxpage').classList.add('hidden');
    qs('#userpage section').classList.add('hidden');
    id('carpage').classList.add('hidden');
  }

  /**
   * Toggles the login or register form.
   * @param {Object} currentForm - The form that is being toggled.
   */
  function toggleForm(currentForm) {
    if (currentForm.id === "login-form") {
      prepareLogin(currentForm, 'register-form');
    } else {
      prepareLogin(currentForm, 'login-form');
    }
  }

  /**
   * Toggles the given form. If the sell form is visible, replaces it.
   * @param {Object} currForm - The form that is being toggled.
   * @param {string} hide - The ID of the form that should be hidden. If the register form is
   * being toggled, the login form is being hidden.
   */
  function prepareLogin(currForm, hide) {
    let sellForm = id("sell-form");
    if (!id(hide).classList.contains("hidden")) {
      id(hide).classList.add("hidden");
    }
    if (currForm.classList.contains("hidden")) {
      currForm.classList.remove("hidden");
      sellForm.classList.add("hidden");
      currForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        if (hide === 'register-form') {
          attemptLogin();
        } else {
          attemptRegister();
        }
      });
    } else {
      currForm.classList.add("hidden");
      if (!id('filter').classList.contains('hidden')) {
        sellForm.classList.remove("hidden");
      }
    }
  }

  /**
   * Uses the user's given username and password to attempt to login.
   */
  function attemptLogin() {
    id("login-status").textContent = "";
    let username = id("username").value;
    let data = new FormData(id('login-form'));
    fetch("/login", {method: "post", body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(res => {loginResult(res, username);})
      .catch(handleError);
  }

  /**
   * Uses the user's given username and password to attempt to register a new user.
   */
  function attemptRegister() {
    id("register-status").textContent = "";
    let data = new FormData(id('register-form'));
    fetch("/register", {method: "post", body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(registerResult)
      .catch(handleError);
  }

  /**
   * Depending on the result of the login attempt, either logs the user in or doesn't.
   * @param {string} res - Result of the login attempt.
   * @param {string} username - Username of login attempt.
   */
  function loginResult(res, username) {
    let loginStatus = id("login-status");
    id("username").value = "";
    id("password").value = "";
    if (res === "Failure") {
      loginStatus.textContent = "Incorrect Username/Password or User does not exists";
    } else {
      loginStatus.textContent = "Login Successful!";
      userID = res;
      setTimeout(() => {
        loginStatus.textContent = "";
        loggedIn(res, username);
        window.localStorage.setItem('prevLog', userID);
        if (id('filter').classList.contains('hidden')) {
          id('login-form').classList.add('hidden');
        }
      }, WAIT);
    }
  }

  /**
   * Depending on the result of the registration attempt, notifies the user.
   * @param {string} res - Result of the registration attempt.
   */
  function registerResult(res) {
    let registerStatus = id("register-status");
    if (res === "Username already exists") {
      registerStatus.textContent = "Username already exists, please pick a new one";
    } else {
      registerStatus.textContent = "Registration Successful!";
      setTimeout(() => {
        registerStatus.textContent = "";
        toggleForm(id("register-form"));
        if (id('filter').classList.contains('hidden')) {
          id('register-form').classList.add('hidden');
        }
      }, WAIT);
    }
  }

  /**
   * When login is successful, hides the login and registration buttons, hides the form, and
   * welcomes the user.
   * @param {string} res - Result of the login attempt.
   * @param {string} username - Username of login attempt.
   */
  function loggedIn(res, username) {
    id("sign-in-btn").classList.remove("hidden");
    toggleLoginBtns();
    id("login-form").classList.add("hidden");
    id("sell-form").classList.remove("hidden");
    let curUser = id("cur-user");
    curUser.classList.remove("hidden");
    curUser.textContent = "Welcome: " + username;
  }

  /**
   * Shows the home page and hides everything else. Generates the home page.
   */
  function showHome() {
    hideAll();
    id('sell-form').classList.remove('hidden');
    id('search-bar').classList.remove('hidden');
    id('filter').classList.remove('hidden');
    id('display').classList.remove('hidden');
    fetch('/cars')
      .then(statusCheck)
      .then(res => res.json())
      .then(genCars)
      .catch(handleError);
  }

  /**
   * Removes all displayed cars and generates cars based on the search term.
   * @param {Promise} res - Cars with names that match the search term.
   */
  function genCars(res) {
    id('display').innerHTML = '';
    for (let i = 0; i < res.cars.length; i++) {
      id('display').appendChild(genCar(res.cars[i]));
    }
  }

  /**
   * Shows a pop-up to make sure the user wants to buy the given car.
   */
  function checkCar() {
    if (!userID) {
      activateModal("Error", "You cannot buy cars without logging in!");
    } else {
      carID = this.id;
      let modalBtn = id("modal-btn");
      let closeModalIcon = qs("#popup span");
      closeModalIcon.removeEventListener("click", closeModal);
      modalBtn.removeEventListener("click", closeModal);
      modalBtn.addEventListener("click", buyCar);
      closeModalIcon.addEventListener("click", resetModal);
      activateModal("Attention", "Confirm to purchase this vehicle?");
    }
  }

  /**
   * Changes pop-up from purchase confirmation to normal pop-up.
   */
  function resetModal() {
    let modalBtn = id("modal-btn");
    let closeModalIcon = qs("#popup span");
    modalBtn.removeEventListener("click", buyCar);
    closeModalIcon.removeEventListener("click", resetModal);
    modalBtn.addEventListener("click", closeModal);
    closeModalIcon.addEventListener("click", closeModal);
  }

  /**
   * Buys a car.
   */
  function buyCar() {
    resetModal();
    let params = new FormData();
    params.append('buyer', userID);
    params.append('car', carID);
    fetch('/buy', {method: 'POST', body: params})
      .then(statusCheck)
      .then(res => res.text())
      .then((res) => {
        activateModal("Confirmation", res);
        showHome();
      })
      .catch(handleError);
  }

  /**
   * Sells a car.
   */
  function sellCar() {
    if (userID === undefined) {
      id('sell-form').reset();
      activateModal('Error', 'No user currently detected, please login first!');
    } else {
      let params = new FormData(id('sell-form'));
      params.append('seller', userID);
      fetch('/sell', {method: 'POST', body: params})
        .then(statusCheck)
        .then(res => res.text())
        .then((res) => {
          let inputs = id('sell-form').children;
          for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = '';
          }
          activateModal('Confirmation', res);
          showHome();
        })
        .catch(handleError);
    }
  }

  /**
   * Shows the page for a specific car.
   */
  function showCar() {
    fetch('/car/' + this.id)
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        changeCar(res);
        let texts = qsa('#carpage p');
        let fuel = res.fuel;
        if (fuel === 'gas') {
          fuel = 'Gasoline';
        } else {
          fuel = fuel.charAt(0).toUpperCase() + fuel.slice(1);
        }
        texts[0].textContent = 'Date Made: ' + res.datemade + ', Fuel type: ' + fuel +
          ', Car type: ' + res.type.charAt(0).toUpperCase() + res.type.slice(1);
        texts[1].textContent = 'For Sale: ' + res.selling.charAt(0).toUpperCase() +
          res.selling.slice(1);
        texts[2].textContent = 'Vehicle Description: ' + res.descr;
        let purchase = qs('#carpage button');
        if (res.selling === 'yes') {
          purchase.classList.remove('hidden');
        } else {
          purchase.classList.add('hidden');
        }
        purchase.id = res.id;
      })
      .catch(handleError);
  }

  /**
   * Changes the car page to show the given car information.
   * @param {Promise} res - Car information.
   */
  function changeCar(res) {
    hideAll();
    id('carpage').classList.remove('hidden');
    qs('#carpage h1').textContent = res.name;
    qs('#carpage h2').textContent = "Seller: " + res.username;
    qs('#carpage h2').id = res.userid;
    qs('#carpage h2').addEventListener('click', () => {
      showUser(res.userid);
    });
    qs('#carpage img').src = res.img;
    qs('#carpage img').alt = res.name + ' image';
  }

  /**
   * Shows the account of the current user if logged in.
   */
  function showAccount() {
    if (userID === undefined) {
      activateModal('Error', 'You are not logged in!');
    } else {
      showUser(userID);
    }
  }

  /**
   * Shows the page for a specific user.
   * @param {number} currUser - ID of the current user. If null, the user being viewed is not the
   * user currently logged in.
   */
  function showUser(currUser) {
    let checkId = setupUser(currUser, this);
    fetch('/user/' + checkId)
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        hideAll();
        id('display').classList.remove('hidden');
        id('userpage').classList.remove('hidden');
        qs('#userpage h2').textContent = res.name.username + "'s current automobiles on sale:";
        if (userID === checkId) {
          qs('#userpage section').classList.remove('hidden');
          id('trx-btn').addEventListener('click', () => {
            showHistory(checkId);
          });
        } else {
          qs('#userpage section').classList.add('hidden');
        }
        if (res.cars.length === 0) {
          id('display').innerHTML = '';
          let msg = gen('h2');
          msg.textContent = 'This user is not selling any cars.';
          id('display').appendChild(msg);
        } else {
          genCars(res);
        }
      })
      .catch(handleError);
  }

  /**
   * Checks whether the user page is showing the current logged in user or a given user ID.
   * @param {number} currUser - ID for current user.
   * @param {Object} thisUser - Button for given user.
   * @returns {number} - ID of the user that should be shown.
   */
  function setupUser(currUser, thisUser) {
    if (!id("trxpage").classList.contains("hidden")) {
      id("trxpage").classList.add("hidden");
    }
    if (currUser) {
      return currUser;
    }
    return thisUser.id;
  }

  /**
   * Shows the transaction history for the user if they are logged in.
   * @param {number} checkId - ID for user.
   */
  function showHistory(checkId) {
    hideAll();
    id('trxpage').classList.remove('hidden');
    let hist = qs('#trxpage section');
    if (userID === checkId) {
      fetch('/history/' + checkId)
        .then(statusCheck)
        .then(res => res.json())
        .then((res) => {
          hist.innerHTML = '';
          for (let i = 0; i < res.trx.length; i++) {
            hist.appendChild(genTrx(res.trx[i]));
          }
        })
        .catch(handleError);
    } else {
      hist.innerHTML = '';
      let msg = gen('p');
      msg.textContent = "You are not able to view this user's transaction history!";
      hist.appendChild(msg);
    }
  }

  /**
   * Searches for cars based on the user's search term.
   */
  function searchBy() {
    if (!id('search').value.trim()) {
      activateModal('Error', 'Input search term, not just spaces!');
    } else {
      fetch('/cars?search=' + id('search').value.trim())
        .then(statusCheck)
        .then(res => res.json())
        .then(genCars)
        .catch(handleError);
    }
  }

  /**
   * Filters cars based on user's chosen options.
   */
  function filterCars() {
    let min = '';
    let max = '';
    if (id('min-cost').value.trim() !== '') {
      min = '?min=' + id('min-cost').value;
    }
    if (id('max-cost').value.trim() !== '') {
      if (min !== '') {
        max = '&';
      } else {
        max = '?';
      }
      max = max + 'max=' + id('max-cost').value;
    }
    let joiner = '&fuel=';
    if (min === '' && max === '') {
      joiner = '?fuel=';
    }
    fetch('/filter' + min + max + joiner + id('fuel').value + '&type=' + id('type').value)
      .then(statusCheck)
      .then(res => res.json())
      .then(genCars)
      .catch(handleError);
  }

  /**
   * Generates a small box displaying the information for a given transaction.
   * @param {Promise} info - Transaction information.
   * @returns {Object} - The displayed transaction.
   */
  function genTrx(info) {
    let trx = gen('article');
    trx.classList.add('car');
    let trxName = gen('h2');
    trxName.id = info.id;
    trxName.textContent = info.name;
    trxName.addEventListener('click', showCar);
    trx.appendChild(trxName);
    let confNum = gen('p');
    confNum.textContent = 'Transaction #: ' + info.conf;
    trx.appendChild(confNum);
    let heading = gen('p');
    heading.id = info.username;
    heading.addEventListener('click', () => {
      showUser(info.seller);
    });
    heading.textContent = info.username + ', ' + info.date + ', $' + info.price;
    trx.appendChild(heading);
    let img = gen('img');
    img.id = info.id;
    img.addEventListener('click', showCar);
    img.src = info.img;
    img.alt = info.name + ' image';
    trx.appendChild(img);
    return trx;
  }

  /**
   * Generates a small box displaying the information for a given car.
   * @param {Promise} info - Car information.
   * @returns {Object} - The displayed car.
   */
  function genCar(info) {
    let car = gen('article');
    if (animToggled) {
      car.classList.add('car-anim');
    }
    if (compToggled) {
      car.classList.add('comp');
    } else {
      car.classList.add('car');
    }
    car.classList.add(info.fuel);
    car.classList.add(info.type);
    let heading = gen('h2');
    heading.classList.add('car-name');
    heading.id = info.id;
    heading.addEventListener('click', showCar);
    heading.textContent = info.name;
    car.appendChild(heading);
    let user = gen('p');
    user.id = info.userid;
    user.textContent = info.username;
    user.addEventListener('click', () => {
      showUser(info.userid);
    });
    car.appendChild(user);
    car = makeMoreCar(car, info);
    return car;
  }

  /**
   * Adds image, price, and purchase button to a given generated car.
   * @param {Object} car - Generated car.
   * @param {Promise} info - Car information.
   * @returns {Object} - Updated car.
   */
  function makeMoreCar(car, info) {
    if (!compToggled) {
      let img = gen('img');
      img.id = info.id;
      img.addEventListener('click', showCar);
      img.src = info.img;
      img.alt = info.name + ' image';
      car.appendChild(img);
    }
    let price = gen('p');
    price.textContent = 'Price: $' + info.price;
    car.appendChild(price);
    if (!compToggled) {
      let purchase = gen('button');
      purchase.id = info.id;
      purchase.textContent = 'Purchase';
      purchase.addEventListener('click', checkCar);
      car.appendChild(purchase);
    }
    return car;
  }

  /**
   * Shows an error message.
   * @param {Promise} res - Given error message.
   */
  function handleError(res) {
    activateModal("Error", res);
  }

  /**
   * Checks the status of the fetch request.
   * @param {Promise} res - Given Promise.
   * @returns {Promise} Given Promise.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns the array of elements that match the given CSS selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} array of DOM objects matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
}
)();