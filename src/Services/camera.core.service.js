// src/services/camera/camera.core.service.js

export const isCameraReady = (cameraRef) => {
  if (!cameraRef?.current) {
    console.log('Camera not ready')
    return false
  }
  return true
}

export const buildFileUri = (path) => {
  if (!path) return null
  return `file://${path}`
}                                                                                                    