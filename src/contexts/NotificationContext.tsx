import React, { createContext, useContext, useState, useCallback } from "react";

export interface NotificationContextType {
  showNotification: (
    message: string,
    type?: "success" | "error" | "info"
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  timestamp: number;
}

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (message: string, type: "success" | "error" | "info" = "success") => {
      const notification: Notification = {
        id: Date.now().toString(),
        message,
        type,
        timestamp: Date.now(),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, 3000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {/* Notification Display */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              pointer-events-auto transform transition-all duration-300 ease-in-out
              animate-slide-in-right max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4
              ${
                notification.type === "success"
                  ? "border-l-green-500"
                  : notification.type === "error"
                  ? "border-l-red-500"
                  : "border-l-blue-500"
              }
              p-4 flex items-center space-x-3
            `}
          >
            <div
              className={`
              flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
              ${
                notification.type === "success"
                  ? "bg-green-100 text-green-600"
                  : notification.type === "error"
                  ? "bg-red-100 text-red-600"
                  : "bg-blue-100 text-blue-600"
              }
            `}
            >
              {notification.type === "success" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {notification.type === "error" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              {notification.type === "info" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
