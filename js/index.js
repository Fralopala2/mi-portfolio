const ProgressState = { value: 0 };
const PRELOADER_DURATION = 2.0;
const PRELOADER_HOLD = 0.2;

let preloaderStarted = false;
let preloaderPageLoaded = false;
let preloaderProgressDone = false;

const StepList = [
    { limit: 20, text: "Initializing" },
    { limit: 45, text: "Loading interface" },
    { limit: 70, text: "Preparing content" },
    { limit: 95, text: "Applying transitions" },
    { limit: 100, text: "Ready" }
];

const UpdateProgress = () => {
    const ProgressText = document.getElementById("progressText");
    const ProgressFill = document.getElementById("progressFill");
    const ProgressMeta = document.getElementById("progressMeta");
    const PreloaderSteps = document.getElementById("preloaderSteps");

    const CurrentValue = Math.round(ProgressState.value);
    if (ProgressText) ProgressText.textContent = `${CurrentValue}`;
    if (ProgressFill) ProgressFill.style.width = `${CurrentValue}%`;

    const CurrentStep = StepList.find((StepItem) => CurrentValue <= StepItem.limit);
    if (CurrentStep && ProgressMeta) {
        ProgressMeta.textContent = CurrentStep.text;
    }

    if (PreloaderSteps) {
        const StepElements = PreloaderSteps.querySelectorAll(".preloader-step");
        StepElements.forEach((StepEl, Index) => {
            const StepLimit = Number(StepEl.dataset.limit);
            const PrevLimit = Index === 0 ? -1 : Number(StepElements[Index - 1].dataset.limit);

            StepEl.classList.remove("is-active", "is-done");
            if (CurrentValue > StepLimit) {
                StepEl.classList.add("is-done");
            } else if (CurrentValue > PrevLimit) {
                StepEl.classList.add("is-active");
            }
        });
    }
};

const FinishPreloader = () => {
    const Preloader = document.getElementById("preloader");
    if (!Preloader) return;

    const Timeline = gsap.timeline();
    Timeline
        .to(".preloader-card", {
            y: -24,
            scale: 0.97,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.35,
            ease: "power2.in"
        })
        .to(Preloader, {
            opacity: 0,
            duration: 0.30,
            ease: "power2.inOut",
            onComplete: () => {
                Preloader.style.display = "none";
                document.documentElement.classList.remove("preloader-active");
                document.body.classList.remove("preloader-active");

                const introTl = gsap.timeline();

                gsap.to('#displacement', { attr: { scale: 0 }, duration: 3.5, ease: "power3.out" });

                introTl
                    .to('#header', { opacity: 1, filter: "url(#distortFilter) blur(0px)", scale: 1, duration: 3.0, ease: "power3.out" })
                    .to('#navigation-bar', { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power4.out" }, "-=2.5")
                    .add(() => { initTitleMorph(); }, "-=2.0")
                    .to('.header-content-box > div:not(.firstline)', {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 1.5,
                        stagger: 0.2,
                        ease: "power3.out"
                    }, "-=1.8")
                    .to('.social-media', {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "back.out(1.5)"
                    }, "-=1.2");
            }
        }, "-=0.08");
};

/* ── Title Morph: Pacoaldev → Paco López Alarte ── */
const initTitleMorph = () => {
    const wrap = document.getElementById('titleMorph');
    const textEl = document.getElementById('titleMorphText');
    if (!wrap || !textEl) return;

    const ALIAS = 'Pacoaldev';
    const REAL  = 'Paco López Alarte';
    // Which chars in REAL get the accent color
    const COLOR_RANGE = [0, 4]; // "Paco" → indices 0-3

    // ── Read active theme color at runtime ──
    const getAccent = () => {
        const val = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent').trim();
        return val || '#c70039';
    };

    // ── Phase 1: render alias with glitch neon ──
    // Render "Pacoal" normal + "dev" in accent color
    const ALIAS_BASE = 'Pacoal';
    const ALIAS_DEV  = 'dev';
    textEl.setAttribute('data-text', ALIAS);
    textEl.innerHTML =
        `<span class="alias-base">${ALIAS_BASE}</span>` +
        `<span class="alias-dev" id="aliasDev">${ALIAS_DEV}</span>`;
    textEl.classList.add('state-alias');

    // Apply accent color to "dev" inline so it respects the current theme
    const devSpan = document.getElementById('aliasDev');
    if (devSpan) devSpan.style.color = getAccent();

    // Entrance: slide-up + fade
    gsap.fromTo(textEl,
        { opacity: 0, y: 40, filter: 'blur(12px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
    );

    // ── Phase 2: after 2s, explode & morph into real name ──
    gsap.delayedCall(2.0, () => {
        const accent = getAccent();

        // 1. Kill glitch
        textEl.classList.remove('state-alias');
        textEl.removeAttribute('data-text');

        // 2. Shockwave ring
        const ring = document.createElement('div');
        ring.className = 'title-shockwave';
        wrap.appendChild(ring);
        setTimeout(() => ring.remove(), 700);

        // 3. Particle burst — mix accent with complementary colors
        const particles = [accent, accent, accent, '#ffffff', 'rgba(255,255,255,0.6)'];
        for (let i = 0; i < 18; i++) {
            const p = document.createElement('div');
            p.className = 'title-particle';
            p.style.background = particles[i % particles.length];
            wrap.appendChild(p);
            const angle = (i / 18) * Math.PI * 2;
            const dist  = 60 + Math.random() * 80;
            gsap.to(p, {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist - 20,
                opacity: 0,
                scale: Math.random() * 1.5 + 0.5,
                duration: 0.6 + Math.random() * 0.4,
                ease: 'power2.out',
                onComplete: () => p.remove()
            });
        }

        // 4. Scatter current chars outward
        const aliasChars = ALIAS.split('');
        textEl.innerHTML = aliasChars.map(c => `<span class="char">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
        const charEls = textEl.querySelectorAll('.char');

        charEls.forEach((ch, i) => {
            const angle  = ((i / aliasChars.length) * Math.PI * 2) - Math.PI / 2;
            const radius = 80 + Math.random() * 60;
            gsap.to(ch, {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                rotation: (Math.random() - 0.5) * 720,
                opacity: 0,
                scale: 0,
                duration: 0.45,
                ease: 'power3.in',
                delay: i * 0.03
            });
        });

        // 5. After scatter, rebuild as real name char-by-char
        // Characters are wrapped in word-groups (white-space:nowrap) so the
        // browser only breaks between words, never mid-word or mid-char.
        setTimeout(() => {
            textEl.innerHTML = '';
            textEl.classList.add('state-real');

            // Split REAL into words, track global char index for color range
            const words = REAL.split(' ');
            let globalIdx = 0;

            words.forEach((word, wIdx) => {
                // Wrapper keeps the word unbreakable
                const wordWrap = document.createElement('span');
                wordWrap.className = 'char-word';

                word.split('').forEach(c => {
                    const i = globalIdx;
                    const span = document.createElement('span');
                    span.className = 'char' + (i < COLOR_RANGE[1] ? ' char-color' : '');
                    span.textContent = c;
                    if (i < COLOR_RANGE[1]) {
                        span.style.color = accent;
                    }
                    wordWrap.appendChild(span);

                    gsap.fromTo(span,
                        {
                            opacity: 0,
                            y: -50 + Math.random() * -40,
                            x: (Math.random() - 0.5) * 60,
                            rotation: (Math.random() - 0.5) * 180,
                            scale: 0.2,
                            filter: 'blur(6px)'
                        },
                        {
                            opacity: 1,
                            y: 0,
                            x: 0,
                            rotation: 0,
                            scale: 1,
                            filter: 'blur(0px)',
                            duration: 0.6,
                            delay: 0.05 + i * 0.045,
                            ease: 'back.out(1.8)'
                        }
                    );
                    globalIdx++;
                });

                textEl.appendChild(wordWrap);

                // Add a space span between words (not at the end)
                if (wIdx < words.length - 1) {
                    const space = document.createElement('span');
                    space.className = 'char char-space';
                    space.textContent = '\u00A0';
                    textEl.appendChild(space);
                    globalIdx++; // count the space in global index
                }
            });

            // 6. After all chars land, shimmer sweep
            const totalChars = REAL.replace(/ /g, '').length;
            setTimeout(() => {
                textEl.classList.add('state-shimmer');
                setTimeout(() => textEl.classList.remove('state-shimmer'), 1400);
            }, totalChars * 45 + 300);

        }, aliasChars.length * 30 + 500);
    });
};


const TryCompletePreloader = () => {
    if (!preloaderPageLoaded || !preloaderProgressDone) return;
    gsap.delayedCall(PRELOADER_HOLD, FinishPreloader);
};

const StartPreloader = () => {
    const Preloader = document.getElementById("preloader");
    if (!Preloader || preloaderStarted) return;
    preloaderStarted = true;

    document.documentElement.classList.add("preloader-active");
    document.body.classList.add("preloader-active");

    // Preparar elementos para animación desde el principio
    gsap.set('#header', {display:"block", filter:"url(#distortFilter) blur(40px)", scale:1.05, opacity:0});
    gsap.set('#displacement', {attr: {scale: 50}});
    gsap.set('#navigation-content', {display:"flex"}); // Keep overlay hidden off-screen
    gsap.set('#navigation-bar', {opacity:0, y:-30, filter:"blur(10px)"});
    gsap.set('.header-content-box > div:not(.firstline)', {opacity:0, y:50, filter:"blur(15px)"});
    gsap.set('.social-media', {opacity:0, scale:0, filter:"blur(5px)"});

    gsap.set('.preloader-card', { opacity: 0, y: 36, scale: 0.96, transformOrigin: 'center center' });
    gsap.set('.preloader-logo-wrap', { scale: 0.6, rotation: -12, transformOrigin: 'center center' });
    gsap.set('.preloader-percent-wrap', { opacity: 0, y: 20 });

    gsap.timeline()
        .to('.preloader-card', { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' })
        .to('.preloader-logo-wrap', { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.65')
        .to('.preloader-percent-wrap', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45');

    gsap.to('.preloader-logo-ring--inner', {
        rotation: 360,
        duration: 2.2,
        ease: 'none',
        repeat: -1
    });
    gsap.to('.preloader-logo-ring--outer', {
        rotation: -360,
        duration: 3.6,
        ease: 'none',
        repeat: -1
    });
    gsap.to('.preloader-logo-orbit', {
        rotation: 360,
        duration: 2.8,
        ease: 'none',
        repeat: -1
    });
    gsap.to('.preloader-logo', {
        scale: 1.06,
        duration: 1.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1
    });

    gsap.to(ProgressState, {
        value: 100,
        duration: PRELOADER_DURATION,
        ease: "none",
        onUpdate: UpdateProgress,
        onComplete: () => {
            preloaderProgressDone = true;
            TryCompletePreloader();
        }
    });
};

$(function () {
    StartPreloader();
});

$(window).on('load', function () {
    preloaderPageLoaded = true;
    TryCompletePreloader();
});
$(function(){
  $('.color-panel').on("click",function(e) {
    e.preventDefault();
    $('.color-changer').toggleClass('color-changer-active');
});
$('.colors a').on("click",function(e) {
  e.preventDefault();
  var attr = $(this).attr("title");
  console.log(attr);
  $('head').append('<link rel="stylesheet" href="css/'+attr+'.css">');
});
});
$(function(){
     $('.menubar').on('click',function(){
         gsap.to('#navigation-content',.6,{y:0});
     })
     $('.navigation-close').on('click',function(){
        gsap.to('#navigation-content',.6,{y:"-100%"});
    });
   }); 

$(function(){
    var TxtRotate = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
      };
      
      TxtRotate.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];
      
        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
      
        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
      
        var that = this;
        var delta = 200 - Math.random() * 100;
      
        if (this.isDeleting) { delta /= 2; }
      
        if (!this.isDeleting && this.txt === fullTxt) {
          delta = this.period;
          this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
          this.isDeleting = false;
          this.loopNum++;
          delta = 100;
        }
      
        setTimeout(function() {
          that.tick();
        }, delta);
      };
      
      window.onload = function() {
        var elements = document.getElementsByClassName('txt-rotate');
        for (var i=0; i<elements.length; i++) {
          var toRotate = elements[i].getAttribute('data-rotate');
          var period = elements[i].getAttribute('data-period');
          if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
          }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".txt-rotate > .wrap { border-right: 0em solid #666 ; }";
        document.body.appendChild(css);
      };
})
$(function(){

    $('#about-link').on('click',function(){
      gsap.to('#navigation-content',0,{display:"none",delay:.7});
      gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
  gsap.to('#header',0,{display:"none"});
gsap.to('#portfolio',0,{display:"none"});
   gsap.to('#breaker',0,{display:"block"});
   gsap.to('#breaker-two',0,{display:"block",delay:.1});
gsap.to('#contact',0,{display:"none"});
   gsap.to('#breaker',0,{display:"none",delay:2});
   gsap.to('#breaker-two',0,{display:"none",delay:2});
   gsap.to('#about',0,{display:"block",delay:.7});
   gsap.to('#navigation-content',0,{display:'flex',delay:2});
 })
 $('#contact-link').on('click',function(){
   gsap.to('#navigation-content',0,{display:"none",delay:.7});
   gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
gsap.to('#header',0,{display:"none"});
gsap.to('#about',0,{display:"none"});
gsap.to('#portfolio',0,{display:"none"});
gsap.to('#breaker',0,{display:"block"});
gsap.to('#breaker-two',0,{display:"block",delay:.1});
gsap.to('#breaker',0,{display:"none",delay:2});
gsap.to('#breaker-two',0,{display:"none",delay:2});
gsap.to('#contact',0,{display:"block",delay:.7});
gsap.to('#navigation-content',0,{display:'flex',delay:2});
})
$('#portfolio-link').on('click',function(){
  gsap.to('#navigation-content',0,{display:"none",delay:.7});
  gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
gsap.to('#header',0,{display:"none"});
gsap.to('#about',0,{display:"none"});
gsap.to('#contact',0,{display:"none"});
gsap.to('#breaker',0,{display:"block"});
gsap.to('#breaker-two',0,{display:"block",delay:.1});
gsap.to('#breaker',0,{display:"none",delay:2});
gsap.to('#breaker-two',0,{display:"none",delay:2});
gsap.to('#portfolio',0,{display:"block",delay:.7});
gsap.to('#navigation-content',0,{display:'flex',delay:2});
})
const goToHome = (Event) => {
  if (Event) Event.preventDefault();
  gsap.to('#navigation-content',0,{display:"none",delay:.7});
  gsap.to('#navigation-content',0,{y:'-100%',delay:.7});
  gsap.to('#header',0,{display:"none"});
  gsap.to('#about',0,{display:"none"});
  gsap.to('#portfolio',0,{display:"none"});
  gsap.to('#contact',0,{display:"none"});
  gsap.to('#breaker',0,{display:"block"});
  gsap.to('#breaker-two',0,{display:"block",delay:.1});
  gsap.to('#breaker',0,{display:"none",delay:2});
  gsap.to('#breaker-two',0,{display:"none",delay:2});
  gsap.to('#header',0,{display:"block",delay:.7});
  gsap.to('#navigation-content',0,{display:'flex',delay:2});
};

$('#home-link, .js-home-link').on('click', goToHome);

})
$(function(){
 var body =  document.querySelector('body');
 var $cursor = $('.cursor')
   function cursormover(e){
    
    gsap.to( $cursor, {
      x : e.clientX ,
      y : e.clientY,
      stagger:.002
     })
   }
   function cursorhover(e){
    gsap.to( $cursor,{
     scale:1.4,
     opacity:1
    })
    
  }
  function cursor(e){
    gsap.to( $cursor, {
     scale:1,
     opacity:.6
    }) 
  }
  $(window).on('mousemove',cursormover);
  $('.menubar').hover(cursorhover,cursor);
  $('a').hover(cursorhover,cursor);
  $('.navigation-close').hover(cursorhover,cursor);

})
// EmailJS Configuration and Form Handling
$(document).ready(function() {
    // Initialize EmailJS
    emailjs.init("zmJ9i6ZXtACzNV-m-"); // Reemplaza con tu Public Key de EmailJS
    
    // Handle form submission
    $('#myForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            from_name: $('#name').val(),
            from_email: $('#email').val(),
            subject: $('#subject').val(),
            message: $('#body').val()
        };
        
        // Validate required fields
        if (!formData.from_name || !formData.from_email || !formData.subject || !formData.message) {
            alert('Por favor, rellena todos los campos.');
            return;
        }
        
        // Show loading state
        $('#submit-text').hide();
        $('#submit-loading').show();
        $('#submit').prop('disabled', true);
        
        // Send email using EmailJS
        // Reemplaza 'TU_SERVICE_ID' y 'TU_TEMPLATE_ID' con tus IDs reales
        emailjs.send('service_wr0980j', 'template_gprtd4d', formData)
            .then(function(response) {
                console.log('Email sent successfully!', response.status, response.text);
                
                // Success message
                alert('¡Mensaje enviado con éxito! Te responderé pronto.');
                
                // Reset form
                $('#myForm')[0].reset();
                
            }, function(error) {
                console.log('Failed to send email:', error);
                alert('Error al enviar el mensaje. Por favor, intenta de nuevo o contacta directamente por email.');
            })
            .finally(function() {
                // Reset button state
                $('#submit-text').show();
                $('#submit-loading').hide();
                $('#submit').prop('disabled', false);
            });
    });
});

// Toggle mute/unmute for About video
$(function() {
    $('#mute-toggle').on('click', function() {
        var video = $('#about-video')[0];
        if (video) {
            video.muted = !video.muted;
            $(this).toggleClass('unmuted', !video.muted);
        }
    });
});
