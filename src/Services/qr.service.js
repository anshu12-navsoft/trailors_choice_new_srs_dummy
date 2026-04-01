// src/services/camera/qr.service.js

export const formatQrResultService = (codes) => {
  if (!codes?.length) return null

  return codes.map(code => ({
    value: code.value,
    type: code.type,
  }))
}