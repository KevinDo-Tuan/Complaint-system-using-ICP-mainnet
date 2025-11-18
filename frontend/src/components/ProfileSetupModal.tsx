import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSetupModalProps {
  open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [building, setBuilding] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !building.trim() || !apartmentNumber.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        building: building.trim(),
        apartmentNumber: apartmentNumber.trim(),
      });
      toast.success('Hồ sơ đã được tạo thành công!');
    } catch (error) {
      toast.error('Không thể tạo hồ sơ. Vui lòng thử lại.');
      console.error('Profile creation error:', error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Hoàn Thiện Hồ Sơ Của Bạn</DialogTitle>
          <DialogDescription>
            Vui lòng cung cấp thông tin của bạn để tiếp tục sử dụng hệ thống quản lý khiếu nại.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và Tên</Label>
            <Input
              id="name"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saveProfile.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building">Tên Tòa Nhà</Label>
            <Input
              id="building"
              placeholder="Tòa A"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              disabled={saveProfile.isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="apartment">Số Căn Hộ</Label>
            <Input
              id="apartment"
              placeholder="101"
              value={apartmentNumber}
              onChange={(e) => setApartmentNumber(e.target.value)}
              disabled={saveProfile.isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo hồ sơ...
              </>
            ) : (
              'Tạo Hồ Sơ'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
