const {getBoardSymmetries} = require('./helper')

module.exports = function*(data, pattern) {
    let height = data.length
    let width = data.length === 0 ? 0 : data[0].length
    let hypotheses = Array(8).fill(true)
    let hypothesesInvert = Array(8).fill(true)

    for (let [[x, y], sign] of pattern) {
        let representatives = getBoardSymmetries([x, y], width, height)

        for (let i = 0; i < hypotheses.length; i++) {
            let [x, y] = representatives[i]

            if (hypotheses[i] && (data[y] == null || data[y][x] !== sign))
                hypotheses[i] = false
            if (hypothesesInvert[i] && (data[y] == null || data[y][x] !== -sign))
                hypothesesInvert[i] = false
        }

        if (!hypotheses.includes(true) && !hypothesesInvert.includes(true)) return
    }

    for (let invert = 0; invert <= 1; invert++) {
        for (let i = 0; i < hypotheses.length; i++) {
            if (!invert && !hypotheses[i] || !!invert && !hypothesesInvert[i]) continue

            yield {
                symmetryIndex: i,
                invert: !!invert,
                vertices: pattern.map(([vertex, _]) =>
                    getBoardSymmetries(vertex, width, height)[i]
                )
            }
        }
    }
}
