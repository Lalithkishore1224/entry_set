// Horizontal Scroll Logic
const hsTrigger = document.getElementById('hs-trigger');
const hsRow = document.querySelector('.hs-row');
const cards = document.querySelectorAll('.ind-card');
const curIdxSpan = document.getElementById('cur-idx');
const heroSec = document.getElementById('home');
const stickySec = document.querySelector('.hs-sticky');

const TOTAL_CARDS = cards.length;
const SCROLL_SPEED = window.innerHeight * 1.0; // 1 screen per card exactly
const resourcesSec = document.getElementById('resources');

if (resourcesSec) {
    // Height = cards + 1 to give the final card 1 full screen to be viewed before unsticking
    resourcesSec.style.height = `${(TOTAL_CARDS + 1) * SCROLL_SPEED}px`;
}
const galleryDots = document.getElementById('gallery-dots');

// Initialize dots
if (galleryDots) {
    galleryDots.innerHTML = '';
    for (let i = 0; i < TOTAL_CARDS; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        galleryDots.appendChild(dot);
    }
}

function updateHorizontalScroll() {
    if (!hsTrigger || !hsRow) return;
    
    const trigTop = hsTrigger.getBoundingClientRect().top + window.scrollY;
    const into = window.scrollY - trigTop;
    
    // 2D Stack Animation (Hero to Gallery)
    const wh = window.innerHeight;
    const stackTrigTop = hsTrigger.getBoundingClientRect().top;
    let stackProg = (wh - stackTrigTop) / wh;

    if (stackProg <= 0) {
        heroSec.style.transform = `scale(1) rotateZ(0deg)`;
        heroSec.style.opacity = 1;
        stickySec.style.transform = `scale(0.8) rotateZ(5deg)`;
        stickySec.style.borderRadius = `30px`;
    } else if (stackProg >= 1) {
        heroSec.style.transform = `scale(0.8) rotateZ(-5deg)`;
        heroSec.style.opacity = 0; // Fade out completely when gallery is full
        stickySec.style.transform = `none`;
        stickySec.style.borderRadius = `0px`;
    } else {
        const heroScale = 1 - (0.2 * stackProg);
        const heroRot = 0 - (5 * stackProg);
        heroSec.style.transform = `scale(${heroScale}) rotateZ(${heroRot}deg)`;
        heroSec.style.opacity = 1 - (stackProg);

        const cardsScale = 0.8 + (0.2 * stackProg);
        const cardsRot = 5 - (5 * stackProg);
        stickySec.style.transform = `scale(${cardsScale}) rotateZ(${cardsRot}deg)`;
        stickySec.style.borderRadius = `${30 - (30 * stackProg)}px`;
    }

    if (into < 0) return;

    const progress = into / SCROLL_SPEED;
    const activeIdx = Math.min(Math.floor(progress), TOTAL_CARDS - 1);
    
    // Horizontal Translation
    const cardWidth = cards[0].offsetWidth + (window.innerWidth * 0.05); // card + margin
    const xOffset = -(activeIdx * cardWidth);
    hsRow.style.transform = `translateX(${xOffset}px)`;
    
    // Update active class and counter
    cards.forEach((card, i) => {
        if (i === activeIdx) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    if (galleryDots) {
        const dots = galleryDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            if (i === activeIdx) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    if (curIdxSpan) curIdxSpan.innerText = (activeIdx + 1).toString().padStart(2, '0');
}

window.addEventListener('scroll', updateHorizontalScroll, { passive: true });

// Intro Falling Animation

// Intro Falling Animation
const introOverlay = document.getElementById('intro-overlay');
const introImages = [
    '7-removebg-preview.png',
    '2-removebg-preview.png',
    '1-removebg-preview.png',
    '9-removebg-preview.png'
];

function createFallingCat() {
    const cat = document.createElement('div');
    cat.className = 'falling-cat';
    const randomImg = introImages[Math.floor(Math.random() * introImages.length)];
    cat.style.backgroundImage = `url('${randomImg}')`;
    
    // Random position and animation properties
    const left = Math.random() * 100;
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 2;
    const size = 100 + Math.random() * 150;

    cat.style.left = left + '%';
    cat.style.width = size + 'px';
    cat.style.height = size + 'px';
    cat.style.animation = `fall ${duration}s linear ${delay}s forwards`;

    introOverlay.appendChild(cat);
}

// Generate 40 falling cats
for (let i = 0; i < 40; i++) {
    createFallingCat();
}

// Remove overlay after animation
setTimeout(() => {
    introOverlay.style.opacity = '0';
    setTimeout(() => {
        introOverlay.remove();
    }, 1000);
}, 4000);

// Custom Cursor Logic
const cursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Cursor hover effect
document.querySelectorAll('a, button, .resource-card, .transformation-wrapper').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.filter = 'drop-shadow(0 0 10px var(--accent-purple))';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.filter = 'none';
    });
});

// Scroll Reveal Logic
const reveals = document.querySelectorAll('.reveal');

function reveal() {
    reveals.forEach(windowReveal => {
        const windowHeight = window.innerHeight;
        const revealTop = windowReveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            windowReveal.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal(); // Initial check

// Custom Video Player Logic
const initPlayers = () => {
    document.querySelectorAll('.custom-player').forEach(player => {
    const video = player.querySelector('.main-video');
    const playCenteredBtn = player.querySelector('.play-centered');
    const playPauseBtn = player.querySelector('.play-pause');
    const clickCapture = player.querySelector('.video-click-capture');
    const progressBar = player.querySelector('.progress-bar');
    const progressArea = player.querySelector('.progress-area');
    const timerCurrent = player.querySelector('.timer .current');
    const timerDuration = player.querySelector('.timer .duration');
    const volumeBtn = player.querySelector('.volume');
    const fullscreenBtn = player.querySelector('.fullscreen');

    // Set initial state
    player.classList.add('paused');

    const formatTime = (time) => {
        let min = Math.floor(time / 60);
        let sec = Math.floor(time % 60);
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    video.addEventListener('loadedmetadata', () => {
        timerDuration.innerText = formatTime(video.duration);
    });

    const togglePlay = () => {
        console.log("Video action triggered for:", video.src);
        if (video.paused) {
            video.play().then(() => {
                console.log("Playback started successfully");
                player.classList.add('playing');
                player.classList.remove('paused');
                playPauseBtn.querySelector('i').innerText = 'pause';
            }).catch(err => {
                console.error("Playback failed:", err);
            });
        } else {
            video.pause();
            console.log("Video paused");
            player.classList.add('paused');
            player.classList.remove('playing');
            playPauseBtn.querySelector('i').innerText = 'play_arrow';
        }
    };

    playPauseBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    playCenteredBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    if (clickCapture) clickCapture.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    video.addEventListener('click', togglePlay);

    video.addEventListener('timeupdate', (e) => {
        let current = e.target.currentTime;
        let duration = e.target.duration;
        let percent = (current / duration) * 100;
        progressBar.style.width = `${percent}%`;
        timerCurrent.innerText = formatTime(current);
    });

    progressArea.addEventListener('click', (e) => {
        let videoDuration = video.duration;
        let progressWidthVal = progressArea.clientWidth;
        let clickedOffsetX = e.offsetX;
        video.currentTime = (clickedOffsetX / progressWidthVal) * videoDuration;
    });

    volumeBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        volumeBtn.querySelector('i').innerText = video.muted ? 'volume_off' : 'volume_up';
    });

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            player.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    video.addEventListener('ended', () => {
        player.classList.remove('playing');
        player.classList.add('paused');
        playPauseBtn.querySelector('i').innerText = 'play_arrow';
        progressBar.style.width = '0%';
    });
});
};

initPlayers();

// Interactive Arrows Logic
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

if (leftArrow && rightArrow) {
    leftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const trigTop = hsTrigger.getBoundingClientRect().top + window.scrollY;
        const into = window.scrollY - trigTop;
        const progress = into / SCROLL_SPEED;
        
        if (progress > 0) {
            window.scrollBy({ top: -SCROLL_SPEED, behavior: 'smooth' });
        }
    });
    rightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const trigTop = hsTrigger.getBoundingClientRect().top + window.scrollY;
        const into = window.scrollY - trigTop;
        const progress = into / SCROLL_SPEED;
        const activeIdx = Math.min(Math.floor(progress), TOTAL_CARDS - 1);
        
        if (activeIdx < TOTAL_CARDS - 1) {
            window.scrollBy({ top: SCROLL_SPEED, behavior: 'smooth' });
        }
    });
}

window.openLightbox = function(imgSrc) {
    console.log("Global Open Lightbox:", imgSrc);
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const downloadLink = document.getElementById('download-link');
    
    if (lightbox && lightboxImg && downloadLink) {
        lightboxImg.setAttribute('src', imgSrc);
        downloadLink.setAttribute('href', imgSrc);
        lightbox.classList.add('active');
        lightbox.style.display = 'flex'; // Force display
        document.body.style.overflow = 'hidden';
    }
};

if (document.querySelector('.close-lightbox')) {
    document.querySelector('.close-lightbox').addEventListener('click', () => {
        const lightbox = document.getElementById('lightbox');
        lightbox.classList.remove('active');
        lightbox.style.display = 'none'; // Force hide
        document.body.style.overflow = 'auto';
    });
}

if (document.getElementById('lightbox')) {
    document.getElementById('lightbox').addEventListener('click', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            lightbox.style.display = 'none'; // Force hide
            document.body.style.overflow = 'auto';
        }
    });
}

// AI Roast Logic
const roasts = [
    "Error 404: Feline brain cells not found.",
    "Scanning complete: 99% Cat, 1% Confusion.",
    "This posture indicates a severe lack of treats.",
    "AI Analysis: This man has definitely spoken to a wall today.",
    "Legend says he still thinks he can climb curtains.",
    "Optimal roasting temperature reached: 450°F.",
    "Subi.exe has stopped working. Please insert catnip.",
    "Warning: High levels of sass detected in this image.",
    "The AI suggests a career change to full-time napping.",
    "Is this a human or a very large ginger cat in a costume?"
];

function roastMe(element) {
    const overlay = element.querySelector('.roast-overlay');
    const text = element.querySelector('.roast-text');
    
    if (element.classList.contains('roasted')) {
        element.classList.remove('roasted');
    } else {
        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
        text.innerText = randomRoast;
        element.classList.add('roasted');
        
        // Auto remove roast after 5 seconds
        setTimeout(() => {
            element.classList.remove('roasted');
        }, 5000);
    }
}

// Birthday Countdown Logic
// Setting a dummy date: Dec 31, 2026
const birthday = new Date("Apr 18, 2027 00:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = birthday - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days.toString().padStart(2, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.querySelector(".countdown-container").innerHTML = "<h3>HAPPY BIRTHDAY CAT MAN!</h3>";
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Reminder Notification
function setReminder() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                alert("Birthday Reminder Set! We'll notify you when the Cat Man reaches his final form.");
                new Notification("Subi: The Cat Man", {
                    body: "Reminder successfully set. Prepare the catnip.",
                    icon: "9-removebg-preview.png"
                });
            } else {
                alert("Permission denied. You'll have to remember his birthday manually like a common human.");
            }
        });
    } else {
        alert("Your browser doesn't support notifications. Use a better one, Subi.");
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
