const {mod, equals, hasVertex} = require('./helper')

exports.shapeLibrary = require('../data/shapes.json')

function getSymmetries([x, y]) {
    return [
        [x, y], [-x, y], [x, -y], [-x, -y],
        [y, x], [-y, x], [y, -x], [-y, -x]
    ]
}

function getBoardSymmetries(vertex, width, height) {
    let [mx, my] = [width - 1, height - 1]

    return getSymmetries(vertex)
        .map(([x, y]) => [mod(x, mx), mod(y, my)])
        .filter(v => hasVertex(v, width, height))
}

exports.cornerMatch = function(vertices, data) {
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
    return i < 8 ? [i, false] : [i - 8, true]
}

exports.shapeMatch = function(shape, data, [x, y]) {
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

        if (i >= 0) return [i, sign !== as]
    }

    return null
}
