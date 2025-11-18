import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, User, CheckCircle2, Loader2, Flag, AlertTriangle } from 'lucide-react';
import type { Complaint, UserProfile } from '../backend';
import { ComplaintStatus, ReportStatus } from '../backend';
import { useUpdateComplaintStatus, useReportComplaint } from '../hooks/useQueries';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';

interface ForumComplaintCardProps {
  complaint: Complaint;
  isAdmin: boolean;
}

export default function ForumComplaintCard({ complaint, isAdmin }: ForumComplaintCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const updateStatus = useUpdateComplaintStatus();
  const reportComplaint = useReportComplaint();
  const { actor } = useActor();

  const { data: submitterProfile } = useQuery<UserProfile | null>({
    queryKey: ['userProfile', complaint.submitter.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(complaint.submitter);
    },
    enabled: !!actor,
  });

  const isResolved = complaint.status === ComplaintStatus.resolved;
  const isReported = complaint.reportStatus === ReportStatus.reported;

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleToggleResolved = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await updateStatus.mutateAsync({
        complaintId: complaint.id,
        isResolved: checked,
      });
      toast.success(
        checked ? 'Khiếu nại đã được đánh dấu là đã giải quyết' : 'Khiếu nại đã được đánh dấu là chưa giải quyết'
      );
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
      console.error('Status update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleReport = async () => {
    setIsReporting(true);
    try {
      await reportComplaint.mutateAsync({
        complaintId: complaint.id,
        isReported: !isReported,
      });
      toast.success(
        !isReported ? 'Khiếu nại đã được báo cáo' : 'Đã bỏ báo cáo khiếu nại'
      );
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái báo cáo. Vui lòng thử lại.');
      console.error('Report error:', error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <Card
      className={`${
        isReported
          ? 'border-2 border-destructive bg-destructive/5 dark:border-destructive dark:bg-destructive/10'
          : isResolved
          ? 'border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20'
          : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{submitterProfile?.name || 'Đang tải...'}</span>
              {submitterProfile?.building && submitterProfile?.apartmentNumber && (
                <span className="text-sm text-muted-foreground">
                  • {submitterProfile.building}, Căn hộ {submitterProfile.apartmentNumber}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(complaint.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(complaint.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isReported && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Đã Báo Cáo
              </Badge>
            )}
            {isResolved && (
              <Badge className="gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle2 className="h-3 w-3" />
                Đã Giải Quyết
              </Badge>
            )}
            {isAdmin && (
              <>
                <div className="flex items-center gap-2">
                  {isUpdating ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <>
                      <Checkbox
                        id={`resolved-${complaint.id}`}
                        checked={isResolved}
                        onCheckedChange={handleToggleResolved}
                        disabled={isUpdating}
                      />
                      <label
                        htmlFor={`resolved-${complaint.id}`}
                        className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Đã giải quyết
                      </label>
                    </>
                  )}
                </div>
                <Button
                  variant={isReported ? 'outline' : 'destructive'}
                  size="sm"
                  onClick={handleToggleReport}
                  disabled={isReporting}
                  className="gap-1"
                >
                  {isReporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Flag className="h-4 w-4" />
                  )}
                  {isReported ? 'Bỏ Báo Cáo' : 'Báo Cáo'}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{complaint.location}</span>
        </div>
        <p className={`mb-4 text-sm ${isResolved ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
          {complaint.description}
        </p>
        {complaint.photo && (
          <img
            src={complaint.photo.getDirectURL()}
            alt="Khiếu nại"
            className={`h-64 w-full rounded-lg object-cover ${isResolved ? 'opacity-60' : ''}`}
          />
        )}
      </CardContent>
    </Card>
  );
}
