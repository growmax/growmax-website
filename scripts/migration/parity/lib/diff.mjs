// Minimal unified-diff generator (no external dependency). Good enough for the
// short, whitespace-collapsed text blocks the parity harness diffs (SPEC-04 §4).

function lcsTable(a, b) {
  const n = a.length
  const m = b.length
  const table = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  return table
}

/** Line-level diff ops: {op: '=' | '-' | '+', line}. */
function diffLines(a, b) {
  const table = lcsTable(a, b)
  const ops = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      ops.push({ op: '=', line: a[i] })
      i++
      j++
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      ops.push({ op: '-', line: a[i] })
      i++
    } else {
      ops.push({ op: '+', line: b[j] })
      j++
    }
  }
  while (i < a.length) {
    ops.push({ op: '-', line: a[i] })
    i++
  }
  while (j < b.length) {
    ops.push({ op: '+', line: b[j] })
    j++
  }
  return ops
}

export function createTwoFilesPatch(nameA, nameB, textA, textB) {
  const a = textA.split('\n')
  const b = textB.split('\n')
  const ops = diffLines(a, b)
  const lines = [`--- ${nameA}`, `+++ ${nameB}`]
  for (const { op, line } of ops) {
    if (op === '=') lines.push(` ${line}`)
    else if (op === '-') lines.push(`-${line}`)
    else lines.push(`+${line}`)
  }
  return lines.join('\n')
}

export function firstNLines(patchText, n) {
  return patchText.split('\n').slice(0, n).join('\n')
}
