const apiURL = 'https://mp3quran.net/api/v3';
const language = 'Ar';

async function getReciters() {
    const chooseReciters = document.querySelector('#chooseReciter');
    const res = await fetch(`${apiURL}/reciters`);
    const data = await res.json();
    let options = '<option value="">اختر القارئ</option>';
    data.reciters.forEach(reciter => {
        options += `<option value="${reciter.id}">${reciter.name}</option>`;
    });
    chooseReciters.innerHTML = options;
    chooseReciters.addEventListener('change', e => getMoshaf(e.target.value));
}
getReciters();

async function getMoshaf(reciter) {
    const choosemoshaf = document.querySelector('#choosemoshaf');
    const res = await fetch(`${apiURL}/reciters?language=${language}&reciter=${reciter}`);
    const data = await res.json();

    const moshafs = data.reciters[0].moshaf;
    let options = '<option value="" data-server="" data-surahlist="">اختر مصحف</option>';
    moshafs.forEach(moshaf => {
        options += `<option 
        value="${moshaf.id}"
        data-server="${moshaf.server}"
        data-surahlist="${moshaf.surah_list}"
        >${moshaf.name}</option>`;
    });
    choosemoshaf.innerHTML = options;

    choosemoshaf.addEventListener('change', e => {
        const selectedMoshaf = choosemoshaf.options[choosemoshaf.selectedIndex];
        const surahServer = selectedMoshaf.dataset.server;
        const surahList = selectedMoshaf.dataset.surahlist;
        getSurah(surahServer, surahList);
    });
}

async function getSurah(surahServer, surahList) {
    const choosesurah = document.querySelector('#choosesurah');
    console.log(surahServer);
    const res = await fetch(`${apiURL}/suwar`);
    const data = await res.json();
    const surahNames = data.suwar;
    surahList = surahList.split(',');
    let options = '<option value="">اختر سورة</option>';
    surahList.forEach(surah => {
        const paddedSurah = surah.padStart(3, '0');
        surahNames.forEach(surahName => {
            if (surahName.id == surah) {
                options += `<option value="${surahServer}${paddedSurah}.mp3">${surahName.name}</option>`;
            }
        });
    });
    choosesurah.innerHTML = options;

    choosesurah.addEventListener('change', e => {
        const selectedSurah = choosesurah.options[choosesurah.selectedIndex].value;
        console.log(selectedSurah);
        playsurah(selectedSurah);
    });
}

function playsurah(surahMp3){
    const audio = document.querySelector('#audioplayer');
    audio.src = surahMp3;
    audio.play();
}
function playlive(channel) {
    if (Hls.isSupported()) {
        var video = document.getElementById('video');

        // Destroy any existing Hls instance before creating a new one
        if (video.hls) {
            video.hls.destroy();
        }

        var hls = new Hls();
        video.hls = hls; // Store the instance in the video element for potential cleanup later

        hls.loadSource(channel);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });

        hls.on(Hls.Events.ERROR, function(event, data) {
            console.error('HLS error:', data);
        });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For browsers that support HLS natively (like Safari)
        video.src = channel;
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    } else {
        console.error('HLS not supported in this browser');
    }
}

async function fetchRadioStations() {
    const res = await fetch('https://mp3quran.net/api/v3/radios');
    const data = await res.json();
    const radioStations = data.radios;

    let options = '';
    radioStations.forEach(radio => {
        options += `<span class="radio-button"><a href="javascript:void(0)" onclick="playRadio('${radio.url}')">${radio.name}</a></span>`;
    });

    document.getElementById('radioStations').innerHTML = options;
}

function playRadio(url) {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = url;
    audioPlayer.play();
}

// Fetch and display radio stations on page load
fetchRadioStations();