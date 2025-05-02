document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initScrollEffects();
    initSpotifyWidget();
    initThemeSystem();
});

function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    mobileMenuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });
    
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function initScrollEffects() {
    const revealItems = document.querySelectorAll('.reveal-item, .reveal-text');
    
    function revealOnScroll() {
        for (let i = 0; i < revealItems.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = revealItems[i].getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                revealItems[i].classList.add('revealed');
            }
        }
    }
    
    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll);
}

function initThemeSystem() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const themeOptions = document.querySelectorAll('#theme-menu li');
    
    // Make sure elements exist
    if (!themeToggle || !themeMenu) {
        console.error('Theme toggle elements not found');
        return;
    }
    
    // Force proper CSS positioning of theme menu
    if (themeMenu.parentElement) {
        themeMenu.parentElement.style.position = 'relative';
    }
    
    // Set proper initial style for theme menu
    themeMenu.style.position = 'absolute';
    themeMenu.style.top = '100%';
    themeMenu.style.right = '0';
    themeMenu.style.width = '200px';
    themeMenu.style.backgroundColor = '#1a1a1a';
    themeMenu.style.borderRadius = '5px';
    themeMenu.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    themeMenu.style.zIndex = '100';
    themeMenu.style.display = 'none';
    
    themeToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle menu visibility
        if (themeMenu.style.display === 'none' || !themeMenu.classList.contains('active')) {
            themeMenu.style.display = 'block';
            themeMenu.classList.add('active');
        } else {
            themeMenu.style.display = 'none';
            themeMenu.classList.remove('active');
        }
    });

    document.addEventListener('click', function(e) {
        if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) {
            themeMenu.style.display = 'none';
            themeMenu.classList.remove('active');
        }
    });
    
    themeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const theme = this.getAttribute('data-theme');
            
            document.body.className = '';
            document.body.classList.add(`theme-${theme}`);
            
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            localStorage.setItem('selectedTheme', theme);
            themeMenu.style.display = 'none';
            themeMenu.classList.remove('active');
        });
    });
    
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.body.className = '';
        document.body.classList.add(`theme-${savedTheme}`);
        
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === savedTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    if (window.innerWidth <= 768) {
        const isMobileThemeShown = sessionStorage.getItem('mobileThemeShown');
        if (!isMobileThemeShown) {
            setTimeout(() => {
                document.getElementById('main-nav').classList.add('active');
                themeMenu.classList.add('active');
                themeMenu.style.display = 'block';
                sessionStorage.setItem('mobileThemeShown', 'true');
            }, 100);
        }
    }
}

function applyTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('selectedTheme', theme);
}

function initSpotifyWidget() {
    const DISCORD_ID = "1208873410386722899";
    const LANYARD_API = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`;
    const LANYARD_SOCKET = "wss://api.lanyard.rest/socket";
    const SPOTIFY_URL_BASE = "https://open.spotify.com";

    const widget = document.getElementById("spotify-widget");
    const statusText = document.getElementById("spotify-status");
    const albumArt = document.getElementById("album-art");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const songAlbum = document.getElementById("song-album");
    const progressFill = document.getElementById("progress-fill");
    const currentTime = document.getElementById("current-time");
    const totalTime = document.getElementById("total-time");
    
    statusText.textContent = "Landen is not listening to Spotify at this point.";
    widget.querySelector('.widget-content').style.display = "none";
    widget.querySelector('.progress-container').style.display = "none";

    let spotifyData = null;
    let progressAnimationId = null;

    function formatTime(ms) {
        if (!ms) return "0:00";
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function getSpotifyUrls(data) {
        if (!data || !data.spotify) return { track: null, artist: null, album: null };
        
        const trackId = data.spotify.track_id;
        const trackUrl = `${SPOTIFY_URL_BASE}/track/${trackId}`;
        
        let artistUrl = null;
        if (data.spotify.artist_id) {
            artistUrl = `${SPOTIFY_URL_BASE}/artist/${data.spotify.artist_id}`;
        }
        
        let albumUrl = null;
        if (data.spotify.album_id) {
            albumUrl = `${SPOTIFY_URL_BASE}/album/${data.spotify.album_id}`;
        }
        
        return { 
            track: trackUrl, 
            artist: artistUrl || trackUrl, 
            album: albumUrl || trackUrl 
        };
    }

    function updatePlayer(data) {
        if (progressAnimationId) {
            cancelAnimationFrame(progressAnimationId);
            progressAnimationId = null;
        }

        spotifyData = data;
        const isPlaying = data && data.spotify && data.spotify.timestamps;
        
        if (!isPlaying) {
            statusText.textContent = "Landen is not listening to Spotify at this point.";
            widget.style.display = "block";
            widget.querySelector('.widget-content').style.display = "none";
            widget.querySelector('.progress-container').style.display = "none";
            return;
        }

        statusText.textContent = "Landen is currently listening to:";
        widget.style.display = "block";
        widget.querySelector('.widget-content').style.display = "flex";
        widget.querySelector('.progress-container').style.display = "block";
        
        const spotifyUrls = getSpotifyUrls(data);
        
        songTitle.textContent = data.spotify.song;
        songTitle.href = spotifyUrls.track;
        
        songArtist.textContent = `By ${data.spotify.artist}`;
        songArtist.href = spotifyUrls.artist;
        
        songAlbum.textContent = `On ${data.spotify.album}`;
        songAlbum.href = spotifyUrls.album;

        if (data.spotify.album_art_url) {
            albumArt.src = data.spotify.album_art_url;
            albumArt.onclick = function() {
                window.open(spotifyUrls.album || spotifyUrls.track, '_blank');
            };
            albumArt.style.cursor = 'pointer';
        } else {
            albumArt.src = "/api/placeholder/48/48";
            albumArt.style.cursor = 'default';
        }

        updateProgress();
    }

    function updateProgress() {
        if (!spotifyData || !spotifyData.spotify || !spotifyData.spotify.timestamps) return;
        
        const now = Date.now();
        const start = spotifyData.spotify.timestamps.start;
        const end = spotifyData.spotify.timestamps.end;
        
        const duration = end - start;
        const elapsed = now - start;
        const progress = Math.min(100, Math.max(0, (elapsed / duration) * 100));
        
        progressFill.style.width = `${progress}%`;
        
        currentTime.textContent = formatTime(elapsed);
        totalTime.textContent = formatTime(duration);
        
        if (now < end) {
            progressAnimationId = requestAnimationFrame(updateProgress);
        }
    }

    function fetchLanyardData() {
        fetch(LANYARD_API)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    updatePlayer(result.data);
                } else {
                    statusText.textContent = "Landen is not listening to Spotify at this point.";
                    widget.style.display = "block";
                    widget.querySelector('.widget-content').style.display = "none";
                    widget.querySelector('.progress-container').style.display = "none";
                }
            })
            .catch(error => {
                console.error("Error fetching Lanyard data:", error);
                widget.style.display = "none";
            });
    }

    function connectWebSocket() {
        const socket = new WebSocket(LANYARD_SOCKET);
        let heartbeatInterval;

        socket.onopen = () => {
            socket.send(JSON.stringify({
                op: 2,
                d: {
                    subscribe_to_ids: [DISCORD_ID]
                }
            }));
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            switch (data.op) {
                case 1:
                    heartbeatInterval = setInterval(() => {
                        socket.send(JSON.stringify({ op: 3 }));
                    }, data.d.heartbeat_interval);
                    break;
                
                case 0:
                    if (data.t === "INIT_STATE" || data.t === "PRESENCE_UPDATE") {
                        if (data.d[DISCORD_ID]) {
                            const currentData = data.d[DISCORD_ID];
                            
                            const isSpotifyActive = currentData && 
                                                   currentData.spotify && 
                                                   currentData.spotify.timestamps;
                            
                            const hasSpotifyChanged = !spotifyData || 
                                                     !spotifyData.spotify ||
                                                     !currentData.spotify ||
                                                     currentData.spotify.track_id !== spotifyData.spotify.track_id ||
                                                     isSpotifyActive !== (!!spotifyData.spotify?.timestamps);
                            
                            if (hasSpotifyChanged) {
                                updatePlayer(currentData);
                            }
                        }
                    }
                    break;
            }
        };

        socket.onclose = () => {
            clearInterval(heartbeatInterval);
            setTimeout(connectWebSocket, 500);
        };

        socket.onerror = (error) => {
            socket.close();
        };
    }

    fetchLanyardData();
    connectWebSocket();
}