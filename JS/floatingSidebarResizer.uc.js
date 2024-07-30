// ==UserScript==
// @name           Floating Sidebar
// @version        0.1.0
// @author         Odoryanse
// @homepageURL    https://voz.vn/u/odoryanse.1870756/
// ==/UserScript==

(() => {
  function startup() {    
    let box = document.getElementById(`sidebar2-box`)
    let keepPanelWidthBtn = document.getElementById(`sidebar2-keeppanelwidth`)
    let closeBtn = document.getElementById(`sidebar2-close`)

    let width = UC_API.Prefs.get(`userChrome.floating-sidebar.width`)
    let height = UC_API.Prefs.get(`userChrome.floating-sidebar.height`)
    let top = UC_API.Prefs.get(`userChrome.floating-sidebar.top`)
    let left = UC_API.Prefs.get(`userChrome.floating-sidebar.left`)

    let resizers    
    const MIN_SIZE = 150
    let originalWidth = 0
    let originalHeight = 0
    let originalX = 0
    let originalY = 0
    let originalMouseX = 0
    let originalMouseY = 0

    function restoreBoxPosition(element) {      
      element.style.width = width.hasUserValue() ? width.value : `400px`
      element.style.height = height.hasUserValue() ? height.value : `calc(100vh - 64px)`
      element.style.top = top.hasUserValue() ? top.value : `64px`
      element.style.left = left.hasUserValue() ? left.value : `32px`
    }

    function saveBoxPosition(element) {
      width.value = element.style.width
      height.value = element.style.height
      top.value = element.style.top
      left.value = element.style.left
    }

    function createPinButton() {
      let pinBtn = document.createXULElement(`toolbarbutton`)
      pinBtn.id = `sidebar2-pin`
      pinBtn.classList.add(`sidebar2-icon`)
      pinBtn.onclick = () => {
        box.classList.toggle(`pinned`)
        if (box.classList.contains(`pinned`)) {
          box.style.width = width.hasUserValue() ? width.value : `400px`
          box.style.height = `auto`
        } else {
          restoreBoxPosition(box)
        }
      }

      let pinIcon = document.createXULElement(`image`)
      pinIcon.className = `toolbarbutton-icon`
      
      pinBtn.appendChild(pinIcon)
      closeBtn.before(pinBtn)
    }

    function initBox() {
      box.classList.add(`pinned`, `main-browser`)
      createPinButton()
      keepPanelWidthBtn.style.display = `none`
    }

    function attachDrag() {
      let sidebarHeader = document.getElementById(`sidebar2-header`)

      sidebarHeader.addEventListener(`mousedown`, function(e) {
        let offsetX = e.clientX - parseInt(window.getComputedStyle(box, null).left)
        let offsetY = e.clientY - parseInt(window.getComputedStyle(box, null).top)
        let isMouseMoved = false
        
        function mouseMoveHandler(e) {
          if (box.classList.contains(`pinned`)) {
            isMouseMoved = false
            return
          }
          if (!box.classList.add(`dragging`)) {
            box.classList.add(`dragging`)
          }
          requestAnimationFrame(() => {
            box.style.top = (e.clientY - offsetY) + `px`
            box.style.left = (e.clientX - offsetX) + `px`
          })
          isMouseMoved = true
        }

        function reset() {
          if (isMouseMoved) {
            saveBoxPosition(box, `dragreset`)
          }
          isMouseMoved = false
          box.classList.remove(`dragging`)
          window.removeEventListener(`mousemove`, mouseMoveHandler)
          window.removeEventListener(`mouseup`, reset)
        }
    
        window.addEventListener(`mousemove`, mouseMoveHandler)
        window.addEventListener(`mouseup`, reset)
      })
    }

    function createResizer() {
      let resizerTop = document.createElement(`div`)
      let resizerRight = document.createElement(`div`)
      let resizerBottom = document.createElement(`div`)
      let resizerLeft = document.createElement(`div`)
      let resizerTopRight = document.createElement(`div`)
      let resizerTopLeft = document.createElement(`div`)
      let resizerBottomRight = document.createElement(`div`)
      let resizerBottomLeft = document.createElement(`div`)

      resizers = [
        resizerTop,
        resizerRight,
        resizerBottom,
        resizerLeft,
        resizerTopRight,
        resizerTopLeft,
        resizerBottomRight,
        resizerBottomLeft
      ]

      for (let i = 0;i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.classList.add(`resizer`)
      }

      resizerTop.classList.add(`top`)
      resizerRight.classList.add(`right`)
      resizerBottom.classList.add(`bottom`)
      resizerLeft.classList.add(`left`)
      resizerTopRight.classList.add(`top-right`)
      resizerTopLeft.classList.add(`bottom-right`)
      resizerBottomRight.classList.add(`bottom-left`)
      resizerBottomLeft.classList.add(`top-left`)
    }
    
    function appendResizersToBox() {
      for (let i = 0;i < resizers.length; i++) {
        const currentResizer = resizers[i];
        box.appendChild(currentResizer)
      }      
      box.style.maxWidth = "100%";
    }
    
    function attachResizers() {
      createResizer()
      appendResizersToBox()

      for (let i = 0;i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener(`mousedown`, function(e) {
          e.preventDefault()

          if (currentResizer.classList.contains(`top`)) {
            currentResizer.style.height = `100vh`
            currentResizer.style.top = `-50vh`
          }
          else if (currentResizer.classList.contains(`right`)) {
            currentResizer.style.width = `100vw`
            currentResizer.style.right = `-50vw`
          }
          else if (currentResizer.classList.contains(`bottom`)) {
            currentResizer.style.height = `100vh`
            currentResizer.style.bottom = `-50vh`
          }
          else if (currentResizer.classList.contains(`left`)) {
            currentResizer.style.width = `100vw`
            currentResizer.style.left = `-50vw`
          }
          else if (currentResizer.classList.contains(`top-right`)) {
            currentResizer.style.width = `100vh`
            currentResizer.style.right = `-50vh`
            currentResizer.style.height = `100vh`
            currentResizer.style.top = `-50vh`
          }
          else if (currentResizer.classList.contains(`bottom-right`)) {
            currentResizer.style.width = `100vh`
            currentResizer.style.right = `-50vh`
            currentResizer.style.height = `100vh`
            currentResizer.style.bottom = `-50vh`
          }
          else if (currentResizer.classList.contains(`bottom-left`)) {
            currentResizer.style.width = `100vh`
            currentResizer.style.left = `-50vh`
            currentResizer.style.height = `100vh`
            currentResizer.style.bottom = `-50vh`
          }
          else if (currentResizer.classList.contains(`top-left`)) {
            currentResizer.style.width = `100vh`
            currentResizer.style.left = `-50vh`
            currentResizer.style.height = `100vh`
            currentResizer.style.top = `-50vh`
          }
          
          originalWidth = parseFloat(
            getComputedStyle(box, null).getPropertyValue(`width`).replace(`px`, ``)
          )
          originalHeight = parseFloat(
            getComputedStyle(box, null).getPropertyValue(`height`).replace(`px`, ``)
          )
          originalX = box.getBoundingClientRect().left
          originalY = box.getBoundingClientRect().top          
          originalMouseX = e.pageX
          originalMouseY = e.pageY

          function resize(e) {            
            if (box.classList.contains(`pinned`)) {
              return
            }
            requestAnimationFrame(() => {
              if (currentResizer.classList.contains(`top`)) {
                const height = originalHeight - (e.pageY - originalMouseY)
                if (height > MIN_SIZE) {
                  box.style.height = height + `px`
                  box.style.top = originalY + (e.pageY - originalMouseY) + `px`
                }
              }
              else if (currentResizer.classList.contains(`right`)) {
                const width = originalWidth + (e.pageX - originalMouseX)
                if (width > MIN_SIZE) {
                  box.style.width = width + `px`
                }
              }
              else if (currentResizer.classList.contains(`bottom`)) {
                const height = originalHeight + (e.pageY - originalMouseY)
                if (height > MIN_SIZE) {
                  box.style.height = height + `px`
                }
              }
              else if (currentResizer.classList.contains(`left`)) {
                const width = originalWidth - (e.pageX - originalMouseX)
                if (width > MIN_SIZE) {
                  box.style.width = width + `px`
                  box.style.left = originalX + (e.pageX - originalMouseX) + `px`
                }
              }
              else if (currentResizer.classList.contains(`bottom-right`)) {
                const width = originalWidth + (e.pageX - originalMouseX)
                const height = originalHeight + (e.pageY - originalMouseY)
                if (width > MIN_SIZE) {
                  box.style.width = width + `px`
                }
                if (height > MIN_SIZE) {
                  box.style.height = height + `px`
                }
              }
              else if (currentResizer.classList.contains(`bottom-left`)) {
                const height = originalHeight + (e.pageY - originalMouseY)
                const width = originalWidth - (e.pageX - originalMouseX)
                if (height > MIN_SIZE) {
                  box.style.height = height + `px`
                }
                if (width > MIN_SIZE) {
                  box.style.width = width + `px`
                  box.style.left = originalX + (e.pageX - originalMouseX) + `px`
                }
              }
              else if (currentResizer.classList.contains(`top-right`)) {
                const width = originalWidth + (e.pageX - originalMouseX)
                const height = originalHeight - (e.pageY - originalMouseY)
                if (width > MIN_SIZE) {
                  box.style.width = width + `px`
                }
                if (height > MIN_SIZE) {
                  box.style.height = height + `px`
                  box.style.top = originalY + (e.pageY - originalMouseY) + `px`
                }
              }
              else if (currentResizer.classList.contains(`top-left`)) {
                const width = originalWidth - (e.pageX - originalMouseX)
                const height = originalHeight - (e.pageY - originalMouseY)
                if (width > MIN_SIZE) {
                  box.style.width = width + `px`
                  box.style.left = originalX + (e.pageX - originalMouseX) + `px`
                }
                if (height > MIN_SIZE) {
                  box.style.height = height + `px`
                  box.style.top = originalY + (e.pageY - originalMouseY) + `px`
                }
              }
            })
          }

          function stopResize() {
            window.removeEventListener('mousemove', resize)
            for (let i = 0;i < resizers.length; i++) {
              const currentResizer = resizers[i];
              currentResizer.style.width = null
              currentResizer.style.height = null          
              currentResizer.style.right = null
              currentResizer.style.bottom = null
              currentResizer.style.left = null
              currentResizer.style.top = null
            }
            if (!box.classList.contains(`pinned`)) {
              saveBoxPosition(box, `stopResize`)
            }
          }

          window.addEventListener(`mousemove`, resize)
          window.addEventListener(`mouseup`, stopResize)
        })
      }
    }

    initBox()
    attachDrag()
    attachResizers()
  }

  function observeBrowser() {
    let observer = new MutationObserver(mutations => {
      for(let mutation of mutations) {    
        for(let node of mutation.addedNodes) {
          if (!(node instanceof XULElement)) continue;
          if (node.id == `sidebar2-box`) {
            startup()
            console.log(`Floating Sidebar Loaded`)
            observer.disconnect()
          }
        }
      }
    
    })
    let browser = document.querySelector(`#browser`)
    observer.observe(browser, {
      childList: true,
      subtree: true
    })
  }

  if (gBrowserInit.delayedStartupFinished) {
    observeBrowser()
  } else {
    let delayedListener = (subject, topic) => {
      if (topic == `browser-delayed-startup-finished` && subject == window) {
        Services.obs.removeObserver(delayedListener, topic)
        observeBrowser()
      }
    };
    Services.obs.addObserver(
      delayedListener,
      `browser-delayed-startup-finished`
    )
  }
})()
