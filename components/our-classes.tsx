export function OurClasses() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Classes</h2>
          <h3 className="text-3xl font-semibold text-amber-600 mb-8">课程简介</h3>
          <div className="max-w-4xl mx-auto space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              Since 2015, Golden Sunshine Academy has proudly served the community as a thriving school offering
              Chinese, English, Spanish, and various other subjects that enhance their American K-12 curriculum.
            </p>
            <p className="text-lg">
              自2015年以来，金色阳光学院作为一所蓬勃发展的学校，自豪地为社区提供中文、英文、西班牙语和各种其他科目的教学，以增强美国K-12课程体系。
            </p>
            <p className="text-lg">
              Rooted in times and times study, our excellent teaching staff and student-centered teaching philosophy
              have earned the trust and recognition of an increasing number of students and parents.
            </p>
            <p className="text-lg">
              扎根于时代的学习，我们优秀的教学团队和以学生为中心的教学理念赢得了越来越多学生和家长的信任和认可。我们致力于提供高质量的教育，帮助学生在学术和个人发展方面取得成功。
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center shadow-lg">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chinese Classes</h3>
            <h4 className="text-lg font-semibold text-blue-600 mb-4">中文课</h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Our Chinese classes are designed for both children and adults, covering a wide range of levels from
              beginner to advanced.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              我们的中文课程专为儿童和成人设计，涵盖从初级到高级的各个水平。无论您是想学习基础汉字，还是想提高阅读和写作能力，我们都有适合您的课程。
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center shadow-lg">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">🇬🇧</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">English Classes</h3>
            <h4 className="text-lg font-semibold text-green-600 mb-4">英文课</h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Our English classes are tailored to accommodate students at various proficiency levels. It is our mission
              to provide personalized guidance designed to suit each student's unique learning style.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              我们的英文课程专为不同水平的学生量身定制。我们的使命是提供个性化指导，以适应每个学生独特的学习风格。无论您是想提高口语能力，还是想准备标准化考试，我们都能帮助您。
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center shadow-lg">
            <div className="w-20 h-20 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">🔢</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Math Classes</h3>
            <h4 className="text-lg font-semibold text-purple-600 mb-4">数学课</h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              We offer specialized math tutoring for students at all levels, from elementary school to high school. Our
              courses focus on building strong foundational skills in mathematics.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              我们为各个年级的学生提供专业的数学辅导，从小学到高中。我们的课程专注于建立扎实的数学基础技能，帮助学生在数学竞赛和标准化考试中取得优异成绩。
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 text-center shadow-lg">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-3xl">♟️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chess Classes</h3>
            <h4 className="text-lg font-semibold text-red-600 mb-4">国际象棋</h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              We are Chess classes and courses for beginners to advanced players. Our experienced instructors will help
              you master the game.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              我们为初学者到高级玩家提供国际象棋课程。我们经验丰富的教练将帮助您掌握这项游戏，培养战略思维和问题解决能力。
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">课程详情 Course Details</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <img
              src="/chinese-class-poster-with-teacher-profile.jpg"
              alt="Chinese Class Poster"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="/2025-spring-semester-registration-poster.jpg"
              alt="Spring Registration"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="/summer-camp-2025-poster-with-activities.jpg"
              alt="Summer Camp"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="/math-competition-training-poster.jpg"
              alt="Math Competition"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="/english-writing-class-poster.jpg"
              alt="English Writing"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src="/chess-tournament-announcement-poster.jpg"
              alt="Chess Tournament"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Class Schedule</h3>
          <h4 className="text-2xl font-semibold text-center text-amber-600 mb-12">课程表</h4>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-amber-500 text-white p-4">
                <h4 className="text-xl font-bold">FALL 2025 秋季学期课程表</h4>
                <p className="text-sm">Irvine Campus 尔湾校区</p>
              </div>
              <div className="p-6">
                <img
                  src="/fall-2025-class-schedule-table-for-irvine-campus.jpg"
                  alt="Irvine Schedule"
                  className="w-full rounded"
                />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-amber-500 text-white p-4">
                <h4 className="text-xl font-bold">FALL 2025 秋季学期课程表</h4>
                <p className="text-sm">Yorba Linda Campus 约巴林达校区</p>
              </div>
              <div className="p-6">
                <img
                  src="/fall-2025-class-schedule-table-for-yorba-linda-cam.jpg"
                  alt="Yorba Linda Schedule"
                  className="w-full rounded"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-700 text-lg mb-4">
              For more information about class schedules and registration, please contact us.
            </p>
            <p className="text-gray-700 text-lg">有关课程安排和注册的更多信息，请联系我们。</p>
          </div>
        </div>
      </div>
    </section>
  )
}
