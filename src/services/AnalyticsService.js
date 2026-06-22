import { connectDB } from "@/lib/db";
import Campaign from "@/models/Campaign";
import Course from "@/models/Course";
import Feedback from "@/models/Feedback";
import FeedbackStats from "@/models/FeedbackStats";
import Teacher from "@/models/Teacher";

class AnalyticsService {
  async dashboard() {
    await connectDB();
    const now = new Date();
    const [totalFeedback, totalTeachers, totalCourses, activeCampaigns, trend] =
      await Promise.all([
        Feedback.countDocuments(),
        Teacher.countDocuments({ isActive: true }),
        Course.countDocuments({ isActive: true }),
        Campaign.countDocuments({
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now },
        }),
        Feedback.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              submissions: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $limit: 30 },
        ]),
      ]);
    return {
      totalFeedback,
      totalTeachers,
      totalCourses,
      activeCampaigns,
      feedbackTrend: trend.map((x) => ({
        date: x._id,
        submissions: x.submissions,
      })),
    };
  }
  async teachers() {
    await connectDB();
    const rows = await FeedbackStats.aggregate([
      {
        $group: {
          _id: "$teacherId",
          averageRating: { $avg: "$averageRating" },
          totalResponses: { $sum: "$totalResponses" },
        },
      },
      {
        $lookup: {
          from: "teachers",
          localField: "_id",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      {
        $project: {
          _id: 0,
          teacherId: "$_id",
          name: "$teacher.name",
          department: "$teacher.department",
          averageRating: { $round: ["$averageRating", 2] },
          totalResponses: 1,
        },
      },
      { $sort: { averageRating: -1 } },
    ]);
    const overallAverage = rows.length
      ? rows.reduce((sum, row) => sum + row.averageRating, 0) / rows.length
      : 0;
    return {
      overallAverage: Number(overallAverage.toFixed(2)),
      topRated: rows.slice(0, 10),
      lowestRated: rows.slice(-10).reverse(),
    };
  }
  async courses() {
    await connectDB();
    return Feedback.aggregate([
      {
        $project: {
          courseId: 1,
          semester: 1,
          ratings: {
            $concatArrays: ["$infrastructure.rating", "$academic.rating"],
          },
        },
      },
      { $unwind: { path: "$ratings", preserveNullAndEmptyArrays: false } },
      {
        $group: {
          _id: { courseId: "$courseId", semester: "$semester" },
          averageRating: { $avg: "$ratings" },
          responses: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id.courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          _id: 0,
          courseId: "$_id.courseId",
          course: "$course.name",
          semester: "$_id.semester",
          averageRating: { $round: ["$averageRating", 2] },
          responses: 1,
        },
      },
      { $sort: { course: 1, semester: 1 } },
    ]);
  }
  async campaigns() {
    await connectDB();
    const [campaigns, trends] = await Promise.all([
      Campaign.aggregate([
        {
          $lookup: {
            from: "feedbacks",
            localField: "_id",
            foreignField: "campaignId",
            as: "feedback",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseIds",
            foreignField: "_id",
            as: "courses",
          },
        },
        {
          $set: {
            totalResponses: { $size: "$feedback" },
            targetResponses: { $sum: "$courses.studentCount" },
          },
        },
        {
          $project: {
            title: 1,
            isActive: 1,
            startDate: 1,
            endDate: 1,
            totalResponses: 1,
            targetResponses: 1,
            participationRate: {
              $cond: [
                { $gt: ["$targetResponses", 0] },
                {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ["$totalResponses", "$targetResponses"] },
                        100,
                      ],
                    },
                    2,
                  ],
                },
                null,
              ],
            },
          },
        },
        { $sort: { startDate: -1 } },
      ]),
      Feedback.aggregate([
        {
          $group: {
            _id: {
              campaignId: "$campaignId",
              date: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
            },
            submissions: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
      ]),
    ]);
    return campaigns.map((campaign) => ({
      ...campaign,
      feedbackTrend: trends
        .filter((row) => row._id.campaignId.equals(campaign._id))
        .map((row) => ({ date: row._id.date, submissions: row.submissions })),
    }));
  }
}
export default new AnalyticsService();
