const matchShape = require('./matchShape')
const {equals, hasVertex, getNeighbors, getLiberties, getUnnamedHoshis} = require('./helper')

module.exports = function(data, sign, vertex, {shapes = null} = {}) {
    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    if (sign === 0 || !hasVertex(vertex, width, height)) return 'Pass'

    let [x, y] = vertex
    let oldSign = data[y][x]
    if (oldSign !== 0) return null
    if (shapes == null) shapes = require('../data/shapes.json')

    let neighbors = getNeighbors(vertex, width, height)

    // Check suicide

    data[y][x] = sign

    if (getLiberties(vertex, data).length === 0) {
        data[y][x] = oldSign
        return 'Suicide'
    }

    data[y][x] = oldSign

    // Check atari & capture

    for (let [nx, ny] of neighbors) {
        if (data[ny][nx] !== -sign) continue

        let libertyCount = getLiberties([nx, ny], data).length
        if (libertyCount === 1) return 'Take'
        if (libertyCount === 2) return 'Atari'
    }

    // Check connection

    let friendlies = neighbors.filter(([nx, ny]) => data[ny][nx] === sign)
    if (friendlies.length === neighbors.length) return 'Fill'
    if (friendlies.length >= 2) return 'Connect'

    // Match shape

    data[y][x] = sign

    for (let shape of shapes) {
        for (let _ of matchShape(data, vertex, shape)) {
            data[y][x] = oldSign
            return shape.name
        }
    }

    data[y][x] = oldSign

    // Determine position to edges

    let equalsVertex = equals(vertex)
    if (equalsVertex([(width - 1) / 2, (height - 1) / 2])) return 'Tengen'
    if (getUnnamedHoshis(width, height).some(equalsVertex)) return 'Hoshi'

    let diff = vertex
        .map((z, i) => Math.min(z + 1, [width, height][i] - z))
        .sort((a, b) => a - b)

    if (diff[1] <= 6) return diff.join('-') + ' point'

    return null
}
