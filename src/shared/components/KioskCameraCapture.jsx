import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, UploadCloud } from 'lucide-react';
import { attendanceService } from '@/modules/attendance/services/attendance.service';

/**
 * Component chụp ảnh chân dung webcam trên Kiosk
 * Thực thi Quy trình 2 bước: Chụp ảnh ➔ Upload file FormData lên API 1 S3 nhận photoKey
 */
export const KioskCameraCapture = ({
  folder = 'attendance/checkin',
  onPhotoUploaded,
  onReset,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const [capturedPreview, setCapturedPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Mở webcam khi component được nạp
  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });
      setStream(mediaStream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Không thể mở webcam:', err);
      setCameraError('Không tìm thấy Camera thiết bị hoặc quyền truy cập bị từ chối.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Gắn stream vào video tag nếu chưa gắn
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Thực hiện chụp ảnh và upload file FormData lên S3
  const handleCaptureAndUpload = async () => {
    setUploadError(null);
    let imageFile = null;

    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPreview(dataUrl);

      // Chuyển canvas sang Blob/File
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      imageFile = new File([blob], `kiosk-attendance-${Date.now()}.jpg`, { type: 'image/jpeg' });
    } else {
      // Chế độ fallback nếu máy không có camera
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ẢNH GIẢ LẬP DEMO KIOSK', 320, 240);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPreview(dataUrl);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      imageFile = new File([blob], `mock-kiosk-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
    }

    if (!imageFile) return;

    setIsUploading(true);
    try {
      // Gọi API 1: Upload file chuẩn multipart/form-data lên S3
      const res = await attendanceService.uploadPhoto(imageFile, folder);
      if (res.success && res.data?.photoKey) {
        setUploadedKey(res.data.photoKey);
        if (onPhotoUploaded) {
          onPhotoUploaded(res.data.photoKey, res.data.presignedUrl);
        }
      } else {
        setUploadError(res.message || 'Không thể upload ảnh xác thực lên S3.');
      }
    } catch (err) {
      setUploadError('Lỗi kết nối khi tải ảnh lên máy chủ S3.');
    } finally {
      setIsUploading(false);
    }
  };

  // Chụp lại ảnh khác
  const handleRetake = () => {
    setCapturedPreview(null);
    setUploadedKey(null);
    setUploadError(null);
    if (onReset) onReset();
    startCamera();
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative w-full aspect-[4/3] rounded-2xl bg-slate-900 border-2 border-slate-700/80 overflow-hidden shadow-2xl flex flex-col items-center justify-center">
        {/* Live Camera Stream */}
        {!capturedPreview && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
            {/* Oval Face Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-60 border-2 border-dashed border-emerald-400/70 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.3)] animate-pulse flex items-center justify-center">
                <span className="text-[10px] text-emerald-300 font-bold bg-slate-900/80 px-2 py-1 rounded-full uppercase tracking-wider">
                  Căn Gương Mặt Tại Đây
                </span>
              </div>
            </div>
            {/* Live Camera Badge */}
            <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-700 px-3 py-1 rounded-xl text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>CAMERA KIOSK HOẠT ĐỘNG</span>
            </div>
          </>
        )}

        {/* Captured Preview */}
        {capturedPreview && (
          <div className="relative w-full h-full">
            <img src={capturedPreview} alt="Kiosk Preview" className="w-full h-full object-cover" />
            {uploadedKey && (
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 p-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                <span className="text-xs font-black text-white uppercase tracking-wider bg-emerald-600/40 border border-emerald-500 px-3 py-1 rounded-xl">
                  ĐÃ TẢI ẢNH LÊN S3 THÀNH CÔNG
                </span>
                <span className="text-[10px] text-slate-300 font-mono truncate max-w-xs">
                  Key: {uploadedKey}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Camera Warning / Fallback Notice */}
        {cameraError && !capturedPreview && (
          <div className="absolute inset-0 bg-slate-950/90 p-4 flex flex-col items-center justify-center text-center space-y-2">
            <AlertTriangle className="w-10 h-10 text-amber-400 mb-1" />
            <p className="text-xs text-amber-200 font-semibold">{cameraError}</p>
            <p className="text-[11px] text-slate-400">
              Hệ thống sẽ tự động sử dụng ảnh xác thực mẫu để không chặn thử nghiệm.
            </p>
          </div>
        )}

        {/* Hidden Canvas element */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-bold">
          {uploadError}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {!uploadedKey ? (
          <button
            type="button"
            disabled={isUploading}
            onClick={handleCaptureAndUpload}
            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <UploadCloud className="w-4 h-4 animate-bounce text-white" />
                <span>ĐANG UPLOAD ẢNH LÊN S3...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>CHỤP ẢNH XÁC THỰC S3</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRetake}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Chụp Lại Ảnh Khác</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default KioskCameraCapture;
