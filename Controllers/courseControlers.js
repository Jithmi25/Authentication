import Course from "../models/course.js";

export async function getDashboardData(req, res) {
  try {
    const recommended = await Course.find({ recommended: true }).limit(6);
    const mostPopular = await Course.find().sort({ popularScore: -1 }).limit(6);
    return res.json({ recommended, mostPopular });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getCourses(req, res) {
  try {
    const { page = 1, perPage = 12, category, level } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (level) filter.level = level;

    const skip = (Number(page) - 1) * Number(perPage);
    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter).skip(skip).limit(Number(perPage));

    return res.json({ courses, total, page: Number(page), perPage: Number(perPage) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createCourse(req, res) {
  try {
    const data = req.body;
    const course = new Course(data);
    await course.save();
    return res.status(201).json({ course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const update = req.body;
    const course = await Course.findByIdAndUpdate(id, update, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.json({ course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.json({ course });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
