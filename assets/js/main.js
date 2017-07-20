var currentSongNumber = 1;
var willLoop = 0;
var willShuffle = 0; // will use this soon


// convert time in fancy format like : 2:34
function fancyTimeFormat(time)
{   
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

//update time of a song 
function updateCurrentTime() {
    var song = document.querySelector('audio');
    var currentTime = Math.floor(song.currentTime);
    currentTime = fancyTimeFormat(currentTime);
    var duration = Math.floor(song.duration);
    duration = fancyTimeFormat(duration)
    $('.time-elapsed').text(currentTime);
    $('.song-duration').text(duration);
}

/* list of bojects in which an object represents a song with it's properties 
   like name, artist name, album, duration of the song. */

var songPath = 'assets/songs/';

var songs = [{
                'name': 'Badri Ki Dulhania (Title Track)',
                'artist': 'Neha Kakkar, Monali Thakur, Ikka Singh, Dev Negi',
                'album': 'Badrinath ki Dulhania',
                'duration': '2:56',
                'fileName': songPath + 'song1.mp3',
                'image' : 'song1.jpg'
            },
            {
                'name': 'Humma Song',
                'artist': 'Badshah, Jubin Nautiyal, Shashaa Tirupati',
                'album': 'Ok Jaanu',
                'duration': '3:15',
                'fileName': songPath + 'song2.mp3',
                'image' : 'song2.jpg'
            },
            {
                'name': 'Nashe Si Chadh Gayi',
                'artist': 'Arijit Singh',
                'album': 'Befikre',
                'duration': '2:34',
                'fileName': songPath + 'song3.mp3',
                'image' : 'song3.jpg'
            },
            {
                'name': 'The Breakup Song',
                'artist': 'Nakash Aziz, Arijit Singh, Badshah, Jonita Gandhi',
                'album': 'Ae Dil Hai Mushkil',
                'duration': '2:29',
                'fileName': songPath + 'song4.mp3',
                'image' : 'song4.jpg'
            }];

/************************************************
    when user click on a perticular song then it will check if the song is same as before then the song will
    paused/play only.
*************************************************/
function addSongNameClickEvent(songObj,position) {

    var id = '#song' + position;

    var songName = songObj.fileName;

    $(id).click(function() {

        var audio = document.querySelector('audio');
        var currentSong = audio.src;

        if(currentSong.search(songName) != -1)
        {
            toggleSong();
        }
        else {
            audio.src = songName;
            toggleSong();
            changeCurrentSongDetails(songObj);
        }
    });
} 

/*
    whenever a webpage is loaded, it will show all songs that are available in the list with their properties
    like: song name, artist name, album, duration 
*/
window.onload = function() {

    //add image when page is loaded
    changeCurrentSongDetails(songs[0]);

    // wright name of each song in song list 
    for(var i = 0; i < songs.length; i++) {
        var obj = songs[i];
        var name = '#song' + (i+1);
        var song = $(name);
        song.find('.song-name').text(obj.name);
        song.find('.song-artist').text(obj.artist);
        song.find('.song-album').text(obj.album);
        song.find('.song-length').text(obj.duration);
        addSongNameClickEvent(obj,i + 1);
    }

    updateCurrentTime();

    //update current time in each second 
    setInterval(function() {
        updateCurrentTime();
    },1000);

    //DataTable plugin
    $('#songs').DataTable();

    //remove extra information from DataTable();
    $('.dataTables_length#songs_length').remove();
    $('.dataTables_paginate.paging_simple_numbers').remove();
}       



/*******************************
    this function toggles a song.
    if a song is already played then it will pause the song and change the icon from 
        fa-play icon to fa-pause icon.
    if a song is already paused then it will play the song and change the icon from
        fa-pause icon to fa-play icon.
*********************************/
function toggleSong() {

    var song = document.querySelector('audio');

    if(song.paused == true) {
        $('.play-icon').removeClass('fa-play').addClass('fa-pause');
        song.play();
    }
    else {
        $('.play-icon').removeClass('fa-pause').addClass('fa-play');
        song.pause();
    }
}


/*******************************
this function will change details of current song.
********************************/

function changeCurrentSongDetails(songObj) {
    $('.current-song-image').attr('src','assets/img/' + songObj.image);
    $('.current-song-name').text(songObj.name);
    $('.current-song-album').text(songObj.album);
}


/*********************************
    when user click on button to enter into his account then first it will check wheather user has entered 
    his name or not and length of the name should be greater than 2.
**********************************/
$('.welcome-screen button').on('click', function() {

    var name = $('#name-input').val();

    if (name.length > 2) {

        var message = "Welcome, " + name;
        $('.main .user-name').text(message);
        $('.welcome-screen').addClass('hidden');
        $('.main').removeClass('hidden');

    } else {

        $('#name-input').addClass('error');

    }
});


// control by click event
$('.play-icon').on('click', function() {

    toggleSong();

});

// control by keyboard
$('body').on('keypress', function(event) {
    var target = event.target;

    if (event.keyCode == 32 && target.tagName !='INPUT') {

        toggleSong();
    }
});
 


// event for repeat icon that enable the repetation of the songs
$('.fa-repeat').on('click',function() {
    $('.fa-repeat').toggleClass('disabled');
    willLoop = 1 - willLoop;
}); 

// event for shuffle icon that shuffle songs
$('.fa-random').on('click',function() {
    $('.fa-random').toggleClass('disabled')
    willShuffle = 1 - willShuffle;
});

// event for Drum-Kit icon that change the page 

function timeJump() {
    var song = document.querySelector('audio')
    song.currentTime = song.duration - 5;
}


function randomExcluded(min, max, excluded) {
    var n = Math.floor(Math.random() * (max-min) + min);
    if (n >= excluded) n++;

    return n;
}


$('audio').on('ended',function() {
    var audio = document.querySelector('audio');
    if (willShuffle == 1) {
        var nextSongNumber = randomExcluded(1,4,currentSongNumber); 
        var nextSongObj = songs[nextSongNumber-1];
        audio.src = nextSongObj.fileName;
        toggleSong();
        changeCurrentSongDetails(nextSongObj);
        currentSongNumber = nextSongNumber;
    }
    else if(currentSongNumber < 4) {
        var nextSongObj = songs[currentSongNumber];
        audio.src = nextSongObj.fileName;
        toggleSong();
        changeCurrentSongDetails(nextSongObj);
        currentSongNumber = currentSongNumber + 1;
    }
    else if(willLoop == 1) {
        var nextSongObj = songs[0];
        audio.src = nextSongObj.fileName;
        toggleSong();
        changeCurrentSongDetails(nextSongObj);
        currentSongNumber =  1;
    }
    else {
        $('.play-icon').removeClass('fa-pause').addClass('fa-play');
        audio.currentTime = 0;
    }
});


//toggle between current song wrapper and visualizer 

$('.fa-arrows-alt').on('click',function() {
    $('.fa-arrows-alt').removeClass('disabled');
    
    // $('#analyser_render').toggleClass('player-class');

    $('#outerVisualizer').show();
    // $('#analyser_render').toggleClass('hidden');
    
});
