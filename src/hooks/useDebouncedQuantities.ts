import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useAppDispatch } from '../store';
import { setQuantity } from '../store/cartSlice';
export function useDebouncedQuantities(delay = 300) {
  const dispatch = useAppDispatch();

  const [drafts, setDrafts] = useState<Record<string, number>>({});

  const timers = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});

  const pending = useRef<Record<string, number>>({});

  // Cập nhật Redux sau khi ngừng thao tác
  const commit = useCallback(
    (id: string) => {
      const quantity = pending.current[id];

      if (quantity === undefined) return;

      dispatch(setQuantity({ id, quantity }));

      delete pending.current[id];
      delete timers.current[id];

      setDrafts(current => {
        const next = { ...current };
        delete next[id];
        return next;
      });
    },
    [dispatch]
  );

  // Cập nhật giao diện ngay, Redux sau 300ms
  const changeQuantity = useCallback(
    (id: string, quantity: number) => {
      pending.current[id] = quantity;

      setDrafts(current => ({
        ...current,
        [id]: quantity,
      }));

      clearTimeout(timers.current[id]);

      timers.current[id] = setTimeout(
        () => commit(id),
        delay
      );
    },
    [commit, delay]
  );

  // Huỷ thay đổi đang chờ (sử dụng ở Bài 2)
  const discard = useCallback((id: string) => {
    clearTimeout(timers.current[id]);

    delete timers.current[id];
    delete pending.current[id];

    setDrafts(current => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  }, []);

const flush = useCallback(() => {
  Object.values(timers.current).forEach(clearTimeout);

  const changes = Object.entries(pending.current);

  pending.current = {};
  timers.current = {};

  changes.forEach(([id, quantity]) => {
    dispatch(setQuantity({ id, quantity }));
  });

  setDrafts({});
}, [dispatch]);

  // Ghi các thay đổi đang chờ khi rời màn hình
  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);

      Object.entries(pending.current).forEach(
        ([id, quantity]) => {
          dispatch(setQuantity({ id, quantity }));
        }
      );
    };
  }, [dispatch]);

  return {
    drafts,
    changeQuantity,
    discard,
    flush,
  };
}