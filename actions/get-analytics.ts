import db from '@/lib/db';
import { Course, Purchase, Category } from '@/lib/generated/prisma';

type PurchaseWithCourse = Purchase & {
  course: Course;
};

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
  const grouped: {
    [courseTitle: string]: number;
  } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price!;
  });
  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    });

    const grouped = groupByCourse(purchases);

    const data = Object.entries(grouped).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, purchase) => {
      return acc + purchase.total;
    }, 0);

    const totalSales = purchases.length;

    return {
      totalRevenue,
      totalSales,
      data,
    };
  } catch (error) {
    console.log('[GET_ANALYTICS]', error);
    return {
      totalRevenue: 0,
      totalSales: 0,
      data: [],
    };
  }
};
