import { toast, ToastOptions } from "react-toastify";

/**
 * Утилиты для отображения уведомлений
 */

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  /**
   * Успешное выполнение операции
   */
  success: (message: string, description?: string) => {
    const content = description ? (
      <div>
        <div className="font-medium">{message}</div>
        <div className="text-sm opacity-90 mt-1">{description}</div>
      </div>
    ) : (
      message
    );
    toast.success(content, defaultOptions);
  },

  /**
   * Ошибка при выполнении операции
   */
  error: (message: string, description?: string) => {
    const content = description ? (
      <div>
        <div className="font-medium">{message}</div>
        <div className="text-sm opacity-90 mt-1">{description}</div>
      </div>
    ) : (
      message
    );
    toast.error(content, { ...defaultOptions, autoClose: 4000 });
  },

  /**
   * Информационное сообщение
   */
  info: (message: string, description?: string) => {
    const content = description ? (
      <div>
        <div className="font-medium">{message}</div>
        <div className="text-sm opacity-90 mt-1">{description}</div>
      </div>
    ) : (
      message
    );
    toast.info(content, defaultOptions);
  },

  /**
   * Предупреждение
   */
  warning: (message: string, description?: string) => {
    const content = description ? (
      <div>
        <div className="font-medium">{message}</div>
        <div className="text-sm opacity-90 mt-1">{description}</div>
      </div>
    ) : (
      message
    );
    toast.warning(content, { ...defaultOptions, autoClose: 3500 });
  },

  /**
   * Загрузка с возможностью обновления
   */
  loading: (message: string) => {
    return toast.loading(message, defaultOptions);
  },

  /**
   * Промис с автоматическими уведомлениями
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) => {
    return toast.promise(
      promise,
      {
        pending: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      defaultOptions,
    );
  },
};
