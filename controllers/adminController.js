const _create = (req, res) => {
  res.json({ ok: true, msg: "created now" })
}

const _fetch = (req, res) => {
  res.json({ ok: true, msg: "fetched now" })
}

export default { _create, _fetch }