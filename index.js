function animaster() {
    function getTransform(translation, ratio) {
        const result = [];
        if (translation) {
            result.push(`translate(${translation.x}px,${translation.y}px)`);
        }
        if (ratio !== null && ratio !== undefined) {
            result.push(`scale(${ratio})`);
        }
        return result.join(' ');
    }

    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide(element, duration) {
            const moveDuration = duration * 0.4;
            const hideDuration = duration * 0.6;

            this.move(element, moveDuration, { x: 100, y: 20 });

            setTimeout(() => {
                this.fadeOut(element, hideDuration);
            }, moveDuration);
        },

        showAndHide(element, duration) {
            const interval = duration / 3;

            this.fadeIn(element, interval);

            setTimeout(() => {
            }, interval);

            setTimeout(() => {
                this.fadeOut(element, interval);
            }, interval * 2);
        },

        heartBeating(element) {
            const beat = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1.0);
                }, 500);
            };

            const timerId = setInterval(beat, 1000);
            beat();

            return {
                stop() {
                    clearInterval(timerId);
                }
            };
        }
    };
}

addListeners();

function addListeners() {
    const master = animaster();

    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            master.fadeIn(block, 5000);
        });

    document.getElementById('fadeOutPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeOutBlock');
            master.fadeOut(block, 5000);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveBlock');
            master.move(block, 1000, { x: 100, y: 10 });
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            master.scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            master.moveAndHide(block, 3000);
        });

    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            master.showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            window.heartBeatAnimation = master.heartBeating(block);
        });
}