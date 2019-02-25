class Photo {
	constructor(title, image, caption, cardId, favorite){
		this.title = title;
		this.image = image;
		this.caption = caption;
		this.favorite = favorite || false;
		this.cardId = cardId
	}

	saveToStorage(array) {
		localStorage.setItem('gallery', JSON.stringify(array));
	}

  updateContent() {
    var index = images.indexOf(this)
    images.splice(index, 1, this);
  }

	// deleteFromStorage() {

	// }

	// updatePhoto() {

	// }
}