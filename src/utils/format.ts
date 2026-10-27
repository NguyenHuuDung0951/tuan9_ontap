export const formatVND = (price: number): string => {
  return price.toLocaleString('vi-VN') + ' đ';
};
