import { getAllCourses } from "@/lib/data"
import CourseList from "@/components/course-list"
import CourseSearch from "@/components/course-search"

export default function CoursesPage() {
  const courses = getAllCourses()

  // Group courses by category
  const categories = [...new Set(courses.map((course) => course.category))]

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Explore Courses</h1>

      {/* Search and Filter */}
      <CourseSearch />

      {/* Course Lists by Category */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-bold mb-4">{category}</h2>
            <CourseList courses={courses.filter((course) => course.category === category)} />
          </div>
        ))}
      </div>
    </div>
  )
}
