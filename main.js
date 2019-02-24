//QUERY SELECTORS
var addBtn = document.querySelector('#add-btn');
var images = JSON.parse(localStorage.getItem('gallery')) || [];
var imageBtn = document.querySelector('.inputfile');
var photoCardClick = document.querySelector('.photo-gallery');
var reader = new FileReader();

//EVENT LISTENERS
addBtn.addEventListener('click', loadImg);
photoCardClick.addEventListener('focusout', saveContent)


//FUNCTIONS
loadPage(images);

function loadPage(oldImages) {
  images = [];
  for (let i = 0; i < oldImages.length; i++) {
  var newImage = new Photo(oldImages[i].title, oldImages[i].image, oldImages[i].caption, oldImages[i].cardId);
    images.push(newImage);
    displayCard(newImage);
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
	var cardContainer = document.querySelector('.photo-gallery');
	var text = `<article class="photo-card" data-id="${newPhotoObj.cardId}">
      <h2 class="photo-title" contenteditable="true">${newPhotoObj.title}</h2>
      <img id="photo" class="insert-photo" src=${newPhotoObj.image}>
      <p class="photo-caption" contenteditable="true">${newPhotoObj.caption}</p>
      <div class="trash-love">
        <img src="Images/delete.svg" class="delete-button">
        <img src="Images/favorite.svg" class="favorite-button">
    </article>`
   cardContainer.insertAdjacentHTML('afterbegin', text);
}

function saveContent (e) {
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

function findPhoto (e) {
  var photo = e.target.parentElement;
  var cardId = parseInt(photo.getAttribute('data-id'));
  return images.find(function(photo) {
    return photo.cardId === cardId;
  });
}