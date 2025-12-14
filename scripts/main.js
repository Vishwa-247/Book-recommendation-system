/**
 * AdvocateKhoj - Main JavaScript
 * Static HTML version with vanilla JavaScript
 * All interactions: mobile menu, smooth scroll, back-to-top, accordion, tabs, forms, toast
 */

document.addEventListener("DOMContentLoaded", () => {
  MobileMenu.init()
  SmoothScroll.init()
  ActiveLinks.init()
  BackToTop.init()
  Accordion.init()
  Tabs.init()
  Forms.init()
  Toast.init()
  FAQSearch.init()
  PortalCleanup.init()
})

/**
 * Mobile Menu Module
 */
const MobileMenu = {
  init() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn")
    const mobileMenu = document.getElementById("mobile-menu")
    const menuIcon = document.getElementById("menu-icon")

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        const isOpen = !mobileMenu.classList.contains("hidden")
        mobileMenu.classList.toggle("hidden")

        // Update icon
        if (menuIcon) {
          if (isOpen) {
            menuIcon.innerHTML =
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>'
          } else {
            menuIcon.innerHTML =
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
          }
        }
      })

      // Close menu when clicking a link
      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("hidden")
          if (menuIcon) {
            menuIcon.innerHTML =
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>'
          }
        })
      })

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
          mobileMenu.classList.add("hidden")
          if (menuIcon) {
            menuIcon.innerHTML =
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>'
          }
        }
      })
    }
  },
}

/**
 * Smooth Scroll Module
 */
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href")
        if (href === "#") return

        e.preventDefault()
        const target = document.querySelector(href)
        if (target) {
          const headerOffset = 80
          const elementPosition = target.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  },
}

/**
 * Active Links Module
 */
const ActiveLinks = {
  init() {
    const currentPath = window.location.pathname
    const pathParts = currentPath.split("/").filter(Boolean)

    document.querySelectorAll("nav a").forEach((link) => {
      const href = link.getAttribute("href")
      if (!href) return

      const hrefParts = href.split("/").filter(Boolean)
      const hrefMainPart = hrefParts[0] || ""
      const currentMainPart = pathParts[0] || ""

      if (hrefMainPart && currentMainPart && hrefMainPart === currentMainPart) {
        link.classList.add("border-accent", "text-primary-dark")
        link.classList.remove("border-transparent")
      }
    })
  },
}

/**
 * Back To Top Button Module
 */
const BackToTop = {
  init() {
    const backToTopBtn = document.getElementById("back-to-top")

    if (backToTopBtn) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add("visible")
        } else {
          backToTopBtn.classList.remove("visible")
        }
      })

      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      })
    }
  },
}

/**
 * Accordion Module
 */
const Accordion = {
  init() {
    document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
      trigger.addEventListener("click", function () {
        const content = this.nextElementSibling
        const icon = this.querySelector(".accordion-icon")
        const isOpen = !content.classList.contains("hidden")

        // Close all other accordion items in the same accordion
        const accordion = this.closest(".accordion")
        if (accordion) {
          accordion.querySelectorAll(".accordion-content").forEach((item) => {
            if (item !== content) {
              item.classList.add("hidden")
            }
          })
          accordion.querySelectorAll(".accordion-icon").forEach((i) => {
            if (i !== icon) {
              i.style.transform = "rotate(0deg)"
            }
          })
        }

        // Toggle current item
        content.classList.toggle("hidden")
        if (icon) {
          icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)"
        }
      })
    })
  },
}

/**
 * Tabs Module
 */
const Tabs = {
  init() {
    document.querySelectorAll(".tabs-trigger").forEach((trigger) => {
      trigger.addEventListener("click", function () {
        const tabsContainer = this.closest(".tabs")
        const tabValue = this.getAttribute("data-tab")

        // Update triggers
        tabsContainer.querySelectorAll(".tabs-trigger").forEach((t) => {
          t.classList.remove("active")
        })
        this.classList.add("active")

        // Update content
        tabsContainer.querySelectorAll(".tabs-content").forEach((content) => {
          if (content.getAttribute("data-tab") === tabValue) {
            content.classList.remove("hidden")
          } else {
            content.classList.add("hidden")
          }
        })
      })
    })
  },
}

/**
 * Forms Module
 */
const Forms = {
  init() {
    document.querySelectorAll("form[data-ajax]").forEach((form) => {
      form.addEventListener("submit", function (e) {
        e.preventDefault()

        const submitBtn = this.querySelector('button[type="submit"]')
        const originalText = submitBtn?.textContent

        // Validate form
        const isValid = this.checkValidity()
        if (!isValid) {
          Toast.show("Please fill in all required fields.", "error")
          return
        }

        if (submitBtn) {
          submitBtn.disabled = true
          submitBtn.textContent = "Sending..."
        }

        // Simulate form submission
        setTimeout(() => {
          Toast.show("Message sent successfully!", "success")
          form.reset()

          if (submitBtn) {
            submitBtn.disabled = false
            submitBtn.textContent = originalText
          }
        }, 1500)
      })
    })
  },
}

/**
 * Toast Notification Module
 */
const Toast = {
  container: null,

  init() {
    this.container = document.getElementById("toast-container")
    if (!this.container) {
      this.container = document.createElement("div")
      this.container.id = "toast-container"
      this.container.className = "fixed top-4 right-4 z-50 space-y-2"
      document.body.appendChild(this.container)
    }
  },

  show(message, type = "success") {
    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 flex-shrink-0 ${type === "success" ? "text-green-600" : "text-red-600"}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${
            type === "success"
              ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>'
              : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>'
          }
        </svg>
        <span class="text-sm font-medium text-gray-800">${message}</span>
        <button class="ml-2 text-gray-400 hover:text-gray-600" onclick="this.closest('.toast').remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `

    this.container.appendChild(toast)

    // Remove toast after 5 seconds
    setTimeout(() => {
      toast.style.animation = "slideOut 300ms ease-in forwards"
      setTimeout(() => toast.remove(), 300)
    }, 5000)
  },
}

/**
 * FAQ Search Module
 */
const FAQSearch = {
  init() {
    const searchInput = document.getElementById("faq-search")
    const clearBtn = document.getElementById("faq-search-clear")
    const faqSections = document.getElementById("faq-sections")

    if (!searchInput || !faqSections) return

    const filterFAQs = (searchTerm) => {
      const term = searchTerm.toLowerCase().trim()
      const items = faqSections.querySelectorAll(".accordion-item")
      const sections = faqSections.querySelectorAll("> div")

      if (!term) {
        // Show all FAQs
        items.forEach((item) => {
          item.style.display = ""
        })
        sections.forEach((section) => {
          section.style.display = ""
        })
        // Remove no results message if exists
        const noResultsMsg = document.getElementById("faq-no-results")
        if (noResultsMsg) noResultsMsg.remove()
        return
      }

      let hasMatches = false
      sections.forEach((section) => {
        const sectionItems = section.querySelectorAll(".accordion-item")
        let sectionHasMatches = false

        sectionItems.forEach((item) => {
          const question = item.querySelector(".accordion-trigger")?.textContent?.toLowerCase() || ""
          const answer = item.querySelector(".accordion-content")?.textContent?.toLowerCase() || ""

          if (question.includes(term) || answer.includes(term)) {
            item.style.display = ""
            sectionHasMatches = true
            hasMatches = true
          } else {
            item.style.display = "none"
          }
        })

        // Show/hide section based on matches
        section.style.display = sectionHasMatches ? "" : "none"
      })

      // Show "no results" message if needed
      const noResultsMsg = document.getElementById("faq-no-results")
      if (term && !hasMatches) {
        if (!noResultsMsg) {
          const msgDiv = document.createElement("div")
          msgDiv.id = "faq-no-results"
          msgDiv.className = "text-center py-12"
          msgDiv.innerHTML = `
            <p class="text-gray-600 mb-4">No FAQs found matching "${searchTerm}"</p>
            <button onclick="document.getElementById('faq-search').value=''; FAQSearch.filterFAQs('');" class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
              Clear Search
            </button>
          `
          faqSections.appendChild(msgDiv)
        }
      } else if (noResultsMsg) {
        noResultsMsg.remove()
      }
    }

    // Make filterFAQs accessible globally for the clear button
    FAQSearch.filterFAQs = filterFAQs

    searchInput.addEventListener("input", (e) => {
      const value = e.target.value
      filterFAQs(value)
      if (clearBtn) {
        clearBtn.classList.toggle("hidden", !value)
      }
    })

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        searchInput.value = ""
        filterFAQs("")
        clearBtn.classList.add("hidden")
        searchInput.focus()
      })
    }
  },
}

/**
 * Portal Cleanup Module
 * Handles browser extension injected elements (nextjs-portal, etc.)
 */
const PortalCleanup = {
  init() {
    // Clean up empty portal elements on load
    this.cleanupPortals()
    
    // Watch for dynamically added portal elements and style changes
    const observer = new MutationObserver(() => {
      this.cleanupPortals()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    })
    
    // Aggressively reset positioning every 50ms to override any dynamic changes
    // This ensures we catch any browser extension that modifies styles frequently
    setInterval(() => {
      this.cleanupPortals()
    }, 50)
  },
  
  cleanupPortals() {
    // Find all portal elements
    const portals = document.querySelectorAll('nextjs-portal, [data-cursor-element-id]')
    
    portals.forEach(portal => {
      // Force reset positioning to prevent layout issues - override any inline styles
      portal.style.setProperty('top', '0', 'important')
      portal.style.setProperty('left', '0', 'important')
      portal.style.setProperty('right', 'auto', 'important')
      portal.style.setProperty('bottom', 'auto', 'important')
      portal.style.setProperty('transform', 'none', 'important')
      portal.style.setProperty('pointer-events', 'none', 'important')
      
      // If portal is empty or has zero dimensions, hide it completely
      if (!portal.hasChildNodes() || 
          portal.offsetWidth === 0 || 
          portal.offsetHeight === 0) {
        portal.style.setProperty('display', 'none', 'important')
        portal.style.setProperty('visibility', 'hidden', 'important')
        portal.style.setProperty('opacity', '0', 'important')
        portal.style.setProperty('width', '0', 'important')
        portal.style.setProperty('height', '0', 'important')
        portal.style.setProperty('margin', '0', 'important')
        portal.style.setProperty('padding', '0', 'important')
      }
    })
  }
}

// Make Toast globally accessible
window.Toast = Toast
