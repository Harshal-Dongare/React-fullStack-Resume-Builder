// Restrict `Add New Template` button to only admin
export const adminIds = ["103712296288785535435", "118261009066400641277"];

// Check image file type before uploading
export const checkFileType = (file) => {
    const types = ["image/png", "image/jpeg", "image/jpg"];
    return types.includes(file.type);
};

// Initial Tags for New Template
export const initialTags = [
    "Software Engineer",
    "Front-end Developer",
    "Back-end Developer",
    "Full-stack Developer",
    "Web Developer",
    "UI/UX Designer",
    "Graphic Designer",
    "Data Scientist",
    "Product Manager",
    "Project Manager",
    "Business Analyst",
    "Marketing Manager",
    "Sales Representative",
    "Customer Service Representative",
    "HR Manager",
    "Financial Analyst",
    "Content Writer",
    "Teacher/Educator",
    "Healthcare Professional",
    "Legal Counsel",
];
