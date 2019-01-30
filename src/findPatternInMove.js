const matchShape = require('./matchPattern')
const {equals, hasVertex, getNeighbors, getPseudoLibertyCount, getUnnamedHoshis} = require('./helper')

module.exports = function(data, sign, vertex, {library = null} = {}) {
    let getDummyReturnFromString = str => ({
        pattern: {
            name: str,
            anchors: [[vertex, sign]],
            vertices: []
        },
        match: {
            symmetryIndex: 0,
            invert: false,
            anchors: [[vertex, sign]],
            vertices: []
        }
    })

    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    if (sign === 0 || !hasVertex(vertex, width, height)) return getDummyReturnFromString('Pass')

    let [x, y] = vertex
    let oldSign = data[y][x]
    if (oldSign !== 0) return null
    if (library == null) library = require('../data/library.json')

    let equalsVertex = equals(vertex)
    let neighbors = getNeighbors(vertex, width, height)

    // Check suicide

    let nextData = data.map((row, j) => y !== j ? row : row.map((s, i) => x !== i ? s : sign))

    if (getPseudoLibertyCount(vertex, nextData) === 0) {
        return getDummyReturnFromString('Suicide')
    }

    // Check atari & capture

    for (let [nx, ny] of neighbors) {
        if (data[ny][nx] !== -sign) continue

        let libertyCount = getPseudoLibertyCount([nx, ny], data)
        if (libertyCount === 1) return getDummyReturnFromString('Take')
        if (libertyCount === 2) return getDummyReturnFromString('Atari')
    }

    // Check connection

    let friendlies = neighbors.filter(([nx, ny]) => data[ny][nx] === sign)
    if (friendlies.length === neighbors.length) return getDummyReturnFromString('Fill')
    if (friendlies.length >= 2) return getDummyReturnFromString('Connect')

    // Match library pattern

    for (let pattern of library) {
        for (let match of matchShape(nextData, vertex, pattern)) {
            return {pattern, match}
        }
    }

    // Determine position to edges

    if (equalsVertex([(width - 1) / 2, (height - 1) / 2])) return getDummyReturnFromString('Tengen')
    if (getUnnamedHoshis(width, height).some(equalsVertex)) return getDummyReturnFromString('Hoshi')

    let diff = vertex
        .map((z, i) => Math.min(z + 1, [width, height][i] - z))
        .sort((a, b) => a - b)

    if (diff[1] <= 6) return getDummyReturnFromString(diff.join('-') + ' point')

    return null
}
