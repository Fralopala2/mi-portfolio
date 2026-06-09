const ProgressState = { value: 0 };
const PRELOADER_DURATION = 4;
const PRELOADER_HOLD = 0.5;

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
        .to(".preloader-content", {
            y: -24,
            scale: 0.97,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.55,
            ease: "power2.in"
        })
        .to(".preloader-footer", {
            opacity: 0,
            y: -10,
            duration: 0.35,
            ease: "power2.in"
        }, "-=0.45")
        .to(Preloader, {
            opacity: 0,
            duration: 0.45,
            ease: "power2.inOut",
            onComplete: () => {
                Preloader.style.display = "none";

                const introTl = gsap.timeline();

                gsap.to('#displacement', { attr: { scale: 0 }, duration: 3.5, ease: "power3.out" });

                introTl
                    .to('#header', { opacity: 1, filter: "url(#distortFilter) blur(0px)", scale: 1, duration: 3.0, ease: "power3.out" })
                    .to('#navigation-bar', { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power4.out" }, "-=2.5")
                    .to('.split-char', {
                        opacity: 1,
                        duration: 0.1,
                        stagger: 0.05,
                        ease: "power2.inOut"
                    }, "-=2.2")
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

const TryCompletePreloader = () => {
    if (!preloaderPageLoaded || !preloaderProgressDone) return;
    gsap.delayedCall(PRELOADER_HOLD, FinishPreloader);
};

const StartPreloader = () => {
    const Preloader = document.getElementById("preloader");
    if (!Preloader || preloaderStarted) return;
    preloaderStarted = true;

    // Splitting text into letters for .split-text elements
    document.querySelectorAll('.split-text').forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        for (let i = 0; i < text.length; i++) {
            let span = document.createElement('div');
            span.innerText = text[i] === ' ' ? '\u00A0' : text[i];
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.classList.add('split-char');
            el.appendChild(span);
        }
    });

    // Preparar elementos para animación desde el principio
    gsap.set('#header', {display:"block", filter:"url(#distortFilter) blur(40px)", scale:1.05, opacity:0});
    gsap.set('#displacement', {attr: {scale: 50}});
    gsap.set('#navigation-content', {display:"flex"}); // Keep overlay hidden off-screen
    gsap.set('#navigation-bar', {opacity:0, y:-30, filter:"blur(10px)"});
    gsap.set('.header-content-box > div:not(.firstline)', {opacity:0, y:50, filter:"blur(15px)"});
    gsap.set('.social-media', {opacity:0, scale:0, filter:"blur(5px)"});

    gsap.set('.preloader-content', {opacity: 0, y: 36, scale: 0.96});
    gsap.set('.preloader-footer', {opacity: 0, y: 16});
    gsap.set('.preloader-logo-wrap', {scale: 0.6, rotation: -12});
    gsap.set('.preloader-percent-wrap', {opacity: 0, y: 20});

    gsap.timeline()
        .to('.preloader-content', { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out' })
        .to('.preloader-logo-wrap', { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.6)' }, '-=0.65')
        .to('.preloader-percent-wrap', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.45')
        .to('.preloader-footer', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.35');

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
$('#home-link').on('click',function(){
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
})

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
