import { useState } from 'react';
import { useGetAllComplaints, useIsCallerAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import ComplaintForm from '../components/ComplaintForm';
import ForumComplaintCard from '../components/ForumComplaintCard';

export default function ForumPage() {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const { data: complaints = [], isLoading } = useGetAllComplaints();
  const { data: isAdmin } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Đang tải khiếu nại...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đăng Khiếu Nại Lên</h1>
          <p className="mt-2 text-muted-foreground">
            Tất cả khiếu nại về vấn đề đường ống nước trong chung cư
          </p>
        </div>
        <Button onClick={() => setShowComplaintForm(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Đăng Khiếu Nại Mới
        </Button>
      </div>

      {complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16">
          <img
            src="/assets/generated/forum-post-icon-transparent.dim_64x64.png"
            alt="Không có khiếu nại"
            className="mb-4 h-16 w-16 opacity-50"
          />
          <p className="text-lg font-medium text-muted-foreground">
            Chưa có khiếu nại nào được đăng
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Hãy là người đầu tiên đăng khiếu nại
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <ForumComplaintCard
              key={complaint.id}
              complaint={complaint}
              isAdmin={isAdmin || false}
            />
          ))}
        </div>
      )}

      <ComplaintForm open={showComplaintForm} onClose={() => setShowComplaintForm(false)} />
    </div>
  );
}
