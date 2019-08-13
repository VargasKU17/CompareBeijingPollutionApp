
    //layout parts
    let application = document.querySelector(".app")
    let appNav = document.querySelector(".app-navigation")
    let menuButton = document.querySelector(".menu-button")
    let sideNav = document.querySelector(".side-nav")
    let banner = document.querySelector(".banner")
    let toggleMenuBtn = false 
    //event handlers....grid transformations

    function hideShowByClassName(className, visibleOrHiddenString){
        for (let i = 0; i < document.getElementsByClassName(className).length; i++)
          document.getElementsByClassName(className)[i].style.visibility = visibleOrHiddenString;
      }
    
    function getSideBarMenu(){
            appNav.style.gridTemplateColumns = '5em 1fr 4fr 5em'
            appNav.style.gridTemplateAreas = '"menu-button banner banner banner" "side-nav side-nav app empty-col-symmetry"'
            let mq = window.matchMedia('(max-width: 500px)')
            if (mq.matches) {
                sideNav.style.background = '#e8000d'
                appNav.style.gridTemplateColumns = '1em 4em  1fr 1fr 4em 1em'
                appNav.style.gridTemplateAreas = '"menu-button menu-button  banner banner banner banner" "side-nav side-nav side-nav app app empty-col-symmetry"'
                if (document.querySelector('.city-info').style.visibility === 'hidden') hideShowByClassName('reveal', 'hidden')
            }
            sideNav.style.maxWidth = '100%'
            toggleMenuBtn = true
            hideShowByClassName('side-link', 'visible')
            sideNav.style.background = '#e8000d'
    }

    function resetNav() {
            appNav.style.gridTemplateColumns = '5em 1fr 5em'
            appNav.style.gridTemplateAreas = '"menu-button banner banner" "side-nav app empty-col-symmetry"'
            sideNav.style.background = 'linear-gradient(#eeeced, #0051BA)'
            let mq = window.matchMedia('(max-width: 500px)')
            if (mq.matches) {
                sideNav.style.background = 'linear-gradient(#0051BA,#eeeced)'
                appNav.style.gridTemplateColumns = '1em 4em 1fr 4em 1em'
                appNav.style.gridTemplateAreas = '"menu-button menu-button banner banner banner" "side-nav app app app empty-col-symmetry"'
                if (document.querySelector('.city-info').style.visibility === 'hidden') hideShowByClassName('reveal', 'visible')
            }
            toggleMenuBtn = false
            hideShowByClassName('side-link', 'hidden')
    }


    
    //event handlers
    menuButton.addEventListener('click', ()=> toggleMenuBtn === false? getSideBarMenu(): resetNav(), false)
    application.addEventListener('click', resetNav)
    banner.addEventListener('click', resetNav)

    