# Hệ Thống Đăng Khiếu Nại Lên Cho Cư Dân Chung Cư

## Tổng Quan
Hệ thống đăng khiếu nại lên cho phép cư dân chung cư đăng và xem các vấn đề về đường ống nước trong định dạng diễn đàn đơn giản. Chỉ có chủ sở hữu/quản lý bất động sản mới có thể đánh dấu khiếu nại là "đã giải quyết" và báo cáo khiếu nại không phù hợp.

## Logo Ứng Dụng
- Sử dụng logo "MEGABLUE" được cung cấp làm logo chính của ứng dụng
- Logo hiển thị ở header/đầu trang của ứng dụng

## Xác Thực Người Dùng
- Hệ thống đăng nhập để xác định cư dân và quản trị viên
- Hai vai trò người dùng: Cư dân và Quản trị viên (chủ sở hữu/quản lý bất động sản)

## Giao Diện Diễn Đàn Chung
- Một trang duy nhất hiển thị tất cả khiếu nại theo định dạng danh sách diễn đàn
- Tất cả người dùng (cư dân và quản trị viên) đều xem cùng một danh sách khiếu nại
- Khiếu nại được sắp xếp theo thời gian (mới nhất trước)
- Mỗi khiếu nại hiển thị: tên người gửi, vị trí, mô tả, thời gian đăng, trạng thái giải quyết, trạng thái báo cáo

## Tính Năng Cho Cư Dân
- Đăng khiếu nại mới trực tiếp vào danh sách diễn đàn với:
  - Vị trí trong căn hộ/tòa nhà
  - Mô tả vấn đề đường ống nước
  - Tải ảnh lên (tùy chọn)
- Xem tất cả khiếu nại trong diễn đàn (bao gồm của người khác)
- Không thể chỉnh sửa hoặc xóa khiếu nại sau khi đăng

## Tính Năng Cho Quản Trị Viên
- Xem tất cả khiếu nại trong cùng giao diện diễn đàn như cư dân
- Đánh dấu khiếu nại là "đã giải quyết" bằng checkbox hoặc nút bên cạnh mỗi khiếu nại
- Có thể bỏ đánh dấu "đã giải quyết" nếu cần thiết
- Báo cáo khiếu nại không phù hợp bằng nút "Báo cáo" hiển thị trên mỗi thẻ khiếu nại
- Có thể bỏ báo cáo khiếu nại nếu cần thiết
- Xem chi tiết khiếu nại bao gồm ảnh và mô tả đầy đủ

## Hệ Thống Trạng Thái Khiếu Nại
- Hai trạng thái giải quyết: chưa giải quyết và đã giải quyết
- Hai trạng thái báo cáo: bình thường và đã báo cáo
- Chỉ quản trị viên mới có thể thay đổi cả hai loại trạng thái
- Khiếu nại đã giải quyết được hiển thị khác biệt (ví dụ: màu xám hoặc có dấu tick)
- Khiếu nại đã báo cáo được đánh dấu rõ ràng (ví dụ: viền đỏ hoặc biểu tượng cảnh báo)

## Lưu Trữ Dữ Liệu (Backend)
- Tài khoản người dùng và dữ liệu xác thực
- Hồ sơ khiếu nại bao gồm người gửi, vị trí, mô tả, thời gian đăng, trạng thái giải quyết, trạng thái báo cáo
- Ảnh tải lên liên quan đến khiếu nại
- Lịch sử thay đổi trạng thái giải quyết và báo cáo

## Giao Diện Người Dùng
- Thiết kế diễn đàn đơn giản, sạch sẽ
- Một trang duy nhất cho tất cả chức năng
- Biểu tượng và nút điều khiển dựa trên vai trò người dùng
- Nút "Báo cáo" chỉ hiển thị cho quản trị viên trên mỗi thẻ khiếu nại
- Thiết kế đáp ứng cho máy tính để bàn và di động
- Giao diện tiếng Việt
- Tất cả tiêu đề, nút bấm và văn bản hiển thị sử dụng thuật ngữ "Đăng khiếu nại lên" thay vì "Diễn đàn khiếu nại"
- Footer component có thông tin attribution về caffeine.ai được hiển thị tối thiểu và không nổi bật
