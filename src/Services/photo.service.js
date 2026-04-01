// src/services/camera/photo.service.js

import { isCameraReady } from './camera.core.service'

export const takePhotoService = async (
  cameraRef,
  flash = 'off'
) => {
  if (!isCameraReady(cameraRef)) return null

  try {
    const photo = await cameraRef.current.takePhoto({
      flash,
      qualityPrioritization: 'quality',
      skipMetadata: false,
    })

    console.log('Photo captured:', photo)
    return photo

  } catch (error) {
    console.log('Photo error:', error)
    return null
  }
}