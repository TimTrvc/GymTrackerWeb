import ExerciseCategoryCard from "./ExerciseCategoryCard.jsx";
import Hoverer from "@/components/animation/Hoverer.jsx";

const ExercisesCategories = ({ categories, onCategoryClick }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {categories.map((category, index) => (
                <Hoverer key={index}>
                    <ExerciseCategoryCard
                        name={category.name}
                        description={category.description}
                        category_id={category.category_id}
                        onCategoryClick={onCategoryClick}
                    />
                </Hoverer>
            ))}
        </div>
    );
};

export default ExercisesCategories;
