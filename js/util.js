MAX_TIMEOUT = 1000;

function randomRange(min, max) {
    return min + Math.floor(Math.random()*(max-min+1));
}

function tryTo(description, callback) {
    for (let timeout = MAX_TIMEOUT; timeout > 0; timeout--) {
        if (callback()) {
            return;
        }
    }
    throw "Timeout when trying to " + description;
}
