function mobileMenu () {
  document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.getElementById('menu-button');
    const dropdownMenu = document.querySelector('.absolute.right-0');
  
    menuButton.setAttribute('aria-expanded', 'false');
    dropdownMenu.classList.add('hidden');
    
    menuButton.addEventListener('click', function () {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
      menuButton.setAttribute('aria-expanded', !expanded);
      dropdownMenu.classList.toggle('hidden');
    });
  
    // Close the dropdown when clicking outside of it
    document.addEventListener('click', function (event) {
      if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        menuButton.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.add('hidden');
      }
    });
  });
}

function chooseImage () {
    const input = document.querySelector("#inputfile");
    const chooseButtons = document.querySelectorAll('.choose');
    const mdchoose = document.querySelector("#md-choose")
    var postCreate = document.querySelector("#overlay");
    const imagePreview = document.querySelector("#imagepreview");
    const previewContainer = document.querySelector("#md-image-preview");

    chooseButtons.forEach(function (elem) {
        elem.addEventListener('click', function () {
           input.click();
        });
    });
    document.querySelector("#plus").addEventListener("click", function(){
        postCreate.style.display = "initial";
    })
    document.querySelectorAll("#post-close-md").forEach(elem => {
      elem.addEventListener("click", function(){
        previewContainer.style.display = 'flex';
        postCreate.style.display = "none";
        imagePreview.style.display = "none";
        imagePreview.innerHTML = ``;
        mdchoose.style.display = "initial";
     })
    }) 

    input.addEventListener("change",()=>{
      const file = input.files[0];
        if (file) {
          const reader = new FileReader();

          reader.onload = function (e) {
              imagePreview.style.display = "flex";
              imagePreview.innerHTML = `<img class="h-full w-full object-cover object-center" src="${e.target.result}">`;
              previewContainer.style.display = 'flex';
              chooseButtons.forEach(e => {
                e.style.display = "none";
              })
          };

          reader.readAsDataURL(file);
        }
    })
}

function profileImage() {
  document.querySelector("#pencil").addEventListener("click", ()=>{
    document.querySelector("#dpinput").click();
  })
  document.querySelector("#dpinput").addEventListener("change", ()=>{
    document.querySelector("#dpform").submit();
  })
}

function postButton() {
  
}

mobileMenu();
chooseImage();
postButton();
profileImage();