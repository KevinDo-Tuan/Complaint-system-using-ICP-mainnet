import { useState } from 'react';
import { useSubmitComplaint } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob } from '../backend';

interface ComplaintFormProps {
  open: boolean;
  onClose: () => void;
}

export default function ComplaintForm({ open, onClose }: ComplaintFormProps) {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const submitComplaint = useSubmitComplaint();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh phải nhỏ hơn 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim() || !description.trim()) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      let photoBlob: ExternalBlob | null = null;

      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        photoBlob = ExternalBlob.fromBytes(uint8Array);
      }

      await submitComplaint.mutateAsync({
        location: location.trim(),
        description: description.trim(),
        photo: photoBlob,
      });

      toast.success('Khiếu nại đã được gửi thành công!');
      setLocation('');
      setDescription('');
      setPhotoFile(null);
      setPhotoPreview(null);
      onClose();
    } catch (error) {
      toast.error('Không thể gửi khiếu nại. Vui lòng thử lại.');
      console.error('Complaint submission error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gửi Khiếu Nại Mới</DialogTitle>
          <DialogDescription>
            Báo cáo vấn đề về đường ống nước trong căn hộ của bạn. Vui lòng cung cấp thông tin chi tiết nhất có thể.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="location">
              Vị Trí <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              placeholder="Ví dụ: Bồn rửa bát, Phòng tắm, Đường ống chính"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={submitComplaint.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Mô Tả <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết vấn đề về đường ống nước..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitComplaint.isPending}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Hình Ảnh (Tùy chọn)</Label>
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Xem trước"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={removePhoto}
                  disabled={submitComplaint.isPending}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-6">
                <label
                  htmlFor="photo"
                  className="flex cursor-pointer flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Nhấp để tải ảnh lên
                  </span>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                    disabled={submitComplaint.isPending}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={submitComplaint.isPending}
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1" disabled={submitComplaint.isPending}>
              {submitComplaint.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                'Gửi Khiếu Nại'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
