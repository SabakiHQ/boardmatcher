exports.mod = (x, m) => (x % m + m) % m
exports.equals = v => w => w[0] === v[0] && w[1] === v[1]
exports.hasVertex = ([x, y], width, height) => x >= 0 && y >= 0 && x < width && y < height
