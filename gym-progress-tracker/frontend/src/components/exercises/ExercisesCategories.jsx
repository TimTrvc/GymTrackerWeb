import ExerciseCategoryCard from "./ExerciseCategoryCard.jsx";

const ExercisesCategories = ({ categories }) => {
    console.log(categories);
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {categories.map((category, index) => (
                <ExerciseCategoryCard
                    key={index}
                    name={category.name}
                    description={category.description}
                />
            ))}
        </div>
    );
};

export default ExercisesCategories;