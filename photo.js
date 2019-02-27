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

  updatePhoto() {
    // var index = images.indexOf(this)
    // images.splice(index, 1, this);
    this.saveToStorage(images)
  }

	deleteFromStorage() {
    var index = images.indexOf(this)
    images.splice(index, 1);
    if (this === undefined) {
      images = [];
      localStorage.clear();
    } else {
      this.saveToStorage(images);
    }
  }
}