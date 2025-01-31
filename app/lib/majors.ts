export const COMPUTER_SCIENCE_MAJORS = ["Computer Science", "Computational Science", "Comp Science", "Math"]
export const EARTH_SCIENCE_MAJORS = ["Earth Systems", "Earth & Planetary Science", "Environmental Earth Science", "Environmental Science", "Environmental Engineering"]

export const AERO_MAJORS = ["Aerospace Engineering", "Aeronautical/Astronautical Engineering", "Aeronautical Engineering", "Astronautical Engineering"];

export const CIVIL_MAJORS = ["Civil Engineering", "Structural Engineering", "Civil", "Structural"];

export const SYSTEMS_ENGINEERING_MAJORS = ["Symbolic Systems", "Product Design"];

export const BIO_ENGINEERING_MAJORS = ["Bioengineering", "Biomedical", "Biochemical"];

export const enum DEPARTMENT {
    COMPUTER_SCIENCE = "Math and Computer Science",
    EARTH_SCIENCE = "Earth and Environmental Sciences",
    AERO_ENGINEERING = "Aerospace and Aeronautical Engineering",
    CIVIL_ENGINEERING = "Civil Engineering",
    SYSTEMS_ENGINEERING = "Industrial and Systems Engineering",
    BIO_ENGINEERING = "Biomedical and Biochemical Engineering",
    OTHER = "Other"
}

export const MAJORS_MAP = new Map<DEPARTMENT, string[]>([
    [DEPARTMENT.COMPUTER_SCIENCE, COMPUTER_SCIENCE_MAJORS],
    [DEPARTMENT.EARTH_SCIENCE, EARTH_SCIENCE_MAJORS],
    [DEPARTMENT.AERO_ENGINEERING, AERO_MAJORS],
    [DEPARTMENT.CIVIL_ENGINEERING, CIVIL_MAJORS],
    [DEPARTMENT.SYSTEMS_ENGINEERING, SYSTEMS_ENGINEERING_MAJORS],
    [DEPARTMENT.BIO_ENGINEERING, BIO_ENGINEERING_MAJORS]
]);

export const getDepartmentByMajor = (major: string): DEPARTMENT => {
    let department: DEPARTMENT = DEPARTMENT.OTHER;
    MAJORS_MAP.forEach((value, key) => {
        if (MAJORS_MAP.get(key)?.includes(major)) {
            department = key;
        }
    });

    return department;
}