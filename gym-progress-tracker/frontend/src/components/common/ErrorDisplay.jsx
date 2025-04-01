import React from "react";

const ErrorDisplay = ({ message = "Ein Fehler ist aufgetreten.", onRetry }) => {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="text-center py-8 text-red-600">
                <p>{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Erneut versuchen
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorDisplay;