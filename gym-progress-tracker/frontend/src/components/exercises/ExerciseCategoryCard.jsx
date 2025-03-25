import React from 'react';

const ExerciseCategoryCard = ({ name, description, category_id }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
            <div className="bg-red-100 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </div>
    );
};

export default ExerciseCategoryCard;