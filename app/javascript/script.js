const navLinks = document.querySelector(".nav"), main = document.querySelector(".main"), preview = document.querySelector(".preview"),
hidden = document.querySelector(".hidden"), image = document.querySelector(".image"), nam = document.querySelector(".name"),
imgLink = document.querySelector(".imgLink"), back = document.querySelector(".back"), dwnBtn = document.querySelector(".dwnBtn"), links = document.querySelectorAll(".link");
const apiKey = "33f163ba12bf71d75c9721c662f4a2aa", userId = '200189408@N02', albumId = '72177720323931147';
const url = `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&photoset_id=${albumId}&user_id=${userId}&format=json&nojsoncallback=1`;
let point = 0, index = 0, clicked = false, result, nnn = [], photoUrl;

function shuffleArray(arr) {
  return arr.sort(()=>Math.random() - 0.5);
}

links.forEach((link)=>{
  link.addEventListener("click", ()=>{
    links.forEach(otherlink=>otherlink.classList.replace("active", "inactive"))
    link.classList.replace("inactive", "active");
  })
})

back.addEventListener("click", ()=>{
  preview.classList.replace("flex", "hide");
  hidden.classList.replace("shown", "hidden");
})

function displayImages(images) {
  let displayimages = images.map((image) => {
    return `<article id="${image.id}" class="card">
        <span class="immg"><img id="${image.id}" class="image" src=${image.src} alt=${image.name}></span>
        <a href="#" class="download" id=${image.src}><img src="./images//icons/download.svg" alt="download icon"/><h2>Download</h2></a>
      </article>`;
  });
  displayimages = displayimages.join("");
  main.innerHTML = displayimages;
}

function arrayToOBJECT(arr) {
  arr.forEach((photo, index)=>{
    photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
    const obj = {
      id: index,
      name: photo.title,
      src: photoUrl
    } 
    nnn.push(obj);
  });
  return nnn;
}

function downloadImage (id) {
  fetch(id).then(res => res.blob()).then(File => {
    let tempUrl = URL.createObjectURL(File);
    let aTag = document.createElement("a");
    aTag.href = tempUrl;
    aTag.download = "Vvyd wallpaper";
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  })
}

function lots(e) {
  preview.classList.replace("hide", "flex");
  hidden.classList.replace("hidden", "shown");
  image.src=e.target.currentSrc;
  image.alt=e.target.alt;
  nam.innerHTML=e.target.alt;
  imgLink.href=e.target.currentSrc;
}

dwnBtn.addEventListener("click", (e)=>downloadImage(image.src))

function filterArray(arr, searchA, searchB) {
  return arr.filter((element)=>element.name.includes(searchA) || element.name.includes(searchB));
}

window.addEventListener("DOMContentLoaded", () => {

  fetch(url).then(response => response.json()).then(data => {
    const photos = data.photoset.photo;
    arrayToOBJECT(photos);
    const images = shuffleArray(nnn);

    clicked==false?displayImages(nnn): "";
    //Search bar Function
    const categories = [ ...new Set(nnn.map((item)=> {return item;})) ];
    document.getElementById("search-bar").addEventListener("input", (e)=> {
      const searchData = e.target.value.toLowerCase();
      const filterData = categories.filter((item)=> {
        if (item.name.toLocaleLowerCase().includes(searchData)){return (item.name.toLocaleLowerCase().includes(searchData));}
      });
      searchData.length>=1?displayImages(filterData):displayImages(nnn);

      Array.from(document.getElementsByClassName("immg")).forEach(element=>element.addEventListener("click", (e)=>lots(e)));
      Array.from(document.getElementsByClassName("download")).forEach((element)=>{
        element.addEventListener("click", (e)=>{
          const lnk = e.target.id;
          downloadImage(lnk);
        })
      })
    })
    Array.from(document.getElementsByClassName("link")).forEach((element)=>{

      element.addEventListener("click", (e) => {
        clicked = true;
        nnn = [];
        point = e.target.id.toLowerCase();
        const searchA = "-"+point, searchB = point+"-";
        result = filterArray(images, searchA, searchB);
        const img = shuffleArray(result);
        clicked==false?displayImages(nnn):displayImages(img);
        Array.from(document.getElementsByClassName("immg")).forEach(element=>element.addEventListener("click", (e)=>lots(e)));
        Array.from(document.getElementsByClassName("download")).forEach((element)=>{
          element.addEventListener("click", (e)=>{
            const lnk = e.target.id;
            downloadImage(lnk);
          })
        })
      })
    });
    Array.from(document.getElementsByClassName("immg")).forEach(element=>element.addEventListener("click", (e)=>lots(e)));
    Array.from(document.getElementsByClassName("download")).forEach((element)=>{
      element.addEventListener("click", (e)=>{
        const lnk = e.target.id;
        downloadImage(lnk);
      })
    })
  }).catch(error => console.error(error));
});