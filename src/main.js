const {mod, equals, hasVertex} = require('./helper')

exports.shapeLibrary = require('../data/shapes.json')

function getSymmetries([x, y]) {
    return [
        [x, y], [-x, y], [x, -y], [-x, -y],
        [y, x], [-y, x], [y, -x], [-y, -x]
    ]
}

function getBoardSymmetries(board, vertex) {
    let height = board.length
    let width = board.length === 0 ? 0 : board[0].length
    let [mx, my] = [width - 1, height - 1]

    return getSymmetries(vertex)
        .map(([x, y]) => [mod(x, mx), mod(y, my)])
        .filter(v => hasVertex(v, width, height))
}

exports.cornerMatch = function(vertices, board) {
    let hypotheses = Array(8).fill(true)
    let hypothesesInvert = Array(8).fill(true)

    for (let [[x, y], sign] of vertices) {
        let representatives = getBoardSymmetries(board, [x, y])

        for (let i = 0; i < hypotheses.length; i++) {
            let [x, y] = representatives[i]

            if (hypotheses[i] && (board[y] == null || board[y][x] !== sign))
                hypotheses[i] = false
            if (hypothesesInvert[i] && (board[y] == null || board[y][x] !== -sign))
                hypothesesInvert[i] = false
        }

        if (!hypotheses.includes(true) && !hypothesesInvert.includes(true))
            return null
    }

    let i = [...hypotheses, ...hypothesesInvert].indexOf(true)
    return i < 8 ? [i, false] : [i - 8, true]
}

exports.shapeMatch = function(shape, board, [x, y]) {
    let height = board.length
    let width = board.length === 0 ? 0 : board[0].length
    if (!hasVertex([x, y], width, height)) return null

    let sign = board[y][x]
    if (sign === 0) return null
    let equalsVertex = equals([x, y])

    for (let [[ax, ay], as] of shape.anchors) {
        let hypotheses = Array(8).fill(true)
        let i = 0

        if (shape.size != null && (width !== height || width !== +shape.size))
            continue

        if (shape.type === 'corner' && !getBoardSymmetries(board, [ax, ay]).some(equalsVertex))
            continue

        // Hypothesize [x, y] === [ax, ay]

        for (let [[vx, vy], vs] of shape.vertices) {
            let diff = [vx - ax, vy - ay]
            let symm = getSymmetries(diff)

            for (let k = 0; k < symm.length; k++) {
                if (!hypotheses[k]) continue
                let [wx, wy] = [x + symm[k][0], y + symm[k][1]]

                if (!hasVertex([wx, wy], width, height) || board[wy][wx] !== vs * sign * as)
                    hypotheses[k] = false
            }

            i = hypotheses.indexOf(true)
            if (i < 0) break
        }

        if (i >= 0) return [i, sign !== as]
    }

    return null
}
