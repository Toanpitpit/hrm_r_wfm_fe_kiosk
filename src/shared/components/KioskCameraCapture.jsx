import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertTriangle, UploadCloud, ArrowRight, XCircle } from 'lucide-react';
import { attendanceService } from '@/modules/attendance/services/attendance.service';

/**
 * Component chụp ảnh chân dung webcam trên Kiosk
 * Luồng V3: Chụp ảnh trực tiếp từ webcam -> trích xuất Base64 -> gọi callback onConfirmCapture
 */
export const KioskCameraCapture = ({
  folder = 'attendance/checkin',
  actionType = 'CHECK_IN',
  onConfirmCapture,
  onPhotoUploaded,
  onReset,
  onCancel,
  timeoutSeconds = null,
  isUploading = false,
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const [capturedPreview, setCapturedPreview] = useState(null);
  const [localUploading, setLocalUploading] = useState(false);
  const [uploadedKey, setUploadedKey] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const uploading = isUploading || localUploading;

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

  // Lấy ảnh từ Canvas/Webcam thành Data URL
  const getCapturedDataUrl = () => {
    if (cameraActive && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.85);
    } else {
      // Chế độ fallback nếu máy không có camera
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ẢNH XÁC THỰC KIOSK (DEMO)', 320, 220);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText(new Date().toLocaleString('vi-VN'), 320, 260);

      return canvas.toDataURL('image/jpeg', 0.85);
    }
  };

  // Bấm Chụp ảnh (Hiện preview)
  const handleSnap = () => {
    const dataUrl = getCapturedDataUrl();
    setCapturedPreview(dataUrl);
    setUploadError(null);
  };

  // Xác nhận ảnh và gửi đi
  const handleConfirm = async () => {
    const dataUrl = capturedPreview || getCapturedDataUrl();
    if (!capturedPreview) {
      setCapturedPreview(dataUrl);
    }

    // Nếu có callback V3 onConfirmCapture:
    if (onConfirmCapture) {
      onConfirmCapture(dataUrl);
      return;
    }

    // Fallback cho luồng cũ:
    setLocalUploading(true);
    setUploadError(null);
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const imageFile = new File([blob], `kiosk-attendance-${Date.now()}.jpg`, { type: 'image/jpeg' });
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
      setLocalUploading(false);
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
              <div className="w-48 h-60 border-2 border-dashed border-emerald-400/80 rounded-full shadow-[0_0_25px_rgba(52,211,153,0.35)] animate-pulse flex items-center justify-center">
                <span className="text-[10px] text-emerald-300 font-bold bg-slate-950/80 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/40">
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
            {uploading && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center space-y-3 p-4">
                <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-black text-white uppercase tracking-wider bg-slate-900/90 border border-emerald-500/50 px-4 py-1.5 rounded-xl">
                  ĐANG TẢI ẢNH LÊN MÁY CHỦ S3...
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

      {/* Action Buttons — Touchscreen Friendly (h-14 / h-16) */}
      <div className="w-full flex items-center gap-2 pt-1">
        {!capturedPreview ? (
          <button
            type="button"
            disabled={uploading}
            onClick={handleConfirm}
            className={`w-full h-16 rounded-2xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2.5 shadow-xl transition-all active:scale-95 disabled:opacity-50 select-none ${
              actionType === 'CHECK_IN'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30'
            }`}
          >
            <Camera className="w-6 h-6" />
            <span>CHỤP ẢNH & HOÀN TẤT ĐIỂM DANH</span>
          </button>
        ) : (
          <div className="w-full flex items-center gap-2">
            <button
              type="button"
              disabled={uploading}
              onClick={handleRetake}
              className="flex-1 h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border border-slate-700 select-none"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Chụp Lại</span>
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={handleConfirm}
              className={`flex-2 h-14 rounded-2xl font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50 select-none ${
                actionType === 'CHECK_IN'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {uploading ? (
                <>
                  <UploadCloud className="w-4 h-4 animate-bounce" />
                  <span>ĐANG GỬI ẢNH...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>XÁC NHẬN GỬI ẢNH</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Nút Hủy điểm danh & Thoát ra cho người khác (Dành cho người dùng muốn hủy hoặc nhường lượt) */}
      {onCancel && (
        <div className="w-full pt-1">
          <button
            type="button"
            disabled={uploading}
            onClick={onCancel}
            className="w-full h-12 rounded-2xl bg-slate-900/80 hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-slate-700/80 hover:border-red-500/50 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
          >
            <XCircle className="w-4 h-4 text-red-400" />
            <span>HỦY ĐIỂM DANH & THOÁT RA</span>
            {timeoutSeconds !== null && (
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono border border-slate-700">
                Tự động thoát {timeoutSeconds}s
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default KioskCameraCapture;

