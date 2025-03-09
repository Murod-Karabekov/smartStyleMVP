document.addEventListener("DOMContentLoaded", function () {
    const camera = document.getElementById("camera");
    const captureBtn = document.getElementById("captureBtn");
    const uploadBtn = document.getElementById("uploadBtn");
    const fileInput = document.getElementById("fileInput");
    const clothesContainer = document.getElementById("clothesContainer");
    const capturedImagesContainer = document.getElementById("capturedImages");
    let uploadedImage = null;

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { camera.srcObject = stream; })
        .catch(error => console.error("Kamerani yoqib bo'lmadi", error));

    function loadRandomClothes() {
        clothesContainer.innerHTML = "";
        let randomIndexes = new Set();
        while (randomIndexes.size < 3) {
            randomIndexes.add(Math.floor(Math.random() * 10) + 1);
        }
        randomIndexes.forEach(num => {
            let img = document.createElement("img");
            img.src = `clothes/${num}.jpg`;
            img.width = 150;
            img.className = "border rounded d-block mx-auto";
            let btn = document.createElement("button");
            btn.className = "btn btn-info mt-2 d-block mx-auto";
            btn.innerText = "Olish";
            btn.onclick = () => window.location.href = "https://www.amazon.com/s?k=women%27s+t-shirts&rh=n%3A1045624&ref=nb_sb_noss";
            let div = document.createElement("div");
            div.className = "text-center mb-3";
            div.appendChild(img);
            div.appendChild(btn);
            clothesContainer.appendChild(div);
        });
    }

    async function detectMainColors(imageElement) {
        return new Promise((resolve) => {
            if (!imageElement) return resolve(["#FFC0CB"]);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let colorMap = {};
            
            for (let i = 0; i < pixels.length; i += 4) {
                let r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
                let color = `rgb(${r}, ${g}, ${b})`;
                colorMap[color] = (colorMap[color] || 0) + 1;
            }
            
            let sortedColors = Object.entries(colorMap).sort((a, b) => b[1] - a[1]);
            let topColors = sortedColors.slice(0, 4).map(color => color[0]);
            resolve(topColors);
        });
    }

    captureBtn.addEventListener("click", async function () {
        loadRandomClothes();
        captureImage();
        
        setTimeout(async () => {
            const imageElement = capturedImagesContainer.querySelector("img");
            if (imageElement) {
                const mainColors = await detectMainColors(imageElement);
                console.log("Aniqlangan asosiy ranglar:", mainColors);
                const existingBoxes = capturedImagesContainer.querySelectorAll(".face-color-box");
                existingBoxes.forEach(box => box.remove());
                
                mainColors.forEach(color => {
                    const colorBox = document.createElement("div");
                    colorBox.className = "face-color-box";
                    colorBox.style.width = "50px";
                    colorBox.style.height = "50px";
                    colorBox.style.backgroundColor = color;
                    colorBox.style.border = "2px solid #000";
                    colorBox.style.borderRadius = "5px";
                    colorBox.style.margin = "5px auto";
                    capturedImagesContainer.appendChild(colorBox);
                });
            }
        }, 500);
    });

    uploadBtn.addEventListener("click", loadRandomClothes);
    fileInput.addEventListener("change", function (event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                capturedImagesContainer.innerHTML = "";
                uploadedImage = document.createElement("img");
                uploadedImage.src = e.target.result;
                uploadedImage.width = 100;
                uploadedImage.className = "border rounded m-2";
                capturedImagesContainer.appendChild(uploadedImage);
            };
            reader.readAsDataURL(file);
        }
    });

    function captureImage() {
        const canvas = document.createElement("canvas");
        canvas.width = camera.videoWidth;
        canvas.height = camera.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        capturedImagesContainer.innerHTML = "";
        const capturedImage = document.createElement("img");
        capturedImage.src = imageUrl;
        capturedImage.width = 100;
        capturedImage.className = "border rounded m-2";
        capturedImagesContainer.appendChild(capturedImage);
    }

    uploadBtn.addEventListener("click", function () {
        if (!uploadedImage && capturedImagesContainer.innerHTML === "") {
            alert("Iltimos, avval rasm yuklang yoki suratga oling!");
        } else {
            alert("Rasm yuklandi va saqlandi!");
        }
    });
});
