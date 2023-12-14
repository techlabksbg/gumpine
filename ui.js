

window.addEventListener('load', function(){

    let canvas = this.document.getElementById('spielfeld');
    
    window.addEventListener('resize', resizeCanvas, false);
        
    function resizeCanvas() {
        //canvas.height = Math.floor(window.innerHeight*0.8);
        canvas.width = document.body.clientWidth;
        canvas.height = canvas.width;
        draw(); 
    }


    function draw() {
        let { w, h } = canvas.getBoundingClientRect();
        if (!w) {
            w = canvas.clientWidth;
            h = canvas.clientHeight;
        }

        let ctx = canvas.getContext("2d");
        ctx.fillStyle = '#0f2';
        ctx.fillRect(0,0,w,h);

    }

    resizeCanvas();

});