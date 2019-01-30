const matchShape = require('./matchPattern')
const {equals, hasVertex, getNeighbors, getPseudoLibertyCount, getUnnamedHoshis} = require('./helper')

module.exports = function(data, sign, vertex, {library = null} = {}) {
    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    let isPass = sign === 0 || vertex == null || !hasVertex(vertex, width, height)

    let getDummyPatternMatch = (name, url = null) => ({
        pattern: {
            name,
            url,
            anchors: isPass ? [] : [[vertex, sign]],
            vertices: []
        },
        match: {
            symmetryIndex: 0,
            invert: false,
            anchors: isPass ? [] : [vertex],
            vertices: []
        }
    })

    if (isPass) return getDummyPatternMatch('Pass', 'https://senseis.xmp.net/?Pass')

    let [x, y] = vertex
    let oldSign = data[y][x]
    if (oldSign !== 0) return null
    if (library == null) library = require('../data/library.json')

    let equalsVertex = equals(vertex)
    let neighbors = getNeighbors(vertex, width, height)

    // Check atari & capture

    for (let [nx, ny] of neighbors) {
        if (data[ny][nx] !== -sign) continue

        let libertyCount = getPseudoLibertyCount([nx, ny], data)
        if (libertyCount === 1) return getDummyPatternMatch('Take')
        if (libertyCount === 2) return getDummyPatternMatch('Atari', 'https://senseis.xmp.net/?Atari')
    }

    // Check suicide

    let nextData = data.map((row, j) => y !== j ? row : row.map((s, i) => x !== i ? s : sign))

    if (getPseudoLibertyCount(vertex, nextData) === 0) {
        return getDummyPatternMatch('Suicide', 'https://senseis.xmp.net/?Suicide')
    }

    // Check connection

    let friendlies = neighbors.filter(([nx, ny]) => data[ny][nx] === sign)
    if (friendlies.length === neighbors.length) return getDummyPatternMatch('Fill')
    if (friendlies.length >= 2) return getDummyPatternMatch('Connect')

    // Match library pattern

    for (let pattern of library) {
        for (let match of matchShape(nextData, vertex, pattern)) {
            return {pattern, match}
        }
    }

    // Determine position to edges

    if (equalsVertex([(width - 1) / 2, (height - 1) / 2]))
        return getDummyPatternMatch('Tengen', 'https://senseis.xmp.net/?Tengen')
    if (getUnnamedHoshis(width, height).some(equalsVertex))
        return getDummyPatternMatch('Hoshi', 'https://senseis.xmp.net/?StarPoint')

    let diff = vertex
        .map((z, i) => Math.min(z + 1, [width, height][i] - z))
        .sort((a, b) => a - b)

    if (diff[1] <= 6) return getDummyPatternMatch(diff.join('-') + ' point')

    return null
}
