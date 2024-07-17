
function changeBg(){
    var navbar = document.getElementById('navbar');

    var scrollValue = window.scrollY;
  

    if(scrollValue<50){
        navbar.classList.remove('navBg');
    }
    else{
        navbar.classList.add('navBg');
    }
}


window.addEventListener('scroll', changeBg);