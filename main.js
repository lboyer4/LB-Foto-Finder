//QUERY SELECTORS
var images = JSON.parse(localStorage.getItem('gallery')) || [];
var addBtn = document.querySelector('#add-btn');
var form = document.querySelector('.create-card')
var imageBtn = document.querySelector('.inputfile');
var cardContainer = document.querySelector('.photo-gallery');
var searchBar = document.querySelector('.search-bar');
var showFavorites = document.querySelector('.view-favorites');
var reader = new FileReader();

//EVENT LISTENERS
addBtn.addEventListener('click', loadImg);
form.addEventListener('keyup', disableButton);
cardContainer.addEventListener('focusout', saveContent);
cardContainer.addEventListener('keyup', saveContent)
cardContainer.addEventListener('click', clickHandler);
cardContainer.addEventListener('mouseover', mouseOver);
cardContainer.addEventListener('mouseout', mouseOut);
searchBar.addEventListener('keyup', searchImages);
showFavorites.addEventListener('click', viewFavorites);


//FUNCTIONS
loadPage(images);

function loadPage(oldImages) {
  images = [];
  for (let i = 0; i < oldImages.length; i++) {
  var newImage = new Photo(oldImages[i].title, oldImages[i].image, oldImages[i].caption, oldImages[i].cardId, oldImages[i].favorite);
    images.push(newImage);
    displayCard(newImage);
  }
  var favorites = document.querySelectorAll('.favorite-button');
  for (var i = 0; i < favorites.length; i++) {
    if (JSON.parse(favorites[i].dataset.favorite)) { 
      increaseFavoriteCount();
    }
  }
}

function loadImg(e) {
  e.preventDefault();
  if (imageBtn.files[0]) {
    reader.readAsDataURL(imageBtn.files[0]); 
    reader.onload = createCard;
  }
}

function createCard(e) {
  var title = document.querySelector('.title-input');
  var image = e.target.result; 
  var caption = document.querySelector('.caption-input');
  var newPhoto = new Photo(title.value, image, caption.value, Date.now());
  images.push(newPhoto);
  displayCard(newPhoto);
  clearFields(title, caption);
  addBtn.disabled = true;
  newPhoto.saveToStorage(images);
}

function clearFields(title, caption) {
  title.value = '';
  caption.value = '';
}

function disableButton(e) {
  console.log('test');
  var titleInput = document.querySelector('.title-input').value;
  var captionInput = document.querySelector('.caption-input').value;
  if (titleInput == '' || captionInput == '') {
    addBtn.disabled = true;
  } else {
    addBtn.disabled = false;
  }
}

function displayCard(newPhotoObj) {
  var src = newPhotoObj.favorite ? `Images/favorite-active.svg` : `Images/favorite.svg`
  var text = `<article class="photo-card" data-id="${newPhotoObj.cardId}">
      <h2 class="photo-title" contenteditable="true">${newPhotoObj.title}</h2>
      <img id="photo" class="insert-photo" src=${newPhotoObj.image}>
      <p class="photo-caption" contenteditable="true">${newPhotoObj.caption}</p>
      <div class="trash-love">
        <img src="Images/delete.svg" class="delete-button">
        <img src="${src}" data-favorite="${newPhotoObj.favorite}" class="favorite-button">
      </div>
    </article>`
   cardContainer.insertAdjacentHTML('afterbegin', text);
    var msgPhoto = document.querySelector('#add-photo-message');
    msgPhoto.classList.add('add-photo-message');
}

function saveContent(e) {
  var element = e.target;
  var text = e.target.textContent;
  var targetPhoto = findPhoto(e);

  if (element.className === 'photo-title') {
    targetPhoto.title = text;
  }
  if (element.className === 'photo-caption') {
    targetPhoto.caption = text;
  }
  // targetPhoto.updateContent();
  targetPhoto.saveToStorage(images);
}

function findPhoto(e) {
  if (!e.target.closest('.photo-card')) return;
  var photo = e.target.closest('.photo-card');
  var cardId = parseInt(photo.getAttribute('data-id'));
  return images.find(function(photo) {
    return photo.cardId === cardId;
  });
}

function clickHandler(e) {
  var targetPhoto = findPhoto(e);
  if (e.target.className === 'favorite-button') {
    e.target.dataset.favorite = !JSON.parse(e.target.dataset.favorite);
    targetPhoto.favorite = !targetPhoto.favorite;
    targetPhoto.favorite ? activateFavorite(e.target) : deactivateFavorite(e.target);
    targetPhoto.favorite ? increaseFavoriteCount() : decreaseFavoriteCount();
    targetPhoto.updateContent(images);
  }

  if (e.target.className === 'delete-button') {
    deleteIdea(e);
  }
}

function deleteIdea(e) {
  var photoCard = e.target.parentElement.parentElement;
  photoCard.remove();
  var targetIdea = findPhoto(e);
  targetIdea.deleteFromStorage();
}

function increaseFavoriteCount() {
  var favoriteCount = document.querySelector('.favorite-count');
  var totalFavorite = Number(favoriteCount.innerHTML);
  totalFavorite++;
  favoriteCount.innerHTML = totalFavorite;
}

function decreaseFavoriteCount() {
    var favoriteCount = document.querySelector('.favorite-count');
    var totalFavorite = Number(favoriteCount.innerHTML);
    totalFavorite--;
    favoriteCount.innerHTML = totalFavorite;
}

function mouseOver(e) {
  if (e.target.className === 'favorite-button') {
    activateFavorite(e.target);
  }
  if (e.target.className === 'delete-button') {
    activateDelete(e.target);
  }
}

function mouseOut(e) {
  if (e.target.className === 'favorite-button') {
    deactivateFavorite(e.target);
  }
  if (e.target.className === 'delete-button') {
    deactivateDelete(e.target);
  }
}

function activateFavorite(target) {
  target.setAttribute('src', 'Images/favorite-active.svg');
}

function deactivateFavorite(target) {
  if (target.dataset.favorite == 'false'){
    target.setAttribute('src', 'Images/favorite.svg');
  }
}

function activateDelete(target) {
  target.setAttribute('src', 'Images/delete-active.svg');
}

function deactivateDelete(target) {
  target.setAttribute('src', 'Images/delete.svg');
}

function searchImages(e) {
  var currentSearch = e.target.value;
  var regex = new RegExp(currentSearch, 'i');
  var photoMatches = [];
  clearImages();
  for (let i = 0; i < images.length; i++) {
    if (regex.test(images[i].title) || regex.test(images[i].caption)) {
      photoMatches.push(images[i]);
      displayCard(images[i]);
    }
  }
}

function viewFavorites(e) {
  e.preventDefault();
  clearImages();
  var filterBoolean = JSON.parse(e.target.dataset.filter)
  console.log(JSON.parse(e.target.dataset.filter));
  e.target.dataset.filter = !filterBoolean;
  !filterBoolean ? showAllFavorites() : showAll();
  }

function showAllFavorites() {
   for (var i = 0; i < images.length; i++) {
    if (images[i].favorite) {
      displayCard(images[i])
    }
  }
}

function showAll() {
  for (var i = 0; i < images.length; i++) {
    displayCard(images[i]);
  }
}

function clearImages() {
  var photoGallery = document.querySelector('.photo-gallery');
  photoGallery.innerHTML = '';
}
