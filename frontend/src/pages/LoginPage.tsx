import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MessageSquare, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <img
                src="/assets/generated/megablue-logo.dim_200x80.png"
                alt="MEGABLUE"
                className="h-20 w-auto"
              />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Đăng Khiếu Nại Lên Chung Cư
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Nền tảng đơn giản để cư dân đăng và theo dõi các vấn đề về đường ống nước
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <Card className="border-2 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <img
                    src="/assets/generated/forum-post-icon-transparent.dim_64x64.png"
                    alt="Đăng khiếu nại"
                    className="h-8 w-8"
                  />
                </div>
                <CardTitle>Đăng Khiếu Nại</CardTitle>
                <CardDescription>
                  Cư dân có thể đăng khiếu nại về vấn đề đường ống nước trực tiếp lên hệ thống
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Xem Tất Cả</CardTitle>
                <CardDescription>
                  Tất cả khiếu nại hiển thị trong một danh sách duy nhất, dễ theo dõi
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 transition-all hover:shadow-lg">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <img
                    src="/assets/generated/solved-checkmark-icon-transparent.dim_64x64.png"
                    alt="Đánh dấu đã giải quyết"
                    className="h-8 w-8"
                  />
                </div>
                <CardTitle>Đánh Dấu Đã Giải Quyết</CardTitle>
                <CardDescription>
                  Quản trị viên có thể đánh dấu khiếu nại là đã giải quyết bằng một cú nhấp chuột
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Login Card */}
          <Card className="mx-auto max-w-md border-2 shadow-xl">
            <CardHeader className="text-center">
              <div className="mb-4 flex justify-center">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Đăng Nhập Bảo Mật</CardTitle>
              <CardDescription>
                Đăng nhập an toàn để truy cập hệ thống khiếu nại
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="w-full"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng Nhập'
                )}
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Được hỗ trợ bởi Internet Identity để xác thực an toàn
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
