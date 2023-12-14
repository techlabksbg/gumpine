

window.addEventListener('load', function(){

    let canvas = this.document.getElementById('spielfeld');
    
    window.addEventListener('resize', resizeCanvas, false);
        
    function resizeCanvas() {
        //canvas.height = Math.floor(window.innerHeight*0.8);
        canvas.width = document.body.clientWidth;
        canvas.height = canvas.width;
        draw(); 
    }

    let moving = false;
    let startMove = [0,0];
    let endMove = [0,0];

    function processMove() {
        console.log(`Moving from ${startMove} to ${endMove}`);
    }

    function getElementCoordinates(e, touchMove=false) {
        if (!touchMove) {
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left; //x position within the element.
            var y = e.clientY - rect.top;  //y position within the element.
            return [x,y];
        } else {
            var xPos = e.targetTouches[0].pageX;
            var yPos = e.targetTouches[0].pageY;
            var rect = e.target.getBoundingClientRect();
            var x = xPos - rect.left; //x position within the element.
            var y = yPos - rect.top;  //y position within the element.
            return [x,y];
        }
    }

    function startInteraction(e, touchMove=false) {
        e.preventDefault();            
        let [x,y] = getElementCoordinates(e, touchMove);
        moving = true;
        startMove = [x,y];
    }
    function dragInteraction(e, touchMove=false) {
        if (!touchMove) {
            if (e.buttons==0) return;
        }
        e.preventDefault();
        let [x,y] = getElementCoordinates(e, touchMove);
        endMove = [x,y];
    }
    function stopInteraction(e, touchMove) {
        e.preventDefault();
        if (!touchMove) {
            let [x,y] = getElementCoordinates(e, touchMove);
            endMove=[x,y];
        }
        moving = false;
        processMove();
    }

    function initEventHandlers(el) {
        el.addEventListener("touchstart", (e)=>startInteraction(e, true), false);
        el.addEventListener("mousedown", (e)=>startInteraction(e, false), false);
        el.addEventListener("touchmove", (e)=>dragInteraction(e, true), false);
        el.addEventListener("mousemove", (e)=>dragInteraction(e, false), false);
        el.addEventListener("touchend", (e)=>stopInteraction(e, true), false);
        el.addEventListener("touchcancel", (e)=>stopInteraction(e, true), false);
        el.addEventListener("touchleave", (e)=>stopInteraction(e, true), false);
        el.addEventListener("mouseup", (e)=>stopInteraction(e, false), false);

    }
    initEventHandlers(canvas);

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