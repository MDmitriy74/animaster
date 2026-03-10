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

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
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
            result.push(`translate(${translation.x}px,${translation.y}px)`);
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
            this._steps.push({ name: 'letterSpacing', duration, params: value });
            return this;
        },

        addOutlineColor(duration, value) {
            this._steps.push({ name: 'outlineColor', duration, params: value });
            return this;
        },


        play(element, cycled = false) {
            let timeouts = [];
            let intervalId = null;

            const initialState = {
                classList: [...element.classList],
                transform: element.style.transform,
                transitionDuration: element.style.transitionDuration,
                letterSpacing: element.style.letterSpacing,
                outlineColor: element.style.outlineColor

            };

            const runSequence = () => {
                let currentDelay = 0;
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
                    }, currentDelay);

                    timeouts.push(timeoutId);
                    currentDelay += step.duration;
                });
                return currentDelay;
            };

            const stop = () => {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                timeouts.forEach(t => clearTimeout(t));
                timeouts = [];
            };

            const reset = () => {
                stop();
                resetMoveAndScale(element);
                resetOutlineColor(element);
                resetLetterSpacing(element);
                if (initialState.classList.contains('hide')) {
                    resetFadeIn(element);
                } else {
                    resetFadeOut(element);
                }
            };

            if (cycled) {
                const totalDuration = this._steps.reduce((sum, step) => sum + step.duration, 0);
                runSequence();
                intervalId = setInterval(runSequence, totalDuration);
            } else {
                runSequence();
            }

            return {
                stop,
                reset,
                cancel: stop
            };
        },

        buildHandler() {
            const self = this;
            return function() {
                return self.play(this);
            };
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
            return this.addMove(duration * 0.4, { x: 100, y: 20 })
                .addFadeOut(duration * 0.6)
                .play(element);
        },

        showAndHide(element, duration) {
            return this.addFadeIn(duration / 3)
                .addDelay(duration / 3)
                .addFadeOut(duration / 3)
                .play(element);
        },

        heartBeating(element) {
            return this.addScale(500, 1.4)
                .addScale(500, 1.0)
                .play(element, true);
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
            element.classList.remove('show');
        }
    };
}

/**
 * Обработчики событий (без изменений в логике вызова)
 */
function addListeners() {
    const master = animaster();

    let heartBeatController = null;
    let moveAndHideController = null;
    let letterSpacingController = null;
    let outlineColorController = null;

    document.getElementById('fadeInPlay').addEventListener('click', () => {
        const block = document.getElementById('fadeInBlock');
        animaster().fadeIn(block, 5000);
    });

    document.getElementById('fadeOutPlay').addEventListener('click', () => {
        const block = document.getElementById('fadeOutBlock');
        animaster().fadeOut(block, 5000);
    });

    document.getElementById('movePlay').addEventListener('click', () => {
        const block = document.getElementById('moveBlock');
        animaster().move(block, 1000, { x: 100, y: 10 });
    });

    document.getElementById('scalePlay').addEventListener('click', () => {
        const block = document.getElementById('scaleBlock');
        animaster().scale(block, 1000, 1.25);
    });

    document.getElementById('moveAndHidePlay').addEventListener('click', () => {
        const block = document.getElementById('moveAndHideBlock');
        moveAndHideController = animaster().moveAndHide(block, 3000);
    });

    document.getElementById('moveAndHideReset').addEventListener('click', () => {
        const block = document.getElementById('moveAndHideBlock');
        if (moveAndHideController && moveAndHideController.cancel) {
            moveAndHideController.cancel();
        }
        animaster().resetMoveAndHide(block);
    });

    document.getElementById('showAndHidePlay').addEventListener('click', () => {
        const block = document.getElementById('showAndHideBlock');
        animaster().showAndHide(block, 3000);
    });

    document.getElementById('heartBeatingPlay').addEventListener('click', () => {
        const block = document.getElementById('heartBeatingBlock');
        heartBeatController = animaster().heartBeating(block);
    });

    document.getElementById('heartBeatingStop').addEventListener('click', () => {
        if (heartBeatController) {
            heartBeatController.stop();
            heartBeatController = null;
        }
    });

    document.getElementById('letterSpacingPlay').addEventListener('click', () => {
        const block = document.getElementById('letterSpacingBlock');
        letterSpacingController = master.letterSpacing(block, 1000, '10px');
    });

    document.getElementById('letterSpacingReset').addEventListener('click', () => {
        if (letterSpacingController) letterSpacingController.reset();
        else master.resetLetterSpacing(document.getElementById('letterSpacingBlock'));
    });

    document.getElementById('outlineColorPlay').addEventListener('click', () => {
        const block = document.getElementById('outlineColorBlock');
        outlineColorController = master.outlineColor(block, 1500, 'red');
    });

    document.getElementById('outlineColorReset').addEventListener('click', () => {
        if (outlineColorController) outlineColorController.reset();
        else master.resetOutlineColor(document.getElementById('outlineColorBlock'));
    });
}


document.addEventListener('DOMContentLoaded', addListeners);