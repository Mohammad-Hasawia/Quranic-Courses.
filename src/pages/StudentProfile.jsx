import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getStudents,
  getAttendance,
  getCourses,
  getRecitationsByCourseId,
} from "../data/mockData";
import {
  ArrowRight,
  User,
  BookOpen,
  Award,
  Edit3,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  Plus,
  Clock,
  CheckCircle,
} from "lucide-react";

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [courses, setcourses] = useState([]);
  const [recitations, setRecitations] = useState([]);

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge(student?.birth_date);
  useEffect(() => {
    const fetchStudentCourses = async () => {
      if (!student || !student.courses) return;

      try {
        const allCourses = await getCourses(); // جلب جميع الكورسات
        const filteredCourses = allCourses.filter((course) =>
          student.courses.some((c) => c.id === course.id)
        );
        setcourses(filteredCourses);
      } catch (error) {
        console.error("خطأ أثناء تحميل الكورسات:", error);
      }
    };

    fetchStudentCourses();
  }, [student]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const students = await getStudents();
        const matchedStudent = students.find((s) => s.id.toString() === id);

        if (!matchedStudent) {
          console.warn("الطالب غير موجود.");
          navigate("/students");
          return;
        }

        setStudent(matchedStudent);
      } catch (error) {
        console.error("خطأ أثناء تحميل بيانات الطالب:", error);
        navigate("/students");
      }
    };

    fetchStudent();
  }, [id, navigate]);
  useEffect(() => {
    const fetchAttendance = async () => {
      const data = await getAttendance();
      setAttendance(data);
    };

    fetchAttendance();
  }, []);
  useEffect(() => {
  const fetchRecitations = async () => {
    if (!student || !student.courses) return;

    try {
      let allStudentRecitations = [];

      for (const course of student.courses) {
        const res = await getRecitationsByCourseId(course.id);

        if (!res.recitations_by_lesson) continue;

        for (const lesson of res.recitations_by_lesson) {
          const studentRecits = lesson.recitations?.filter(
            (r) => r.student_id?.toString() === student.id.toString()
          );

          // أضف معلومات الدرس لكل ريسايتشن (اختياري حسب الحاجة)
          const enrichedRecitations = studentRecits.map((r) => ({
            ...r,
            lesson_id: lesson.lesson_id,
            lesson_title: lesson.lesson_title,
            lesson_date: lesson.lesson_date,
            course_id: res.course_id,
            course_title: res.course_title,
          }));

          allStudentRecitations.push(...enrichedRecitations);
        }
      }

      setRecitations(allStudentRecitations);
    } catch (error) {
      console.error("خطأ أثناء تحميل الريسايتيشن:", error);
    }
  };

  fetchRecitations();
}, [student]);

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-cairo">جاري تحميل بيانات الطالب...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-islamic-gray-light">
      <div className="container mx-auto px-4 pt-24 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 rtl:space-x-reverse text-islamic-primary hover:text-islamic-light transition-colors font-cairo"
        >
          <ArrowRight size={20} />
          <span>العودة</span>
        </button>
      </div>
      {/* 🟢 ترحيب الطالب */}
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6 rtl:space-x-reverse mb-8">
            {/* 🟢 صورة الطالب الدائرية مع إطار ذهبي */}
            <div className="relative">
              <img
                src={student.image}
                alt={student.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-islamic-golden shadow-lg"
              />
            </div>

            {/* 🟢 رسالة الترحيب */}
            <div>
              <h1 className="font-amiri text-4xl font-bold text-islamic-golden mb-2">
                مرحباً {student.name}
              </h1>
              <p className="font-cairo text-xl text-gray-600">
                ملف الطالب - المتابعة والحفظ
              </p>
            </div>
          </div>

          {/* 🟢 معلومات الطالب الأساسية */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 🟢 بطاقات المعلومات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-islamic-gray-light p-4 rounded-lg text-center">
                <User size={24} className="text-islamic-primary mx-auto mb-2" />
                <h3 className="font-cairo font-bold text-lg text-islamic-dark">
                  {student.id}
                </h3>
                <p className="font-cairo text-gray-600 text-sm">رقم الطالب</p>
              </div>

              <div className="bg-islamic-gray-light p-4 rounded-lg text-center">
                <BookOpen
                  size={24}
                  className="text-islamic-golden mx-auto mb-2"
                />
                <h3 className="font-cairo font-bold text-lg text-islamic-dark">
                  {age !== null ? `${age} سنة` : "غير معروف"}
                </h3>
                <p className="font-cairo text-gray-600 text-sm">العمر</p>
              </div>

              <div className="bg-islamic-gray-light p-4 rounded-lg text-center">
                <Award size={24} className="text-islamic-light mx-auto mb-2" />
                <h3 className="font-cairo font-bold text-lg text-islamic-dark">
                  {student.quran_memorized_parts}
                </h3>
                <p className="font-cairo text-gray-600 text-sm">
                  الاجزاء المحفوظة{" "}
                </p>
              </div>
            </div>

            {/* 🟢 معلومات المدرس */}
            {student?.instructor ? (
              <div className="bg-islamic-gray-light p-6 rounded-lg">
                <h3 className="font-cairo font-bold text-xl text-islamic-golden mb-4">
                  معلومات المدرس المشرف
                </h3>
                <div className="flex items-center space-x-4 rtl:space-x-reverse mb-4">
                  <img
                    src={
                      student?.instructor.instructor_img ||
                      "/default-instructor.png"
                    }
                    alt={student?.instructor.name || "مدرس"}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-cairo font-bold text-lg text-islamic-dark">
                      {student?.instructor.name || "غير معروف"}
                    </h4>
                    <p className="font-cairo text-gray-600">
                      {student?.instructor.certificate || "شهادة غير متوفرة"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Mail size={16} className="text-islamic-primary" />
                    <span className="font-cairo text-gray-700 text-sm">
                      {student?.instructor.email || "بريد إلكتروني غير متوفر"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Phone size={16} className="text-islamic-golden" />
                    <span className="font-cairo text-gray-700 text-sm">
                      {student?.instructor.phone_number || "رقم هاتف غير متوفر"}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      {/* 🟢 التقدم في الحفظ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-amiri text-3xl font-bold text-islamic-golden mb-8">
            تقدم الحفظ
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 🟢 الجزء الحالي */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="font-cairo font-bold text-xl text-islamic-primary mb-6">
                الجزء الحالي
              </h3>

              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-islamic-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={32} className="text-white" />
                </div>
                <h4 className="font-cairo font-bold text-2xl text-islamic-dark mb-2">
                  {recitations.current_juz}
                </h4>
              </div>

              <div className="space-y-4">
                {/* 🟢 عرض التقدم بالصفحات بدلاً من النسب المئوية */}
                <div className="flex justify-between items-center">
                  <span className="font-cairo text-gray-600">
                    الصفحات المكتملة:
                  </span>
                  <span className="font-cairo font-bold text-islamic-primary">
                    {recitations.current_juz_page} من 20 صفحة
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-islamic-primary h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${(recitations.current_juz_page / 20) * 100}%`,
                    }}
                  ></div>
                </div>

                <div className="text-center">
                  <span className="font-cairo text-lg font-bold text-islamic-golden">
                    {Math.round((recitations.current_juz_page / 20) * 100)}% من
                    الجزء الحالي
                  </span>
                </div>
              </div>
            </div>

            {/* 🟢 الأجزاء المسبورة */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="font-cairo font-bold text-xl text-islamic-primary mb-6">
                الاجزاء التي تم سبرها
              </h3>

              <div className="space-y-3">
                {student.quran_passed_parts &&
                student.quran_passed_parts.length > 0 ? (
                  student.quran_passed_parts.map((juz, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-green-50 rounded-lg"
                    >
                      <Award size={20} className="text-green-600" />
                      <span className="font-cairo font-medium text-islamic-dark">
                        {juz}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-cairo">
                        مكتمل
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="font-cairo text-gray-500">
                    لا يوجد أجزاء تم سبرها
                  </p>
                )}
              </div>

              <div className="mt-6 text-center">
                <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-islamic-gray-light p-3 rounded-lg">
                  <Award size={24} className="text-islamic-golden" />
                  <span className="font-cairo font-bold text-islamic-primary">
                    {student.quran_passed_parts?.length ?? 0} أجزاء تم سبرها
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 🟢 سجل الحضور - البيانات مستوردة من ملف البيانات */}
      {/* 🟢 سجل الحضور - بيانات الدورة والدروس من student.currentCourses مباشرة */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-amiri text-3xl font-bold text-islamic-golden mb-8">
            سجل الحضور
          </h2>

          {/* 🟢 بطاقات الدورات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {courses?.map((course, index) => (
              <div
                key={index}
                onClick={() =>
                  setSelectedCourse(selectedCourse === course ? null : course)
                }
                className="bg-islamic-gray-light p-6 rounded-lg cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-islamic-primary"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <BookOpen size={24} className="text-islamic-primary" />
                    <h3 className="font-cairo font-bold text-lg text-islamic-dark">
                      {course.title}
                    </h3>
                  </div>
                  <div className="text-islamic-primary">
                    {selectedCourse === course ? "▼" : "▶"}
                  </div>
                </div>
                <p className="font-cairo text-gray-600 text-sm mt-2">
                  انقر لعرض سجل الحضور التفصيلي
                </p>
              </div>
            ))}
          </div>

          {/* 🟢 جدول الحضور للدورة المحددة */}
          {selectedCourse && (
            <div className="bg-white border-2 border-islamic-primary rounded-lg p-6">
              <h3 className="font-cairo font-bold text-xl text-islamic-primary mb-6">
                سجل الحضور - {selectedCourse.title}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-islamic-gray-light">
                      <th className="font-cairo font-bold text-islamic-dark p-3 text-right">
                        التاريخ
                      </th>
                      <th className="font-cairo font-bold text-islamic-dark p-3 text-right">
                        الوقت
                      </th>
                      <th className="font-cairo font-bold text-islamic-dark p-3 text-right">
                        الحالة
                      </th>
                      {/* عمود جديد لاسم الجلسة */}
                      <th className="font-cairo font-bold text-islamic-dark p-3 text-right">
                        اسم الجلسة
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.lessons
                      .map((lesson) => {
                        const lessonAttendance = attendance.find(
                          (a) =>
                            a.lesson.id === lesson.id &&
                            a.student.id === Number(student.id)
                        );

                        return {
                          date: lesson.lesson_date,
                          time:
                            lessonAttendance?.student_attendance_time ?? "—",
                          status:
                            lessonAttendance?.student_attendance === 1
                              ? "حاضر"
                              : lessonAttendance?.student_attendance === 0
                              ? "غائب"
                              : "—",
                          // إضافة اسم الجلسة هنا
                          sessionName: lesson.lesson_title,
                        };
                      })
                      .filter(Boolean)
                      .map((record, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="font-cairo p-3">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Calendar
                                size={16}
                                className="text-islamic-primary"
                              />
                              <span>{record.date}</span>
                            </div>
                          </td>
                          <td className="font-cairo p-3">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Clock
                                size={16}
                                className="text-islamic-golden"
                              />
                              <span>{record.time}</span>
                            </div>
                          </td>
                          <td className="font-cairo p-3">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <CheckCircle
                                size={16}
                                className={
                                  record.status === "حاضر"
                                    ? "text-green-600"
                                    : record.status === "غائب"
                                    ? "text-red-600"
                                    : "text-gray-400"
                                }
                              />
                              <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                  record.status === "حاضر"
                                    ? "bg-green-100 text-green-800"
                                    : record.status === "غائب"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {record.status}
                              </span>
                            </div>
                          </td>
                          {/* عرض اسم الجلسة */}
                          <td className="font-cairo p-3">
                            {record.sessionName}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* باقي الكود للإحصائيات كما هو */}
              {/* ... */}
            </div>
          )}
        </div>
      </section>
      ;
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-amiri text-3xl font-bold text-islamic-golden mb-8">
            الامتحانات والتقييمات
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(student.exams ?? []).map((exam) => (
              <div key={exam.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="font-cairo font-bold text-lg text-islamic-dark mb-3">
                  {exam.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                      <Calendar size={16} className="text-islamic-primary" />
                      <span className="font-cairo text-gray-600 text-sm">
                        التاريخ:
                      </span>
                    </div>
                    <p className="font-cairo font-medium text-islamic-dark">
                      {exam.date}
                    </p>
                  </div>
                  <div>
                    <span className="font-cairo text-gray-600 text-sm">
                      الدرجة:
                    </span>
                    <p className="font-cairo font-bold text-2xl text-islamic-primary">
                      {exam.score}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <span
                    className={`font-cairo px-4 py-2 rounded-full text-sm ${
                      exam.grade === "ممتاز"
                        ? "bg-green-100 text-green-800"
                        : exam.grade === "جيد جداً"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {exam.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* 🟢 الدورات الحالية */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-amiri text-3xl font-bold text-islamic-golden mb-8">
            الدورات الحالية
          </h2>

          <div className="bg-islamic-gray-light p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-cairo font-bold text-xl text-islamic-dark mb-4">
                  الدورات المسجل بها
                </h3>
                <div className="space-y-3">
                  {student.courses.map((course, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rtl:space-x-reverse p-3 bg-white rounded-lg"
                    >
                      <BookOpen size={20} className="text-islamic-primary" />
                      <span className="font-cairo font-medium text-islamic-dark">
                        {course.title}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-cairo text-gray-600">
                      المدرس المشرف:
                    </span>
                    <span className="font-cairo font-medium">
                      {student.instructors?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-cairo text-gray-600">التخصص:</span>
                    <span className="font-cairo font-medium">
                      {student.instructors?.religious_qualifications}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-32 h-32 bg-islamic-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {student.progress}%
                  </span>
                </div>
                <p className="font-cairo text-gray-600">
                  نسبة الإنجاز الإجمالية
                </p>

                {/* 🟢 ملاحظات المدرس */}
                <div className="mt-6 bg-white p-4 rounded-lg">
                  <h4 className="font-cairo font-bold text-lg text-islamic-primary mb-2">
                    ملاحظات المدرس
                  </h4>
                  <p className="font-cairo text-gray-700 text-sm leading-relaxed">
                    {student.notes}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentProfile;
