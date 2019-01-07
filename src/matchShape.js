const {equals, hasVertex, getSymmetries, getBoardSymmetries} = require('./helper')

module.exports = function*(data, anchor, shape) {
    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    if (!hasVertex(anchor, width, height)) return
    if (shape.size != null && (width !== height || width !== +shape.size)) return

    let [x, y] = anchor
    let sign = data[y][x]
    if (sign === 0) return

    let equalsVertex = equals(anchor)

    for (let [[ax, ay], as] of shape.anchors) {
        let hypotheses = Array(8).fill(true)

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

            if (!hypotheses.includes(true)) break
        }

        for (let i = 0; i < hypotheses.length; i++) {
            if (!hypotheses[i]) continue

            yield {
                symmetryIndex: i,
                invert: sign !== as,
                vertices: shape.vertices.map(([vertex, _]) =>
                    getBoardSymmetries(vertex, width, height)[i]
                )
            }
        }
    }
}
