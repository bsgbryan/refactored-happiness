const fs = require('fs')

const matrix = { }

const buildKey = (word, i) => {
  let limit   = word.length - 1
  let key     = 0
  let current = word.charCodeAt(i)

  if (i > 0) {
    key = word.charCodeAt(i - 1)
  }

  key =  key << 7
  key += current
  key =  key << 7

  if (i < limit) {
    key += word.charCodeAt(i + 1)
  }

  return key
}

fs.readFile('./dictionary.txt', 'utf8', (err, data) => {
  const words = data
    .split(' ')
    .forEach((word) => {
      let context = matrix

      for (let i in word) {
        i = parseInt(i, 10)

        let key = buildKey(word, i)

        if (typeof context[key] === 'undefined') {
          context[key] = { }
        }

        context = context[key]
      }
    })

  fs.writeFile('./matrix.json', JSON.stringify(matrix), (err) => {
    if (err) {
      console.log("D'oh!")
    } else {
      console.log('Matrix saved')

      fs.readFile('./words.txt', 'utf8', (_, data) => {
        const words = data
          .replace(/\W+/g, ' ')
          .split(' ')
          .map((w) => w.toLowerCase())

        for (let word of words) {
          let context = matrix
          let skip    = false

          for (let w in word) {
            w = parseInt(w, 10)

            let key = buildKey(word, w)

            if (typeof context[key] == 'undefined') {
              console.log(word, 'is misspelled!')

              skip = true

              break
            } else {
              context = context[key]
            }
          }

          context = matrix

          if (skip) {
            continue
          }
        }
      })
    }
  })
})
