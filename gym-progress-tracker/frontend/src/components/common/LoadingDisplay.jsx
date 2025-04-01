import React from "react";

const LoadingDisplay = ({ message = "Wird geladen..." }) => {
    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="text-center py-8">{message}</div>
        </div>
    );
};

export default LoadingDisplay;