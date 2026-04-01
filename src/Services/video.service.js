// src/services/camera/video.service.js

import { isCameraReady } from './camera.core.service'

export const startRecordingService = (
  cameraRef,
  { onFinish, onError }
) => {
  if (!isCameraReady(cameraRef)) return

  cameraRef.current.startRecording({
    onRecordingFinished: (video) => {
      console.log('Video saved:', video)
      onFinish?.(video)
    },
    onRecordingError: (error) => {
      console.log('Video error:', error)
      onError?.(error)
    },
  })
}

export const stopRecordingService = async (cameraRef) => {
  if (!isCameraReady(cameraRef)) return
  await cameraRef.current.stopRecording()
}