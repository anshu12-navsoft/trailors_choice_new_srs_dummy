import React,
{
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
  memo,
} from 'react'

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  AppState,
} from 'react-native'

import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCameraFormat,
  useCodeScanner,
  useFrameProcessor,
} from 'react-native-vision-camera'

import { useIsFocused } from '@react-navigation/native'

import Reanimated,
{
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated'

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)

const VisionCamera = forwardRef((props, ref) => {

  const {
    enableQR = true,
    enableHDR = false,
    defaultFPS = 30,
    onScanResult,
    showControls = true,
  } = props

  const cameraRef = useRef(null)
  const isFocused = useIsFocused()

  const { hasPermission, requestPermission } = useCameraPermission()

  const [appState, setAppState] = useState(AppState.currentState)
  const [cameraPosition, setCameraPosition] = useState('back')
  const [fps, setFps] = useState(defaultFPS)
  const [hdr, setHdr] = useState(enableHDR)
  const [isRecording, setIsRecording] = useState(false)
  const [flash, setFlash] = useState('off')
  const [isBusy, setIsBusy] = useState(false)

  const device = useCameraDevice(cameraPosition)

  const zoom = useSharedValue(1)
  const exposure = useSharedValue(0)

  const isActive = isFocused && appState === 'active'

  /* =========================
     FORMAT FALLBACK LOGIC
  ========================== */

  const format = useCameraFormat(device, [
    { videoResolution: { width: 3840, height: 2160 } },
    { videoResolution: { width: 1920, height: 1080 } },
    { fps },
    { hdr },
  ])

  /* =========================
     QR / BARCODE SCANNER
  ========================== */

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'upc-a', 'pdf-417'],
    onCodeScanned: codes => {
      if (!codes?.length) return

      onScanResult?.(codes.map(c => ({
        value: c.value,
        type: c.type,
      })))
    },
  })

  /* =========================
     FRAME PROCESSOR
  ========================== */

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    // Future AI logic here
  }, [])

  /* =========================
     CAMERA FUNCTIONS
  ========================== */

  const takePhoto = async () => {
    if (!cameraRef.current || isBusy) return
    setIsBusy(true)

    const photo = await cameraRef.current.takePhoto({
      flash,
      qualityPrioritization: 'quality',
      skipMetadata: false,
    })

    setIsBusy(false)
    return photo
  }

  const takeSnapshot = async () => {
    return await cameraRef.current?.takeSnapshot()
  }

  const startRecording = () => {
    if (!cameraRef.current || isRecording) return

    setIsRecording(true)

    cameraRef.current.startRecording({
      flash,
      videoStabilizationMode: 'auto',
      onRecordingFinished: video => {
        setIsRecording(false)
      },
      onRecordingError: () => {
        setIsRecording(false)
      },
    })
  }

  const stopRecording = async () => {
    await cameraRef.current?.stopRecording()
    setIsRecording(false)
  }

  const pauseRecording = () =>
    cameraRef.current?.pauseRecording()

  const resumeRecording = () =>
    cameraRef.current?.resumeRecording()

  const switchCamera = () => {
    if (isRecording) return
    setCameraPosition(prev =>
      prev === 'back' ? 'front' : 'back'
    )
  }

  const setZoomLevel = value => {
    if (!device) return
    const clamped = Math.max(
      device.minZoom,
      Math.min(device.maxZoom, value)
    )
    zoom.value = withTiming(clamped, { duration: 200 })
  }

  const setExposureLevel = value => {
    exposure.value = withTiming(value, { duration: 200 })
  }

  /* =========================
     TAP TO FOCUS
  ========================== */

  const focus = async (x, y) => {
    await cameraRef.current?.focus({ x, y })
  }

  /* =========================
     EXPOSE METHODS
  ========================== */

  useImperativeHandle(ref, () => ({
    takePhoto,
    takeSnapshot,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    switchCamera,
    setZoom: setZoomLevel,
    setExposure: setExposureLevel,
    setFlash,
    setFPS: setFps,
    enableHDR: setHdr,
    focus,
  }))

  /* =========================
     PERMISSION
  ========================== */

  useEffect(() => {
    if (!hasPermission) requestPermission()
  }, [])

  useEffect(() => {
    const sub = AppState.addEventListener(
      'change',
      setAppState
    )
    return () => sub.remove()
  }, [])

  const animatedProps = useAnimatedProps(() => ({
    zoom: zoom.value,
    exposure: exposure.value,
  }))

  if (!device || !format || !hasPermission)
    return null

  return (
    <View style={styles.container}>
      <ReanimatedCamera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        format={format}
        fps={fps}
        photo
        video
        audio
        lowLightBoost
        animatedProps={animatedProps}
        enableZoomGesture
        codeScanner={enableQR ? codeScanner : undefined}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        torch={flash === 'torch' ? 'on' : 'off'}
      />

      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={takePhoto}>
            <Text style={styles.button}>📸</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={
              isRecording
                ? stopRecording
                : startRecording
            }
          >
            <Text style={styles.button}>
              {isRecording ? '⏹' : '🎥'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={switchCamera}>
            <Text style={styles.button}>🔄</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
})

export default memo(VisionCamera)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  controls: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  button: {
    fontSize: 28,
    marginHorizontal: 20,
    color: 'white',
  },
})
