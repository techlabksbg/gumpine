

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

        
        ctx.setTransform(w/5.2, 0, 0, w/5.2, w/5.2*0.6, w/5.2*0.6)

        ctx.fillStyle = '#0f2';
        ctx.fillRect(-0.5,-0.5,5,5);

        ctx.fillStyle = '#f02';
        ctx.strokeStyle = '#080';
        ctx.lineWidth = 0.05;

        for (let x=0; x<5; x++) {
            ctx.beginPath();
            ctx.moveTo(x-0.5,-0.5);
            ctx.lineTo(x-0.5,4.5);
            ctx.moveTo(-0.5,x-0.5);
            ctx.lineTo(4.5,x-0.5);

            ctx.stroke();
            for (let y=0; y<5; y++) {
                ctx.beginPath();
                ctx.arc(x,y,0.4, 0,2*Math.PI);
                ctx.fill();
            }
        }


    }

    resizeCanvas();

});