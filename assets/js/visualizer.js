//create new instance of audio 
    var audio = new Audio();

    var canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;

    window.addEventListener("load", initMp3Player, false);


    function frameLooper(){
        window.webkitRequestAnimationFrame(frameLooper);
        fbc_array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(fbc_array);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0000FF";
        
        bars = 100;
        for (var i = 0; i < bars; i++){
            bar_x = i * 3;
            bar_width = 2;
            bar_height = -(fbc_array[i]/2);
            ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
        }
    }

    function initMp3Player(){
        document.getElementById('audio_box').appendChild(audio);
        context = new AudioContext();
        analyser = context.createAnalyser();
        canvas = document.getElementById('analyser_render');
        ctx = canvas.getContext('2d');
        source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);
        frameLooper();
    }
