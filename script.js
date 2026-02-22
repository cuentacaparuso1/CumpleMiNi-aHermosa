document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES ---
    const bgMusic = document.getElementById('bgMusic');
    const playlistPlayer = document.getElementById('playlist-player');
    
    // Candado
    const dial1 = document.getElementById('dial1');
    const dial2 = document.getElementById('dial2');
    const dial3 = document.getElementById('dial3');
    const btnUnlock = document.getElementById('btn-unlock');
    const lockError = document.getElementById('lock-error');

    // Navegación
    const navIcons = document.querySelectorAll('.nav-icon');
    const tabs = document.querySelectorAll('.tab');

    // --- 1. LÓGICA DEL CANDADO (Clave: 10 - 02 - 26) ---
    btnUnlock.addEventListener('click', () => {
        if (dial1.value == 10 && dial2.value == 2 && dial3.value == 26) {
            // Desbloqueado
            document.getElementById('screen-lock').classList.add('hidden');
            animarRosa();
            
            // Iniciar música
            bgMusic.volume = 0.4;
            bgMusic.play().catch(e => console.log("Auto-play bloqueado por el navegador"));
        } else {
            lockError.classList.remove('hidden');
            setTimeout(() => lockError.classList.add('hidden'), 2000);
        }
    });

    // --- 2. ANIMACIÓN DE LA ROSA ---
    function animarRosa() {
        const screenRose = document.getElementById('screen-rose');
        const theRose = document.getElementById('the-rose');
        const roseMessage = document.getElementById('rose-message');
        const btnStart = document.getElementById('btn-start-journey');

        screenRose.classList.remove('hidden');
        
        setTimeout(() => {
            theRose.innerText = '🌹';
            theRose.classList.add('bloom');
            roseMessage.classList.remove('hidden');
        }, 1500);

        setTimeout(() => {
            btnStart.classList.remove('hidden');
        }, 3500);

        btnStart.addEventListener('click', () => {
            screenRose.classList.add('hidden');
            document.getElementById('screen-hub').classList.remove('hidden');
        });
    }

    // --- 3. NAVEGACIÓN INFERIOR & CONTROL DE AUDIO ---
    navIcons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Si salimos de la pestaña de música y hay una canción sonando, la pausamos y regresamos al audio principal
            if (!playlistPlayer.paused) {
                playlistPlayer.pause();
                bgMusic.play().catch(()=>{});
                // Resetear iconos de play
                document.querySelectorAll('.s-tracks li').forEach(t => {
                    t.querySelector('.play-icon').innerText = '▶';
                    t.classList.remove('playing');
                });
            }

            navIcons.forEach(b => b.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 4. LÓGICA DE REPRODUCTOR SPOTIFY (5 CANCIONES) ---
    const tracks = document.querySelectorAll('.s-tracks li');
    let currentTrackItem = null;

    tracks.forEach(track => {
        track.addEventListener('click', function() {
            const src = this.getAttribute('data-src');
            const icon = this.querySelector('.play-icon');

            // Si tocamos la canción que ya está sonando, la pausamos
            if (currentTrackItem === this && !playlistPlayer.paused) {
                playlistPlayer.pause();
                icon.innerText = '▶';
                this.classList.remove('playing');
                // Al pausar la dedicatoria, vuelve la musica de fondo principal
                bgMusic.play().catch(()=>{});
            } else {
                // Silenciamos la música de fondo principal
                bgMusic.pause();
                
                // Reiniciamos todas las demas canciones en la lista
                tracks.forEach(t => {
                    t.querySelector('.play-icon').innerText = '▶';
                    t.classList.remove('playing');
                });
                
                // Reproducimos la nueva canción
                playlistPlayer.src = src;
                playlistPlayer.play().catch(e => console.log("Error al reproducir audio local"));
                icon.innerText = '⏸'; // Icono de pausa
                this.classList.add('playing');
                currentTrackItem = this;
            }
        });
    });

    // Cuando termina la canción de Spotify, vuelve la música de fondo
    playlistPlayer.addEventListener('ended', () => {
        if(currentTrackItem) {
            currentTrackItem.querySelector('.play-icon').innerText = '▶';
            currentTrackItem.classList.remove('playing');
        }
        bgMusic.play().catch(()=>{});
    });

    // --- 5. LÓGICA DE GALERÍA (DESBLOQUEAR CARTA) ---
    const galleryItems = document.querySelectorAll('.g-item');
    const progressBar = document.getElementById('gallery-progress');
    const photosViewedText = document.getElementById('photos-viewed');
    
    const letterLockScreen = document.getElementById('letter-lock-screen');
    const realLetter = document.getElementById('the-real-letter');

    let viewedCount = 0;
    const totalPhotos = 14;

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('viewed')) {
                item.classList.add('viewed');
                viewedCount++;
                
                photosViewedText.innerText = viewedCount;
                let percent = (viewedCount / totalPhotos) * 100;
                progressBar.style.width = percent + "%";

                if (viewedCount === totalPhotos) {
                    setTimeout(() => {
                        alert("¡Felicidades mi niña! 🤍 Has desbloqueado tu Carta Secreta. Ve a leerla.");
                        letterLockScreen.classList.add('hidden');
                        realLetter.classList.add('unlocked-letter');
                    }, 500);
                }
            }

            const img = item.querySelector('img');
            modal.classList.remove('hidden');
            modalImg.src = img.src;
        });
    });

    // Modal de Fotos
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('expanded-img');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // --- 6. PREGUNTA FINAL "ESCAPISTA" ---
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const giftBoxSection = document.getElementById('gift-box-section');
    const questionBox = document.getElementById('question-box');
    
    let moveCount = 0;

    btnYes.addEventListener('click', () => {
        questionBox.classList.add('hidden');
        giftBoxSection.classList.remove('hidden');
    });

    btnNo.addEventListener('mouseover', () => {
        if (moveCount < 6) {
            const x = Math.random() * 150 - 75; 
            const y = Math.random() * 100 - 50; 
            btnNo.style.transform = `translate(${x}px, ${y}px)`;
            moveCount++;
            
            const frases = ["¡Piénsalo bien!", "Nop", "¿Estás segura?", "Dale al Sí", "Obligada a decir Sí", "Último aviso jsjs"];
            btnNo.innerText = frases[moveCount-1];
        } else {
            btnNo.innerText = "Bueno, haz clic...";
            btnNo.addEventListener('click', () => {
                alert("¡Sabía que en el fondo querías decir que SÍ! 🤍");
                questionBox.classList.add('hidden');
                giftBoxSection.classList.remove('hidden');
            });
        }
    });

});