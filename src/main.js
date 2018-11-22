const {
    equals,
    hasVertex,
    getNeighbors,
    getLiberties,
    getSymmetries,
    getBoardSymmetries,
    getUnnamedHoshis
} = require('./helper')

exports.matchCorner = function(data, vertices) {
    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    let hypotheses = Array(8).fill(true)
    let hypothesesInvert = Array(8).fill(true)

    for (let [[x, y], sign] of vertices) {
        let representatives = getBoardSymmetries([x, y], width, height)

        for (let i = 0; i < hypotheses.length; i++) {
            let [x, y] = representatives[i]

            if (hypotheses[i] && (data[y] == null || data[y][x] !== sign))
                hypotheses[i] = false
            if (hypothesesInvert[i] && (data[y] == null || data[y][x] !== -sign))
                hypothesesInvert[i] = false
        }

        if (!hypotheses.includes(true) && !hypothesesInvert.includes(true))
            return null
    }

    let i = [...hypotheses, ...hypothesesInvert].indexOf(true)

    return {
        symmetryIndex: i < 8 ? i : i - 8,
        invert: i >= 8,
        vertices: vertices.map(([vertex, _]) =>
            getBoardSymmetries(vertex, width, height)[i < 8 ? i : i - 8]
        )
    }
}

exports.matchShape = function(data, [x, y], shape) {
    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    if (!hasVertex([x, y], width, height)) return null

    let sign = data[y][x]
    if (sign === 0) return null
    let equalsVertex = equals([x, y])

    for (let [[ax, ay], as] of shape.anchors) {
        let hypotheses = Array(8).fill(true)
        let i = 0

        if (shape.size != null && (width !== height || width !== +shape.size))
            continue

        if (shape.type === 'corner' && !getBoardSymmetries([ax, ay], width, height).some(equalsVertex))
            continue

        // Hypothesize [x, y] === [ax, ay]

        for (let [[vx, vy], vs] of shape.vertices) {
            let diff = [vx - ax, vy - ay]
            let symm = getSymmetries(diff)

            for (let k = 0; k < symm.length; k++) {
                if (!hypotheses[k]) continue
                let [wx, wy] = [x + symm[k][0], y + symm[k][1]]

                if (!hasVertex([wx, wy], width, height) || data[wy][wx] !== vs * sign * as)
                    hypotheses[k] = false
            }

            i = hypotheses.indexOf(true)
            if (i < 0) break
        }

        if (i >= 0) return {
            symmetryIndex: i,
            invert: sign !== as,
            vertices: shape.vertices.map(([vertex, _]) =>
                getBoardSymmetries(vertex, width, height)[i]
            )
        }
    }

    return null
}

exports.nameMove = function(data, sign, [x, y], {shapes = null} = {}) {
    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    let oldSign = data[y][x]

    if (oldSign !== 0) return null
    if (!hasVertex([x, y], width, height)) return 'Pass'
    if (shapes == null) shapes = require('../data/shapes.json')

    let neighbors = getNeighbors([x, y], width, height)

    // Check suicide

    data[y][x] = sign

    if (getLiberties([x, y], data).length === 0) {
        data[y][x] = oldSign
        return 'Suicide'
    }

    data[y][x] = oldSign

    // Check atari & capture

    for (let [nx, ny] of neighbors) {
        if (data[ny][nx] === -sign) continue

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
        if (exports.matchShape(data, [x, y], shape)) {
            data[y][x] = oldSign
            return shape.name
        }
    }

    data[y][x] = oldSign

    // Determine position to edges

    let equalsVertex = equals([x, y])
    if (equalsVertex([(width - 1) / 2, (height - 1) / 2])) return 'Tengen'
    if (getUnnamedHoshis().some(equalsVertex)) return 'Hoshi'

    let diff = [x, y].map((z, i) => Math.min(z + 1, [width, height][i] - z)).sort((a, b) => a - b)
    if (diff[1] <= 6) return diff.join('-') + ' point'

    return null
}
