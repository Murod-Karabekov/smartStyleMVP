function uploadImage() {
    let imageInput = document.getElementById('imageUpload');
    let formData = new FormData();
    formData.append('image', imageInput.files[0]);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('faceShape').innerText = data.face_shape;
        document.getElementById('skinTone').innerText = data.skin_tone;

        let clothingList = document.getElementById('clothingList');
        clothingList.innerHTML = "";
        data.recommended_clothes.forEach(item => {
            let li = document.createElement('li');
            li.innerHTML = `<a href="${item.url}" target="_blank">${item.name} - ${item.price}</a>`;
            clothingList.appendChild(li);
        });
    })
    .catch(error => console.error('Xatolik:', error));
}
