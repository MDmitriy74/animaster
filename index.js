function animaster() {

    function resetFadeIn(element) {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    }

    function resetFadeOut(element) {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    }

    function resetTransform(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    function resetLetterSpacing(element) {
        element.style.transitionDuration = null;
        element.style.letterSpacing = null;
    }

    function resetOutlineColor(element) {
        element.style.transitionDuration = null;
        element.style.outlineColor = null;
    }

    function getTransform(translation, ratio) {
        const result = [];

        if (translation) {
            result.push(`translate(${translation.x}px, ${translation.y}px)`);
        }

        if (ratio !== null && ratio !== undefined) {
            result.push(`scale(${ratio})`);
        }

        return result.join(' ');
    }

    return {

        _steps: [],

        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration,
                params: translation
            });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration,
                params: ratio
            });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration
            });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration
            });
            return this;
        },

        addDelay(duration) {
            this._steps.push({
                name: 'delay',
                duration
            });
            return this;
        },

        addLetterSpacing(duration, value) {
            this._steps.push({
                name: 'letterSpacing',
                duration,
                params: value
            });
            return this;
        },

        addOutlineColor(duration, value) {
            this._steps.push({
                name: 'outlineColor',
                duration,
                params: value
            });
            return this;
        },

        play(element, cycled = false) {

            let timeouts = [];
            let intervalId = null;

            const runSequence = () => {

                let delay = 0;

                this._steps.forEach(step => {

                    const timeoutId = setTimeout(() => {

                        element.style.transitionDuration = `${step.duration}ms`;

                        switch (step.name) {

                            case 'move':
                                element.style.transform = getTransform(step.params, null);
                                break;

                            case 'scale':
                                element.style.transform = getTransform(null, step.params);
                                break;

                            case 'fadeIn':
                                element.classList.remove('hide');
                                element.classList.add('show');
                                break;

                            case 'fadeOut':
                                element.classList.remove('show');
                                element.classList.add('hide');
                                break;

                            case 'letterSpacing':
                                element.style.letterSpacing = step.params;
                                break;

                            case 'outlineColor':
                                element.style.outlineColor = step.params;
                                break;
                        }

                    }, delay);

                    timeouts.push(timeoutId);
                    delay += step.duration;

                });

                return delay;
            };

            const stop = () => {
                timeouts.forEach(t => clearTimeout(t));
                timeouts = [];

                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            };

            const reset = () => {
                stop();
                resetTransform(element);
                resetLetterSpacing(element);
                resetOutlineColor(element);
            };

            if (cycled) {

                const totalDuration =
                    this._steps.reduce((sum, s) => sum + s.duration, 0);

                runSequence();
                intervalId = setInterval(runSequence, totalDuration);

            } else {
                runSequence();
            }

            return { stop, reset, cancel: stop };
        },

        move(element, duration, translation) {
            return this.addMove(duration, translation).play(element);
        },

        fadeIn(element, duration) {
            return this.addFadeIn(duration).play(element);
        },

        fadeOut(element, duration) {
            return this.addFadeOut(duration).play(element);
        },

        scale(element, duration, ratio) {
            return this.addScale(duration, ratio).play(element);
        },

        moveAndHide(element, duration) {

            return this
                .addMove(duration * 0.4, { x: 100, y: 20 })
                .addFadeOut(duration * 0.6)
                .play(element);
        },

        showAndHide(element, duration) {

            return this
                .addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {

            const beat = () => {

                element.style.transitionDuration = '500ms';
                element.style.transform = 'scale(1.4)';

                setTimeout(() => {
                    element.style.transitionDuration = '500ms';
                    element.style.transform = 'scale(1)';
                }, 500);
            };

            const timer = setInterval(beat, 1000);
            beat();

            return {
                stop() {
                    clearInterval(timer);
                    resetTransform(element);
                }
            };
        },

        letterSpacing(element, duration, value) {
            return this.addLetterSpacing(duration, value).play(element);
        },

        outlineColor(element, duration, value) {
            return this.addOutlineColor(duration, value).play(element);
        },

        resetFadeIn,
        resetFadeOut,
        resetMoveAndScale: resetTransform,
        resetLetterSpacing,
        resetOutlineColor,

        resetMoveAndHide(element) {
            resetTransform(element);
            resetFadeOut(element);
        }
    };
}


function addListeners() {

    const master = animaster();

    let heartBeatController = null;
    let moveAndHideController = null;
    let letterSpacingController = null;
    let outlineColorController = null;

    document.getElementById('fadeInPlay').onclick = () => {
        animaster().fadeIn(document.getElementById('fadeInBlock'), 5000);
    };

    document.getElementById('fadeOutPlay').onclick = () => {
        animaster().fadeOut(document.getElementById('fadeOutBlock'), 5000);
    };

    document.getElementById('movePlay').onclick = () => {
        animaster().move(
            document.getElementById('moveBlock'),
            1000,
            { x: 100, y: 10 }
        );
    };

    document.getElementById('scalePlay').onclick = () => {
        animaster().scale(
            document.getElementById('scaleBlock'),
            1000,
            1.25
        );
    };

    document.getElementById('moveAndHidePlay').onclick = () => {
        moveAndHideController =
            animaster().moveAndHide(
                document.getElementById('moveAndHideBlock'),
                3000
            );
    };

    document.getElementById('moveAndHideReset').onclick = () => {

        if (moveAndHideController)
            moveAndHideController.cancel();

        animaster().resetMoveAndHide(
            document.getElementById('moveAndHideBlock')
        );
    };

    document.getElementById('showAndHidePlay').onclick = () => {
        animaster().showAndHide(
            document.getElementById('showAndHideBlock'),
            3000
        );
    };

    document.getElementById('heartBeatingPlay').onclick = () => {

        heartBeatController =
            master.heartBeating(
                document.getElementById('heartBeatingBlock')
            );
    };

    document.getElementById('heartBeatingStop').onclick = () => {

        if (heartBeatController)
            heartBeatController.stop();
    };

    document.getElementById('letterSpacingPlay').onclick = () => {

        letterSpacingController =
            master.letterSpacing(
                document.getElementById('letterSpacingBlock'),
                1000,
                '10px'
            );
    };

    document.getElementById('letterSpacingReset').onclick = () => {

        if (letterSpacingController)
            letterSpacingController.reset();
        else
            master.resetLetterSpacing(
                document.getElementById('letterSpacingBlock')
            );
    };

    document.getElementById('outlineColorPlay').onclick = () => {

        outlineColorController =
            master.outlineColor(
                document.getElementById('outlineColorBlock'),
                1500,
                'red'
            );
    };

    document.getElementById('outlineColorReset').onclick = () => {

        if (outlineColorController)
            outlineColorController.reset();
        else
            master.resetOutlineColor(
                document.getElementById('outlineColorBlock')
            );
    };
}

document.addEventListener('DOMContentLoaded', addListeners);