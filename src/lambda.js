const tranpolin = async fn => {
    let last;
    while (last === undefined || typeof last === "function")
        last = await fn();
}

window.onload = () => {
    const app = new PIXI.Application({ 
        width: 256, 
        height: 128,
        backgroundColor: 0x1a1a1a
    });
    const lambda = PIXI.Sprite.from("assets/white-lambda.png");
    lambda.width = 128;
    lambda.height = 128;
    lambda.x = 64;

    const defaultOptions = {
        offset: 0,
        red: [0, 0],
        blue: [0, 0],
        green: [0, 0]
    }

    const glitch = new PIXI.filters.GlitchFilter(defaultOptions);
    lambda.filters = [ glitch ];
    app.stage.addChild(lambda);
    document.body.appendChild(app.view);

    const reset = () => Object.assign(glitch, defaultOptions);
    const randomize = (range, base = 0) => Math.floor(Math.random() * range + base);

    const randomizeOptions = () => ({
        slices: randomize(12, 8),
        offset: randomize(50), 
        red: [randomize(50, -25), randomize(100, -50)],
        blue: [randomize(50, -25), 0],
        green: [0, randomize(20, -10)],
    })

    const minimalOptions = () => ({
        slices: randomize(10, 6),
        offset: randomize(2), 
        red: [randomize(4, -2), 0],
        blue: [randomize(4, -2), 0],
        green: [0, randomize(2, -1)],
    })

    const relax = duration => new Promise((res) => {
        let id;

        const glitchImg = () => {
            Object.assign(glitch, minimalOptions());
            id = requestAnimationFrame(resetImg);
        }

        const resetImg = () => {
            Object.assign(glitch, defaultOptions);
            id = requestAnimationFrame(glitchImg);
        }

        requestAnimationFrame(glitchImg);
        setTimeout(() => {
            cancelAnimationFrame(id);
            res();
        }, duration);
    });

    const step = () => new Promise((res) => {
        Object.assign(glitch, randomizeOptions());

        setTimeout(() => {
            relax(randomize(200, randomize(1200))).then(_ => res());
        }, randomize(20, randomize(90, 40)))
    });

    (async () => {
        while (true) await step();
    })();
}
