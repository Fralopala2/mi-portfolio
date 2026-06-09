const ProgressState = { value: 0 };
const StepList = [
    { limit: 20, text: "Inicializando" },
    { limit: 45, text: "Cargando interfaz" },
    { limit: 70, text: "Preparando contenido" },
    { limit: 95, text: "Aplicando transiciones" },
    { limit: 100, text: "Listo" }
];

const UpdateProgress = () => {
    const ProgressText = document.getElementById("progressText");
    const ProgressFill = document.getElementById("progressFill");
    const ProgressMeta = document.getElementById("progressMeta");

    const CurrentValue = Math.round(ProgressState.value);
    if(ProgressText) ProgressText.textContent = `${CurrentValue}%`;
    if(ProgressFill) ProgressFill.style.width = `${CurrentValue}%`;

    const CurrentStep = StepList.find((StepItem) => CurrentValue <= StepItem.limit);
    if (CurrentStep && ProgressMeta) {
        ProgressMeta.textContent = CurrentStep.text;
    }
};

const StartPreloader = () => {
    const Preloader = document.getElementById("preloader");
    if(!Preloader) return;

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

    gsap.to(ProgressState, {
        value: 100,
        duration: 4.5,
        ease: "power2.out",
        onUpdate: UpdateProgress,
        onComplete: () => {
            const Timeline = gsap.timeline();
            Timeline
                .to(".preloaderPanel", {
                    y: -18,
                    opacity: 0,
                    duration: 0.55,
                    ease: "power2.in"
                })
                .to(Preloader, {
                    opacity: 0,
                    duration: 0.45,
                    ease: "power2.inOut",
                    onComplete: () => {
                        Preloader.style.display = "none";
                        

                        const introTl = gsap.timeline();
                        
                        // Animate displacement scale to 0
                        gsap.to('#displacement', {attr: {scale: 0}, duration: 3.5, ease: "power3.out"});

                        introTl
                            .to('#header', {opacity:1, filter:"url(#distortFilter) blur(0px)", scale:1, duration:3.0, ease:"power3.out"})
                            .to('#navigation-bar', {opacity:1, y:0, filter:"blur(0px)", duration:1.5, ease:"power4.out"}, "-=2.5")
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
        }
    });
};

$(window).on('load',function(){
    StartPreloader();
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