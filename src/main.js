import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  
  /* ==================================================
   * Theme Switcher (Dark / Light Mode)
   * ================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or default to light
  const currentTheme = localStorage.getItem('theme') || 'light';
  htmlElement.setAttribute('data-theme', currentTheme);

  themeToggle.addEventListener('click', () => {
    const activeTheme = htmlElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });


  /* ==================================================
   * Mobile Navigation Burger Menu
   * ================================================== */
  const burgerBtn = document.getElementById('burgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    burgerBtn.classList.toggle('open');
    burgerBtn.setAttribute('aria-expanded', isOpen);
  };

  burgerBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });


  /* ==================================================
   * Intersection Observer for Active Nav Link
   * ================================================== */
  const sections = document.querySelectorAll('.scroll-offset, .hero-section');
  
  const navObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the main viewport region
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id') || 'home';
        
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));


  /* ==================================================
   * Intersection Observer for Scroll Fade-In Effects
   * ================================================== */
  const animatedElements = document.querySelectorAll('.service-card, .product-card, .about-image-side, .about-content-side, .contact-info-side, .contact-form-side, .stat-card');
  
  // Set initial fade-in classes
  animatedElements.forEach(el => el.classList.add('fade-in'));

  const scrollObserverOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        scrollObserver.unobserve(entry.target); // Animate once
      }
    });
  }, scrollObserverOptions);

  animatedElements.forEach(el => scrollObserver.observe(el));


  /* ==================================================
   * Interactive Service Cards: Quote Shortcut
   * ================================================== */
  const serviceCards = document.querySelectorAll('.service-card, .product-card');
  const serviceDropdown = document.getElementById('serviceInterest');

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedService = card.getAttribute('data-service');
      if (selectedService && serviceDropdown) {
        serviceDropdown.value = selectedService;
        
        // Scroll smoothly to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          
          // Flash the dropdown to draw user attention
          setTimeout(() => {
            serviceDropdown.focus();
            serviceDropdown.classList.add('highlight-flash');
            setTimeout(() => {
              serviceDropdown.classList.remove('highlight-flash');
            }, 1000);
          }, 800);
        }
      }
    });
  });


  /* ==================================================
   * Form Validation (Mandatory Fields)
   * ================================================== */
  const form = document.getElementById('inquiryForm');
  if (form) {
    const successOverlay = document.getElementById('successOverlay');
    const successCloseBtn = document.getElementById('successCloseBtn');

    // Input Field Elements
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const serviceInterest = document.getElementById('serviceInterest');
    const message = document.getElementById('message');

    // Validation Patterns
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;

    // Helper validation functions
    const validateField = (input, validatorFn, parentGroup) => {
      const isValid = validatorFn(input.value.trim());
      if (isValid) {
        parentGroup.classList.remove('invalid');
      } else {
        parentGroup.classList.add('invalid');
      }
      return isValid;
    };

    // Validators mapping
    const validators = {
      name: (val) => nameRegex.test(val),
      email: (val) => emailRegex.test(val),
      phone: (val) => phoneRegex.test(val),
      service: (val) => val !== "" && val !== null,
      message: (val) => val.length >= 15
    };

    // Real-time Validation Listeners
    fullName.addEventListener('input', () => {
      validateField(fullName, validators.name, fullName.parentElement);
    });

    email.addEventListener('input', () => {
      validateField(email, validators.email, email.parentElement);
    });

    phone.addEventListener('input', () => {
      validateField(phone, validators.phone, phone.parentElement);
    });

    serviceInterest.addEventListener('change', () => {
      validateField(serviceInterest, validators.service, serviceInterest.parentElement.parentElement);
    });

    message.addEventListener('input', () => {
      validateField(message, validators.message, message.parentElement);
    });

    // Submit Handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check all fields
      const isNameValid = validateField(fullName, validators.name, fullName.parentElement);
      const isEmailValid = validateField(email, validators.email, email.parentElement);
      const isPhoneValid = validateField(phone, validators.phone, phone.parentElement);
      const isServiceValid = validateField(serviceInterest, validators.service, serviceInterest.parentElement.parentElement);
      const isMessageValid = validateField(message, validators.message, message.parentElement);

      const isFormValid = isNameValid && isEmailValid && isPhoneValid && isServiceValid && isMessageValid;

      if (isFormValid) {
        // Simulate successful form submission
        successOverlay.classList.add('show');
        successOverlay.setAttribute('aria-hidden', 'false');
        
        // Reset form
        form.reset();
        
        // Remove any leftover validation highlights
        document.querySelectorAll('.form-group').forEach(group => {
          group.classList.remove('invalid');
        });
      } else {
        // Scroll to the first invalid field
        const firstInvalidGroup = document.querySelector('.form-group.invalid');
        if (firstInvalidGroup) {
          firstInvalidGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const invalidInput = firstInvalidGroup.querySelector('input, select, textarea');
          if (invalidInput) {
            invalidInput.focus();
          }
        }
      }
    });

    // Success Modal Close Handler
    successCloseBtn.addEventListener('click', () => {
      successOverlay.classList.remove('show');
      successOverlay.setAttribute('aria-hidden', 'true');
    });
  }
  /* ==================================================
   * Search Overlay Logic
   * ================================================== */
  const searchOpenBtn = document.getElementById('searchOpenBtn');
  const searchCloseBtn = document.getElementById('searchCloseBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResultsList = document.getElementById('searchResultsList');
  const searchEmptyState = document.getElementById('searchEmptyState');
  const suggestionTags = document.querySelectorAll('.suggestion-tag');

  if (searchOpenBtn && searchOverlay) {
    const searchableItems = [];

    // Index all services
    document.querySelectorAll('.service-card').forEach((card) => {
      const titleEl = card.querySelector('.service-title');
      const descEl = card.querySelector('.service-body p');
      if (titleEl && descEl) {
        searchableItems.push({
          type: 'Service',
          title: titleEl.textContent.trim(),
          description: descEl.textContent.trim(),
          element: card
        });
      }
    });

    // Index all products
    document.querySelectorAll('.product-card').forEach((card) => {
      const titleEl = card.querySelector('.service-title');
      const descEl = card.querySelector('.service-body p');
      if (titleEl && descEl) {
        searchableItems.push({
          type: 'Product',
          title: titleEl.textContent.trim(),
          description: descEl.textContent.trim(),
          element: card
        });
      }
    });

    // Toggle Overlay Open
    searchOpenBtn.addEventListener('click', () => {
      searchOverlay.classList.add('show');
      searchOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scroll
      setTimeout(() => searchInput.focus(), 150);
    });

    // Close Overlay Function
    const closeSearch = () => {
      searchOverlay.classList.remove('show');
      searchOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore background scroll
      searchInput.value = '';
      renderResults('');
    };

    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', closeSearch);
    }

    // Close on click outside modal card
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('show')) {
        closeSearch();
      }
    });

    // Render results
    const renderResults = (query) => {
      const trimmedQuery = query.trim().toLowerCase();
      
      if (!trimmedQuery) {
        searchResultsList.innerHTML = '';
        searchEmptyState.style.display = 'block';
        searchEmptyState.querySelector('p').textContent = 'Start typing to search for services and products...';
        return;
      }

      // Filter matches
      const matches = searchableItems.filter(item => 
        item.title.toLowerCase().includes(trimmedQuery) || 
        item.description.toLowerCase().includes(trimmedQuery)
      );

      if (matches.length === 0) {
        searchResultsList.innerHTML = '';
        searchEmptyState.style.display = 'block';
        searchEmptyState.querySelector('p').innerHTML = `No results found for "<strong>${query}</strong>"`;
        return;
      }

      searchEmptyState.style.display = 'none';
      searchResultsList.innerHTML = matches.map((item, idx) => `
        <div class="search-result-item" data-index="${idx}">
          <span class="result-type-badge ${item.type.toLowerCase()}">${item.type}</span>
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      `).join('');

      // Add click listeners to items
      searchResultsList.querySelectorAll('.search-result-item').forEach((resultItem, idx) => {
        resultItem.addEventListener('click', () => {
          const matchItem = matches[idx];
          closeSearch();
          
          if (matchItem && matchItem.element) {
            // Scroll to the card
            matchItem.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add a temporary dynamic flash animation
            matchItem.element.classList.add('highlight-flash');
            setTimeout(() => {
              matchItem.element.classList.remove('highlight-flash');
            }, 1500);
          }
        });
      });
    };

    // Input change listener
    searchInput.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    // Popular suggestions click
    suggestionTags.forEach(tag => {
      tag.addEventListener('click', () => {
        const val = tag.textContent;
        searchInput.value = val;
        renderResults(val);
      });
    });
  }
  /* ==================================================
   * Hero Carousel Logic
   * ================================================== */
  const carousel = document.getElementById('heroCarousel');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.indicator-dot');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
      // Deactivate current slide and dot
      slides[currentSlide].classList.remove('active');
      dots[currentSlide].classList.remove('active');
      
      // Calculate new index
      currentSlide = (n + slides.length) % slides.length;
      
      // Activate new slide and dot
      slides[currentSlide].classList.add('active');
      dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      showSlide(currentSlide - 1);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      slideInterval = setInterval(nextSlide, 5000); // Slide every 5 seconds
    };

    const stopAutoSlide = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };

    // Click Listeners for Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide(); // Reset interval on manual control click
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide(); // Reset interval on manual control click
      });
    }

    // Click Listeners for Indicators
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        showSlide(idx);
        startAutoSlide(); // Reset interval on manual control click
      });
    });

    // Pause on Mouse Hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Initial Start
    startAutoSlide();
  }

    /* ==================================================
   * Card Details Modal Controller
   * ================================================== */
  const detailsData = {
    // Services
    cabling: {
      title: "Network & Structured Cabling",
      image: "assets/images/cabling.png",
      description: "Scale your managed server racks and data centers to meet growing bandwidth demands. We plan, organize, and install enterprise cabling networks properly to eliminate complex cable tangles, facilitate server expansions, and ensure high availability.",
      features: [
        "High-density Cat6, Cat6A, and Cat7 network infrastructure",
        "Server rack design, cabling audits, and patch panel terminations",
        "Fluke certification verification testing and cable labeling",
        "High-bandwidth fiber optic cabling uplinks for multi-floor buildings",
        "Compliant layouts tailored for data rooms, hotels, and luxury villas"
      ]
    },
    cctv: {
      title: "Closed Circuit Television (CCTV)",
      image: "assets/images/cctv.png",
      description: "Deter intruders, curb crime, and protect your company's physical premises. Our high-definition CCTV security camera systems feature remote mobile viewing, AI-enabled analytics, and intelligent alerts.",
      features: [
        "High-resolution (4K/8MP) IP camera systems with night vision",
        "AI video analytics including facial recognition and line crossing",
        "Redundant Network Video Recorders (NVR) with high-capacity storage",
        "Instant smartphone remote stream access on iOS and Android",
        "Fully compliant designs meeting Qatar MOI-SSD regulations"
      ]
    },
    access: {
      title: "Access Control Systems",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      description: "Protect your corporate premises and safeguard digital assets from unauthorized access. We integrate biometric locks, keyless cards, and management software to secure building points.",
      features: [
        "Biometric fingerprint scanners and advanced facial recognition gates",
        "RFID smart cards, electromagnetic locks, and proximity readers",
        "Centralized database software tracking real-time entry and exit logs",
        "Time & Attendance software synchronization for HR processes",
        "Secure emergency door release integrations for safety compliance"
      ]
    },
    pa: {
      title: "Public Address & Audio-Visual",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80",
      description: "Deploy robust public address networks and high-end audio-visual integrations tailored for corporate boardrooms, assembly halls, commercial showrooms, and shopping malls.",
      features: [
        "Zoned microphone routing and paging public address amplifiers",
        "High-end corporate meeting boardroom smart screen video installations",
        "Background music (BGM) control systems for premium showrooms",
        "Precision speaker placement layouts minimizing acoustic reverb",
        "Intuitive wall-mounted control panels and wireless connections"
      ]
    },
    smatv: {
      title: "SMATV & IPTV Networks",
      image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80",
      description: "Distribute satellite TV and digital interactive television signals across hotel complexes, commercial spaces, and residential compounds with maximum digital signal fidelity.",
      features: [
        "Commercial satellite dish arrays with high-frequency coaxial wiring",
        "Vibrant interactive IPTV networks with digital channels management",
        "Local channel insertion units for hotels and corporate displays",
        "Fiber-to-the-Home (FTTH) television signal distribution nodes",
        "Durable, corrosion-resistant outdoor signal splitter units"
      ]
    },
    wireless: {
      title: "Wireless Network Solutions",
      image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=600&q=80",
      description: "Eliminate physical cable bottlenecks with robust enterprise-grade Wi-Fi deployments. We guarantee seamless wireless connectivity, encrypted protocols, and stable multi-device routing.",
      features: [
        "Dual-band and Wi-Fi 6 high-density indoor/outdoor access points",
        "Smart mesh routing systems ensuring automatic, dead-zone free roaming",
        "Isolated secure guest portals with digital landing authorization pages",
        "Advanced WPA3 enterprise security encryption key protocols",
        "Centralized cloud controller dashboard tracking Wi-Fi health"
      ]
    },
    ups: {
      title: "Power Backup (UPS) Solutions",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
      description: "Keep critical network servers, databases, and CCTV surveillance systems running uninterrupted through electrical fluctuations and grid blackouts. Sized precisely for homes and corporate sites.",
      features: [
        "Uninterruptible Power Supply (UPS) cabinets with intelligent charge",
        "Automated failure transfer switches bridging utility power grids",
        "Advanced battery management reporting thermal status and lifecycle",
        "Scaled installations fitting everything from server rooms to entire sites",
        "Eco-mode operations lowering redundant power consumption"
      ]
    },
    hardware: {
      title: "IT Hardware Solutions",
      image: "assets/images/hardware.png",
      description: "Equip your workspace with robust, certified computational hardware. We source, configure, and install server units, network switches, and custom employee computer terminals.",
      features: [
        "Enterprise-grade server units from top international tech brands",
        "Managed gigabit network switches, routers, and firewalls",
        "High-performance workstations configured for demanding graphics",
        "Enterprise SSD storage bays with automated local backups",
        "Extended warranty coverage options with technical support contracts"
      ]
    },
    pbx: {
      title: "PBX Telephony Systems",
      image: "assets/images/pbx.png",
      description: "Deploy pioneering business telephony and unified voice routing. We install analog, digital, and cloud-based VoIP PBX systems for offices, customer service teams, and multi-site companies.",
      features: [
        "VoIP telephony systems supporting high-definition digital voice calls",
        "Automated digital receptionist (IVR) and custom menu setups",
        "Call forwarding routing, voicemail-to-email, and caller identification",
        "Multi-channel conference systems and softphone app integrations",
        "Scaled system architectures fitting small offices to corporate buildings"
      ]
    },
    datacenter: {
      title: "Complete Data Center Solutions",
      image: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&w=600&q=80",
      description: "Complete design, configuration, and monitoring of high-security server rooms and data storage centers, guaranteeing absolute operational uptime and fire protection.",
      features: [
        "Precision server row cooling systems keeping optimal thermal ranges",
        "Gas-based automated fire suppression systems preventing hardware damage",
        "Heavy-duty server racks with smart power distribution strips",
        "Access control card doors, CCTV cameras, and server cage partitions",
        "Real-time sensor monitors tracking humidity, heat, and leakage"
      ]
    },
    automation: {
      title: "Office & Villa Automation",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
      description: "Experience extreme comfort, convenience, and energy savings. We integrate illumination control, climate controls, security sensors, and audio systems into a unified interface.",
      features: [
        "Smart lighting dimmers, scene triggers, and automated blinds",
        "Climatization integrations scheduling thermostat temperature ranges",
        "Unified smart panels, tablet interfaces, and voice-command options",
        "Vibrant multi-zone background speaker control networks",
        "Smart sensors lowering power use when rooms are unoccupied"
      ]
    },
    
    // Products
    uniforms: {
      title: "Customized Uniforms",
      image: "assets/images/uniforms.png",
      description: "Tailor-made uniforms designed to reflect your brand's corporate identity. We utilize comfortable, breathable, and highly durable fabrics engineered for demanding work environments in Qatar.",
      features: [
        "Corporate suits, office shirts, trousers, and custom blazers",
        "Industrial workwear overalls, boiler suits, and high-visibility clothing",
        "Security staff uniforms with badging details and tactical caps",
        "Precision embroidery and long-lasting screen printed branding logos",
        "Diverse color palettes, size customization, and bulk fabric choices"
      ]
    },
    printing: {
      title: "Printing & Advertising",
      image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80",
      description: "High-resolution offset and digital printing services for all your marketing and promotional assets. We deliver crisp colors, professional paper finishes, and custom sizes.",
      features: [
        "Premium marketing booklets, brochures, and commercial flyers",
        "Corporate stationery, custom printed letterheads, and business cards",
        "Outdoor banners, roll-up display stands, and promotional signage",
        "Custom branded company gifts, notebooks, pens, and packaging box bags",
        "Fast print turnarounds with strict quality checks on color balances"
      ]
    },
    sanitary: {
      title: "Sanitary Wear & Hygiene",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      description: "Complete hygiene supplies and heavy-duty sanitary fittings designed for corporate headquarters, industrial buildings, commercial complexes, and hospitality setups.",
      features: [
        "Premium chrome faucets, plumbing check valves, and sanitary fixtures",
        "Bulk supply of tissue rolls, folded towels, soap refills, and disinfectants",
        "Contactless automated soap and hand sanitizer dispenser installations",
        "Industrial floor cleaning solutions, tools, and housekeeping gear",
        "Scheduled delivery contracts keeping corporate supplies fully stocked"
      ]
    },
    tools: {
      title: "Hand Tools & Hardware",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      description: "Heavy-duty hand tools, metal hardware fittings, structural fasteners, and building supplies sourced directly from certified international industrial manufacturers.",
      features: [
        "Heavy-duty mechanical hand tools, wrenches, pliers, and screwdrivers",
        "High-tensile steel structural bolts, screws, expansion anchors, and rivets",
        "Door locks, heavy-duty hinges, handles, and door closing units",
        "Measuring devices, spirit levels, lasers, and safety testing kits",
        "Durable, corrosion-resistant steel hardware fitting finishes"
      ]
    },
    safety: {
      title: "Industrial Safety Items",
      image: "assets/images/safety.png",
      description: "Keep your on-site engineering and construction personnel fully protected. We supply certified Personal Protective Equipment (PPE) complying with international OSHA rules.",
      features: [
        "Certified high-visibility safety jackets, vests, and safety glasses",
        "Heavy-duty steel-toe safety shoes, impact gloves, and protective suits",
        "Durable safety helmets, earmuffs, dust masks, and respiratory filters",
        "Site safety signs, boundary warning tapes, and cones",
        "Bulk emergency first-aid boxes and eye wash solutions"
      ]
    },
    electrical: {
      title: "Electrical Components",
      image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80",
      description: "A wide selection of commercial electrical supplies, armored distribution cables, switch boards, and components engineered for office renovations and building networks.",
      features: [
        "Single-core and multi-core armored electrical copper wiring",
        "Sleek commercial switch plates, sockets, and network data outlets",
        "Heavy-duty miniature circuit breakers (MCB) and electrical distribution boards",
        "Indoor/outdoor energy-saving LED panels and architectural spot fixtures",
        "Corrosion-resistant PVC electrical conduits, channels, and joint boxes"
      ]
    }
  };

  const detailsModal = document.getElementById('detailsModal');
  if (detailsModal) {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const modalFeatures = document.getElementById('modalFeatures');
    const modalWhatsAppBtn = document.getElementById('modalWhatsAppBtn');
    
    const closeElements = [
      document.getElementById('modalCloseBtn'),
      document.getElementById('modalCloseIcon'),
      detailsModal
    ];

    // Open Modal function
    const openModal = (targetId) => {
      const data = detailsData[targetId];
      if (!data) return;

      // Populate contents
      modalImage.src = data.image;
      modalImage.alt = data.title;
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.description;
      
      // Populate features list
      modalFeatures.innerHTML = '';
      data.features.forEach(feat => {
        const li = document.createElement('li');
        li.className = 'details-modal-feature-item';
        li.innerHTML = `
          <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${feat}</span>
        `;
        modalFeatures.appendChild(li);
      });

      // Update WhatsApp link with prefilled text
      const prefilledText = `Hello, I'm interested in inquiring about your "${data.title}" solutions. Please provide me with more details.`;
      modalWhatsAppBtn.href = `https://wa.me/97450372322?text=${encodeURIComponent(prefilledText)}`;

      // Show modal
      detailsModal.classList.add('open');
      detailsModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    // Close Modal function
    const closeModal = () => {
      detailsModal.classList.remove('open');
      detailsModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Unlock background scroll
    };

    // Add listeners to all "Read More" buttons
    document.querySelectorAll('.btn-read-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering card click actions
        const target = btn.getAttribute('data-target');
        openModal(target);
      });
    });

    // Close listeners
    closeElements.forEach(elem => {
      if (elem) {
        elem.addEventListener('click', (e) => {
          if (elem === detailsModal && e.target !== detailsModal) {
            return; // Only close if clicking overlay itself, not card
          }
          closeModal();
        });
      }
    });

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && detailsModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

/* ==================================================
   * About Us Carousel Logic
   * ================================================== */
  const aboutCarousel = document.getElementById('aboutCarousel');
  if (aboutCarousel) {
    const slides = aboutCarousel.querySelectorAll('.about-carousel-slide');
    const prevBtn = document.getElementById('aboutCarouselPrev');
    const nextBtn = document.getElementById('aboutCarouselNext');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (n) => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
    };

    const nextSlide = () => {
      showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      showSlide(currentSlide - 1);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      slideInterval = setInterval(nextSlide, 6000); // Slide every 6 seconds
    };

    const stopAutoSlide = () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    aboutCarousel.addEventListener('mouseenter', stopAutoSlide);
    aboutCarousel.addEventListener('mouseleave', startAutoSlide);

    startAutoSlide();
  }

});

// Extra dynamic highlight helper styles
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes borderFlash {
    0% { border-color: var(--border-color); box-shadow: none; }
    50% { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(255, 77, 0, 0.3); }
    100% { border-color: var(--border-color); box-shadow: none; }
  }
  .highlight-flash {
    animation: borderFlash 1s ease-in-out;
  }
`;
document.head.appendChild(styleSheet);
