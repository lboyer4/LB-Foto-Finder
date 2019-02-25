//QUERY SELECTORS
var addBtn = document.querySelector('#add-btn');
var images = JSON.parse(localStorage.getItem('gallery')) || [];
var imageBtn = document.querySelector('.inputfile');
var photoCardClick = document.querySelector('.photo-gallery');
var reader = new FileReader();
var cardContainer = document.querySelector('.photo-gallery');

//EVENT LISTENERS
addBtn.addEventListener('click', loadImg);
photoCardClick.addEventListener('focusout', saveContent);
cardContainer.addEventListener('click', clickHandler);
cardContainer.addEventListener('mouseover', mouseOver);
cardContainer.addEventListener('mouseout', mouseOut);




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
  		activateFavorite(favorites[i])
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

function createCard(e){
	var title = document.querySelector('.title-input').value;
	var image = e.target.result; 
	var caption = document.querySelector('.caption-input').value;
	var newPhoto = new Photo(title, image, caption, Date.now());
	images.push(newPhoto);
	displayCard(newPhoto)
	newPhoto.saveToStorage(images);
}

function displayCard(newPhotoObj) {
	var text = `<article class="photo-card" data-id="${newPhotoObj.cardId}">
      <h2 class="photo-title" contenteditable="true">${newPhotoObj.title}</h2>
      <img id="photo" class="insert-photo" src=${newPhotoObj.image}>
      <p class="photo-caption" contenteditable="true">${newPhotoObj.caption}</p>
      <div class="trash-love">
        <img src="Images/delete.svg" class="delete-button">
        <img src="Images/favorite.svg" data-favorite="${newPhotoObj.favorite}" class="favorite-button">
      </div>
    </article>`
   cardContainer.insertAdjacentHTML('afterbegin', text);
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
  targetPhoto.updateContent();
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
		targetPhoto.favorite = !targetPhoto.favorite
		targetPhoto.favorite ? activateFavorite(e.target) : deactivateFavorite(e.target);
		targetPhoto.saveToStorage(images);}

	if (e.target.className === 'delete-button') {
	}

}

function mouseOver(e) {
	if (e.target.className === 'favorite-button') {
		activateFavorite(e.target);
	}
}

function mouseOut(e) {
	if (e.target.className === 'favorite-button') {
		deactivateFavorite(e.target);
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
