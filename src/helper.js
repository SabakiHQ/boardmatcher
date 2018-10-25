exports.mod = (x, m) => (x % m + m) % m
exports.equals = v => w => w[0] === v[0] && w[1] === v[1]
exports.hasVertex = ([x, y], width, height) => x >= 0 && y >= 0 && x < width && y < height
exports.getNeighbors = ([x, y], width, height) =>
    [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(v => exports.hasVertex(v, width, height))

exports.getLiberties = function([x, y], data, visited = [], result = []) {
    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    let neighbors = exports.getNeighbors([x, y], width, height)
    let sign = data[y][x]

    visited.push([x, y])
    result.push(...neighbors.filter(([nx, ny]) => data[ny][nx] === 0 && !result.some(equals([nx, ny]))))

    for (let [nx, ny] of neighbors) {
        if (data[ny][nx] === 0) return [nx, ny]
        if (data[ny][nx] !== sign || visited.some(exports.equals([nx, ny]))) continue

        return exports.getLiberties([nx, ny], data, visited, result)
    }

    return result
}

exports.getUnnamedHoshis = function(width, height) {
    if (Math.min(width, height) < 6) return []

    let [nearX, nearY] = [width, height].map(x => x >= 13 ? 3 : 2)
    let [farX, farY] = [width - nearX - 1, height - nearY - 1]
    let [middleX, middleY] = [width, height].map(x => (x - 1) / 2)
    let result = []

    if (width % 2 !== 0)
        result.push([middleX, nearY], [middleX, farY])
    if (height % 2 !== 0)
        result.push([nearX, middleY], [farX, middleY])

    return result
}
